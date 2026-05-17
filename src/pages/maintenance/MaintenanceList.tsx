import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench, Calendar, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { getMaintenanceRecords } from '../../lib/firestore';
import { assets as sampleAssets } from '../../lib/data';
import type { MaintenanceRecord } from '../../types';
import { useAuth } from '../../lib/auth-context';

const typeLabels: Record<string, string> = {
  corrective: 'Corretiva', preventive: 'Preventiva', predictive: 'Preditiva',
  calibration: 'Calibração', inspection: 'Inspeção', upgrade: 'Atualização',
};
const typeColors: Record<string, string> = {
  corrective: 'bg-red-50 text-red-700', preventive: 'bg-emerald-50 text-emerald-700',
  predictive: 'bg-yellow-50 text-yellow-700', calibration: 'bg-amber-50 text-amber-700',
  inspection: 'bg-slate-100 text-slate-700', upgrade: 'bg-teal-50 text-teal-700',
};

// Demo data for display
const demoMaintenance: MaintenanceRecord[] = [
  { id: 'mnt-001', company_id: 'comp-001', asset_id: 'ast-006', asset_name: 'HP EliteDesk 800', rfid_tag_code: 'MTL-A0006', maintenance_type: 'corrective', status: 'in_progress', priority: 'high', title: 'Substituição de GPU', description: 'Falha na GPU - substituição necessária', scheduled_date: '2025-05-12', estimated_cost: 1200, service_provider: 'HP Service Center', technician_name: 'José Ferreira', work_order_number: 'WO-2025-001', created_at: '2025-05-06T08:00:00Z' },
  { id: 'mnt-002', company_id: 'comp-001', asset_id: 'ast-001', asset_name: 'Dell XPS 15 Notebook', rfid_tag_code: 'MTL-A0001', maintenance_type: 'preventive', status: 'scheduled', priority: 'low', title: 'Limpeza e verificação anual', description: 'Manutenção preventiva programada - limpeza interna e verificação de componentes', scheduled_date: '2025-06-01', estimated_cost: 150, technician_name: 'Carlos Silva', created_at: '2025-05-01T10:00:00Z' },
  { id: 'mnt-003', company_id: 'comp-001', asset_id: 'ast-008', asset_name: 'Cisco Catalyst Switch', rfid_tag_code: 'MTL-A0008', maintenance_type: 'inspection', status: 'completed', priority: 'medium', title: 'Inspeção de firmware e logs', description: 'Verificação de firmware, análise de logs de rede e atualização de configurações', scheduled_date: '2025-05-05', completed_at: '2025-05-05T15:30:00Z', actual_cost: 0, technician_name: 'Carlos Silva', resolution_notes: 'Firmware atualizado para v17.9.4. Nenhuma anomalia encontrada.', next_maintenance_date: '2025-11-05', created_at: '2025-04-25T09:00:00Z' },
  { id: 'mnt-004', company_id: 'comp-001', asset_id: 'ast-009', asset_name: 'APC UPS 2200VA', rfid_tag_code: 'MTL-A0009', maintenance_type: 'predictive', status: 'scheduled', priority: 'critical', title: 'Substituição de bateria', description: 'Monitoramento indicou degradação da bateria (capacidade em 62%). Substituição preventiva recomendada.', scheduled_date: '2025-05-20', estimated_cost: 1800, service_provider: 'APC by Schneider', created_at: '2025-05-10T11:00:00Z' },
  { id: 'mnt-005', company_id: 'comp-001', asset_id: 'ast-003', asset_name: 'Samsung Monitor 27"', rfid_tag_code: 'MTL-A0003', maintenance_type: 'calibration', status: 'pending_parts', priority: 'medium', title: 'Calibração de cores e ajuste de brilho', description: 'Calibração profissional para uso em design gráfico', scheduled_date: '2025-05-25', estimated_cost: 300, service_provider: 'DisplayPro', created_at: '2025-05-08T14:00:00Z' },
];

const priorityIcons: Record<string, React.ReactNode> = {
  critical: <AlertTriangle className="w-4 h-4 text-red-500" />,
  high: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  medium: <Clock className="w-4 h-4 text-amber-500" />,
  low: <CheckCircle2 className="w-4 h-4 text-slate-400" />,
};

export default function MaintenanceList() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [records, setRecords] = useState<MaintenanceRecord[]>(demoMaintenance);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    asset_id: sampleAssets[0]?.id ?? '',
    maintenance_type: 'preventive',
    priority: 'medium',
    title: '',
    description: '',
    scheduled_date: '',
    estimated_cost: '',
    service_provider: '',
    technician_name: '',
  });

  const canManage = userProfile?.role === 'admin' || userProfile?.role === 'manager';

  // Load from Firestore on mount
  useEffect(() => {
    if (userProfile?.company_id) {
      getMaintenanceRecords(userProfile.company_id)
        .then(data => { if (data.length > 0) setRecords(data); })
        .catch(() => {/* use demo data */});
    }
  }, [userProfile]);

  const filtered = records.filter(r => {
    return (filterStatus === 'All' || r.status === filterStatus) &&
           (filterType === 'All' || r.maintenance_type === filterType);
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const asset = sampleAssets.find(a => a.id === form.asset_id);
      const newRecord: MaintenanceRecord = {
        id: `mnt-${Date.now()}`,
        company_id: userProfile?.company_id ?? 'comp-001',
        asset_id: form.asset_id,
        asset_name: asset?.asset_name,
        rfid_tag_code: asset?.rfid_tag_code,
        maintenance_type: form.maintenance_type as MaintenanceRecord['maintenance_type'],
        status: 'scheduled',
        priority: form.priority as MaintenanceRecord['priority'],
        title: form.title,
        description: form.description,
        scheduled_date: form.scheduled_date,
        estimated_cost: form.estimated_cost ? Number(form.estimated_cost) : undefined,
        service_provider: form.service_provider || undefined,
        technician_name: form.technician_name || undefined,
        created_at: new Date().toISOString(),
      };
      setRecords(prev => [newRecord, ...prev]);
      setShowNew(false);
      setForm({ asset_id: sampleAssets[0]?.id ?? '', maintenance_type: 'preventive', priority: 'medium', title: '', description: '', scheduled_date: '', estimated_cost: '', service_provider: '', technician_name: '' });
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    { label: 'Total', val: records.length, bg: 'bg-slate-50', color: 'text-slate-700' },
    { label: 'Agendadas', val: records.filter(r => r.status === 'scheduled').length, bg: 'bg-yellow-50', color: 'text-yellow-700' },
    { label: 'Em andamento', val: records.filter(r => r.status === 'in_progress').length, bg: 'bg-amber-50', color: 'text-amber-700' },
    { label: 'Concluídas', val: records.filter(r => r.status === 'completed').length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
    { label: 'Críticas', val: records.filter(r => r.priority === 'critical').length, bg: 'bg-red-50', color: 'text-red-700' },
  ];

  return (
    <Layout
      title="Manutenção"
      subtitle={`${records.length} registros · ${records.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length} ativos`}
      actions={canManage ? (
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Manutenção
        </button>
      ) : undefined}
    >
      {/* New maintenance modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-4">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Registrar Manutenção</h2>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Ativo *</label>
                  <select value={form.asset_id} onChange={set('asset_id')} required
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    {sampleAssets.map(a => <option key={a.id} value={a.id}>{a.asset_name} — {a.rfid_tag_code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo *</label>
                  <select value={form.maintenance_type} onChange={set('maintenance_type')}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Prioridade *</label>
                  <select value={form.priority} onChange={set('priority')}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    {['low', 'medium', 'high', 'critical'].map(p => (
                      <option key={p} value={p}>{p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : p === 'high' ? 'Alta' : 'Crítica'}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Título *</label>
                  <input value={form.title} onChange={set('title')} required placeholder="ex: Substituição de bateria"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição</label>
                  <textarea value={form.description} onChange={set('description')} rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data Agendada</label>
                  <input type="date" value={form.scheduled_date} onChange={set('scheduled_date')}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Custo Estimado (R$)</label>
                  <input type="number" step="0.01" value={form.estimated_cost} onChange={set('estimated_cost')} placeholder="0,00"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Fornecedor / Empresa</label>
                  <input value={form.service_provider} onChange={set('service_provider')} placeholder="ex: HP Service Center"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Técnico Responsável</label>
                  <input value={form.technician_name} onChange={set('technician_name')} placeholder="Nome do técnico"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
                  {saving ? 'Salvando...' : 'Registrar Manutenção'}
                </button>
                <button type="button" onClick={() => setShowNew(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {stats.map(({ label, val, bg, color }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            {['All', 'scheduled', 'in_progress', 'completed', 'cancelled', 'pending_parts'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'Todos' : s === 'scheduled' ? 'Agendada' : s === 'in_progress' ? 'Em andamento' : s === 'completed' ? 'Concluída' : s === 'cancelled' ? 'Cancelada' : 'Aguard. peças'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Tipo</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option value="All">Todos</option>
            {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(rec => (
          <div key={rec.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => navigate(`/maintenance/${rec.id}`)}>
            <div className="flex items-start gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                rec.priority === 'critical' ? 'bg-red-100' : rec.priority === 'high' ? 'bg-yellow-100' : rec.priority === 'medium' ? 'bg-amber-100' : 'bg-slate-100'
              }`}>
                <Wrench className={`w-4 h-4 ${rec.priority === 'critical' ? 'text-red-600' : rec.priority === 'high' ? 'text-yellow-600' : rec.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{rec.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[rec.maintenance_type]}`}>
                    {typeLabels[rec.maintenance_type]}
                  </span>
                  <StatusBadge status={rec.priority} size="sm" />
                  <StatusBadge status={rec.status} size="sm" />
                </div>
                <p className="text-sm text-slate-600 mb-1 font-medium">{rec.asset_name}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  {rec.rfid_tag_code && <span className="font-mono">{rec.rfid_tag_code}</span>}
                  {rec.scheduled_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(rec.scheduled_date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {rec.technician_name && <span>Técnico: {rec.technician_name}</span>}
                  {rec.service_provider && <span>Fornecedor: {rec.service_provider}</span>}
                  {rec.estimated_cost != null && <span>Custo est.: R$ {rec.estimated_cost.toLocaleString('pt-BR')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {priorityIcons[rec.priority]}
                <button className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-500">Nenhum registro de manutenção encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
