import { useNavigate } from 'react-router-dom';
import {
  Package2, AlertTriangle, Boxes, Radio, CheckCircle2, Clock,
  Wifi, TrendingUp, Plus, Play, RefreshCw, ArrowRight
} from 'lucide-react';
import Layout from '../components/Layout';
import { dashboardStats, rfidScans, divergences, assets, inventoryItems } from '../lib/data';

function KPICard({ title, value, sub, icon: Icon, color, trend }: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
          {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-700 w-6 text-right">{value}</span>
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 40, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <svg viewBox="0 0 100 100" className="w-20 h-20 flex-shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              strokeWidth="18" stroke={seg.color}
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-600 flex-1">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-800">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusLabels: Record<string, string> = {
  approved: 'Aprovado', completed: 'Concluído',
  pending_review: 'Aguard. Revisão', in_progress: 'Em Andamento'
};
const statusColors: Record<string, string> = {
  approved: 'text-emerald-600', completed: 'text-yellow-600',
  pending_review: 'text-amber-600', in_progress: 'text-slate-600'
};

export default function Dashboard() {
  const navigate = useNavigate();

  const assetSegments = [
    { label: 'Ativo', value: assets.filter(a => a.current_status === 'active').length, color: '#10b981' },
    { label: 'Ausente', value: assets.filter(a => a.current_status === 'missing').length, color: '#ef4444' },
    { label: 'Manutenção', value: assets.filter(a => a.current_status === 'maintenance').length, color: '#f59e0b' },
    { label: 'Transferido', value: assets.filter(a => a.current_status === 'transferred').length, color: '#f97316' },
  ];

  const divSegments = [
    { label: 'Ativo Ausente', value: divergences.filter(d => d.divergence_type === 'missing_asset').length, color: '#ef4444' },
    { label: 'Local Errado', value: divergences.filter(d => d.divergence_type === 'wrong_location').length, color: '#f59e0b' },
    { label: 'Estoque Faltante', value: divergences.filter(d => d.divergence_type === 'missing_stock').length, color: '#f97316' },
    { label: 'Estoque Extra', value: divergences.filter(d => d.divergence_type === 'extra_stock').length, color: '#f97316' },
    { label: 'Tag Desconhecida', value: divergences.filter(d => d.divergence_type === 'unknown_tag').length, color: '#8b5cf6' },
    { label: 'Divergência ERP', value: divergences.filter(d => d.divergence_type === 'erp_mismatch').length, color: '#06b6d4' },
  ].filter(d => d.value > 0);

  const accuracy = dashboardStats.inventoryAccuracy;

  const quickActions = [
    { label: 'Iniciar Auditoria', icon: Play, color: 'bg-yellow-600 hover:bg-yellow-700', action: () => navigate('/scans/new') },
    { label: 'Contagem de Estoque', icon: Radio, color: 'bg-emerald-600 hover:bg-emerald-700', action: () => navigate('/scans/new') },
    { label: 'Novo Ativo', icon: Plus, color: 'bg-slate-700 hover:bg-slate-800', action: () => navigate('/assets/new') },
    { label: 'Novo Produto', icon: Plus, color: 'bg-slate-700 hover:bg-slate-800', action: () => navigate('/inventory/new') },
    { label: 'Divergências', icon: AlertTriangle, color: 'bg-red-600 hover:bg-red-700', action: () => navigate('/divergences') },
    { label: 'Sincronizar ERP', icon: RefreshCw, color: 'bg-teal-600 hover:bg-teal-700', action: () => navigate('/integrations') },
  ];

  return (
    <Layout title="Dashboard" subtitle="Visão geral das operações RFID — TechCorp Industries">
      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-2 mb-5">
        {quickActions.map(({ label, icon: Icon, color, action }) => (
          <button key={label} onClick={action}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${color}`}>
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KPICard title="Total de Ativos" value={dashboardStats.totalAssets} sub="Cadastrados no sistema"
          icon={Package2} color="bg-yellow-50 text-yellow-600" trend="+2 este mês" />
        <KPICard title="Ativos em Uso" value={dashboardStats.activeAssets} sub="Em operação normal"
          icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        <KPICard title="Ativos Ausentes" value={dashboardStats.missingAssets} sub="Requer investigação"
          icon={AlertTriangle} color="bg-red-50 text-red-600" />
        <KPICard title="Divergências Abertas" value={dashboardStats.openDivergences} sub="Pendente de resolução"
          icon={AlertTriangle} color="bg-yellow-50 text-yellow-600" />
        <KPICard title="Total de Produtos" value={dashboardStats.totalProducts} sub="SKUs cadastrados"
          icon={Boxes} color="bg-teal-50 text-teal-600" />
        <KPICard title="Divergências de Estoque" value={dashboardStats.stockDivergences} sub="Itens com problemas"
          icon={TrendingUp} color="bg-amber-50 text-amber-600" />
        <KPICard title="Status do ERP" value="Conectado"
          sub="SAP Business One" icon={Wifi} color="bg-emerald-50 text-emerald-600" />
        <KPICard title="Última Leitura RFID" value="Hoje 09:00"
          sub="Auditoria — Sala de TI" icon={Clock} color="bg-slate-100 text-slate-600" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Ativos por Status</h3>
          <DonutChart segments={assetSegments} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Precisão do Estoque</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={accuracy >= 80 ? '#10b981' : '#f59e0b'}
                  strokeWidth="16" strokeDasharray={`${(accuracy / 100) * 251} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{accuracy}%</span>
              </div>
            </div>
            <div className="w-full mt-4 space-y-2">
              <MiniBar label="Correto" value={inventoryItems.filter(i=>i.status==='correct').length} max={inventoryItems.length} color="bg-emerald-500" />
              <MiniBar label="Faltante" value={inventoryItems.filter(i=>i.status==='missing').length} max={inventoryItems.length} color="bg-red-400" />
              <MiniBar label="Extra" value={inventoryItems.filter(i=>i.status==='extra').length} max={inventoryItems.length} color="bg-yellow-400" />
              <MiniBar label="Não Lido" value={inventoryItems.filter(i=>i.status==='not_scanned').length} max={inventoryItems.length} color="bg-slate-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Divergências por Tipo</h3>
          <DonutChart segments={divSegments} />
        </div>
      </div>

      {/* Leituras Recentes */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Leituras RFID Recentes</h3>
          <button onClick={() => navigate('/scans')}
            className="text-xs text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {rfidScans.slice(0, 5).map(scan => {
            const acc = scan.total_expected_items > 0
              ? Math.round((scan.total_expected_items - scan.missing_items) / scan.total_expected_items * 100)
              : 100;
            const typeMap: Record<string, string> = {
              asset_audit: 'Auditoria de Ativos', stock_count: 'Contagem de Estoque',
              location_check: 'Verificação de Local', full_inventory: 'Inventário Completo'
            };
            return (
              <div key={scan.id} className="flex items-center px-4 py-3.5 hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(`/scans/${scan.id}`)}>
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Radio className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {typeMap[scan.scan_type] ?? scan.scan_type} — {scan.location_name}
                  </p>
                  <p className="text-xs text-slate-500">{scan.operator_name} · {new Date(scan.scan_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-500">{scan.total_scanned_items}/{scan.total_expected_items} itens</p>
                    <p className="text-xs font-semibold text-slate-700">{acc}% precisão</p>
                  </div>
                  <span className={`text-xs font-medium hidden xs:block ${statusColors[scan.status] ?? 'text-slate-600'}`}>
                    {statusLabels[scan.status] ?? scan.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status ERP */}
      <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">SAP Business One — Conectado</p>
            <p className="text-xs text-emerald-700">Última sincronização: Hoje às 06:00 · Próxima em 8 horas</p>
          </div>
        </div>
        <button onClick={() => navigate('/integrations')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Sincronizar Agora
        </button>
      </div>
    </Layout>
  );
}
