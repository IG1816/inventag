import { useState } from 'react';
import { FileBarChart2, Download, RefreshCw, Plus, Calendar, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { reports } from '../lib/data';

const typeLabels: Record<string, string> = {
  asset_audit: 'Auditoria de Ativos', stock_count: 'Contagem de Estoque',
  divergence_summary: 'Resumo de Divergências', location_summary: 'Resumo por Localização',
  full_inventory: 'Inventário Completo', compliance: 'Relatório de Conformidade',
};

const formatLabels: Record<string, string> = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };

export default function Reports() {
  const [showNew, setShowNew] = useState(false);
  const [genType, setGenType] = useState('asset_audit');
  const [genFormat, setGenFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); setShowNew(false); }, 2000);
  }

  return (
    <Layout
      title="Relatórios"
      subtitle={`${reports.length} relatórios gerados`}
      actions={
        <button onClick={() => { setShowNew(true); setGenerated(false); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
          <Plus className="w-4 h-4" /> Gerar Relatório
        </button>
      }
    >
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Gerar Novo Relatório</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo de Relatório</label>
                <select value={genType} onChange={e => setGenType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Período</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" defaultValue="2025-05-01"
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  <input type="date" defaultValue="2025-05-31"
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Formato</label>
                <div className="flex gap-2">
                  {Object.entries(formatLabels).map(([k, v]) => (
                    <button key={k} onClick={() => setGenFormat(k)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${genFormat === k ? 'bg-yellow-600 text-white border-yellow-600' : 'bg-white text-slate-700 border-slate-200 hover:border-yellow-400'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleGenerate} disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
                {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Gerando...</> : 'Gerar Relatório'}
              </button>
              <button onClick={() => setShowNew(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {generated && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FileBarChart2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900">Relatório gerado com sucesso!</p>
            <p className="text-xs text-emerald-700">Seu relatório está pronto para download.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-3.5 h-3.5" /> Baixar
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total', val: reports.length, bg: 'bg-slate-50', color: 'text-slate-700' },
          { label: 'Prontos', val: reports.filter(r => r.status === 'ready').length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Gerando', val: reports.filter(r => r.status === 'generating').length, bg: 'bg-amber-50', color: 'text-amber-700' },
          { label: 'Este Mês', val: reports.filter(r => r.created_at.startsWith('2025-05')).length, bg: 'bg-yellow-50', color: 'text-yellow-700' },
        ].map(({ label, val, bg, color }) => (
          <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Histórico de Relatórios</h3>
          <span className="text-xs text-slate-500">{reports.length} relatórios</span>
        </div>
        <div className="divide-y divide-slate-50">
          {reports.map(report => (
            <div key={report.id} className="flex items-center px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <FileBarChart2 className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-semibold text-slate-900">{typeLabels[report.report_type] ?? report.report_name}</p>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium capitalize">
                    {report.module}
                  </span>
                  <StatusBadge status={report.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                  {report.generated_by_name && <span>Por: {report.generated_by_name}</span>}
                  {report.period && <span>Período: {report.period}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {report.status === 'generating' ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processando...
                  </div>
                ) : (
                  <>
                    <button className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Visualizar">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Baixar">
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
