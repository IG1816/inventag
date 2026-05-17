import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Radio, FileText, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { rfidScans, scanResults } from '../../lib/data';

function StatCard({ label, value, color, bg }: { label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

const resultBorderColor: Record<string, string> = {
  found_correctly: 'border-l-emerald-400',
  missing: 'border-l-red-400',
  wrong_location: 'border-l-amber-400',
  extra: 'border-l-yellow-400',
  unknown_tag: 'border-l-slate-400',
};

export default function ScanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scan = rfidScans.find(s => s.id === id);
  const results = scanResults.filter(r => r.scan_id === id);

  if (!scan) {
    return (
      <Layout title="Leitura Não Encontrada">
        <div className="text-center py-20">
          <p className="text-slate-500">Sessão de leitura não encontrada.</p>
          <button onClick={() => navigate('/scans')} className="mt-4 text-yellow-600 hover:underline text-sm">Voltar</button>
        </div>
      </Layout>
    );
  }

  const correct = results.filter(r => r.result_status === 'found_correctly').length;
  const missing = results.filter(r => r.result_status === 'missing').length;
  const extra = results.filter(r => r.result_status === 'extra').length;
  const wrong = results.filter(r => r.result_status === 'wrong_location').length;
  const unknown = results.filter(r => r.result_status === 'unknown_tag').length;
  const accuracy = scan.total_expected_items > 0
    ? Math.round((scan.total_expected_items - scan.missing_items) / scan.total_expected_items * 100)
    : 100;

  const typeLabels: Record<string, string> = {
    asset_audit: 'Auditoria de Ativos', stock_count: 'Contagem de Estoque',
    location_check: 'Verificação de Local', full_inventory: 'Inventário Completo'
  };

  return (
    <Layout
      title={`${typeLabels[scan.scan_type] ?? scan.scan_type} — ${scan.location_name}`}
      subtitle={`${scan.operator_name} · ${new Date(scan.scan_date).toLocaleString()}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/scans')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          {scan.status === 'pending_review' && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
              <CheckCircle2 className="w-4 h-4" /> Aprovar Leitura
            </button>
          )}
        </div>
      }
    >
      {/* Status + Meta */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
            <Radio className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Módulo</p>
            <p className="text-sm font-semibold text-slate-900 capitalize">{scan.module === 'assets' ? 'Ativos' : 'Estoque'}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Situação</p>
          <StatusBadge status={scan.status} />
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Operador</p>
          <p className="text-sm font-semibold text-slate-900">{scan.operator_name}</p>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Localização</p>
          <p className="text-sm font-semibold text-slate-900">{scan.location_name}</p>
        </div>
        {scan.notes && (
          <>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex-1">
              <p className="text-xs text-slate-500">Observações</p>
              <p className="text-sm text-slate-700">{scan.notes}</p>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        <StatCard label="Esperado" value={scan.total_expected_items} color="text-slate-700" bg="bg-slate-50" />
        <StatCard label="Lido" value={scan.total_scanned_items} color="text-slate-700" bg="bg-slate-50" />
        <StatCard label="Correto" value={correct} color="text-emerald-700" bg="bg-emerald-50" />
        <StatCard label="Faltante" value={missing || scan.missing_items} color="text-red-700" bg="bg-red-50" />
        <StatCard label="Extra" value={extra || scan.extra_items} color="text-yellow-700" bg="bg-yellow-50" />
        <StatCard label="Precisão" value={`${accuracy}%`} color={accuracy >= 90 ? 'text-emerald-700' : accuracy >= 70 ? 'text-amber-700' : 'text-red-700'} bg={accuracy >= 90 ? 'bg-emerald-50' : accuracy >= 70 ? 'bg-amber-50' : 'bg-red-50'} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => navigate('/divergences')}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Gerar Divergências
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors">
          <FileText className="w-4 h-4" /> Exportar Relatório
        </button>
        <button onClick={() => navigate('/scans/new')}
          className="flex items-center gap-1.5 px-3 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-100 border border-yellow-200 transition-colors">
          <RefreshCw className="w-4 h-4" /> Reler Localização
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Resultados da Leitura</h3>
          <span className="text-xs text-slate-500">{results.length > 0 ? `${results.length} itens` : 'Resultados detalhados desta leitura'}</span>
        </div>
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Tag RFID', 'Item', 'Tipo', 'Local Esperado', 'Local Lido', 'Resultado', 'Observação'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map(r => (
                  <tr key={r.id} className={`border-l-4 ${resultBorderColor[r.result_status]} hover:bg-slate-50 transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{r.rfid_tag_code}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900 whitespace-nowrap">{r.linked_item_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.linked_item_type === 'asset' ? 'bg-yellow-50 text-yellow-700' : r.linked_item_type === 'product' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r.linked_item_type === 'asset' ? 'Ativo' : r.linked_item_type === 'product' ? 'Produto' : r.linked_item_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{r.expected_location || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{r.scanned_location || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.result_status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{r.observation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Resultados detalhados estão disponíveis para leituras geradas pelo fluxo de Nova Leitura.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
