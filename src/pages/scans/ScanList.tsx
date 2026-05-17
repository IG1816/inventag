import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Eye, Radio, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { rfidScans, locations } from '../../lib/data';

const modules = ['All', 'assets', 'inventory'];
const scanTypes = ['All', 'asset_audit', 'stock_count', 'location_check', 'full_inventory'];
const statuses = ['All', 'in_progress', 'completed', 'pending_review', 'approved'];

export default function ScanList() {
  const navigate = useNavigate();
  const [filterModule, setFilterModule] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');

  const filtered = rfidScans.filter(s => {
    const matchModule = filterModule === 'All' || s.module === filterModule;
    const matchType = filterType === 'All' || s.scan_type === filterType;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    const matchLoc = filterLoc === 'All' || s.location_id === filterLoc;
    return matchModule && matchType && matchStatus && matchLoc;
  });

  const typeLabels: Record<string, string> = {
    asset_audit: 'Auditoria de Ativos', stock_count: 'Contagem de Estoque',
    location_check: 'Verificação de Local', full_inventory: 'Inventário Completo'
  };

  return (
    <Layout
      title="Leituras RFID"
      subtitle={`${filtered.length} sessões de leitura`}
      actions={
        <button onClick={() => navigate('/scans/new')}
          className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Leitura
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total', val: rfidScans.length, bg: 'bg-slate-50', color: 'text-slate-700' },
          { label: 'Aprovadas', val: rfidScans.filter(s=>s.status==='approved').length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Aguard. Revisão', val: rfidScans.filter(s=>s.status==='pending_review').length, bg: 'bg-amber-50', color: 'text-amber-700' },
          { label: 'Concluídas', val: rfidScans.filter(s=>s.status==='completed').length, bg: 'bg-yellow-50', color: 'text-yellow-700' },
        ].map(({ label, val, bg, color }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filtros</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Módulo', val: filterModule, set: setFilterModule, opts: modules },
            { label: 'Tipo de Leitura', val: filterType, set: setFilterType, opts: scanTypes },
            { label: 'Status', val: filterStatus, set: setFilterStatus, opts: statuses },
            { label: 'Localização', val: filterLoc, set: setFilterLoc, opts: ['All', ...locations.map(l => l.id)] },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <label className="text-xs text-slate-500 font-medium mb-1 block">{label}</label>
              <select value={val} onChange={e => set(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {opts.map(o => {
                  const locLabel = locations.find(l => l.id === o)?.location_name ?? o;
                  const display = label === 'Localização' ? locLabel : (o === 'All' ? 'Todos' : o.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase()));
                  return <option key={o} value={o}>{display}</option>;
                })}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Data', 'Tipo', 'Módulo', 'Localização', 'Operador', 'Esperado', 'Lido', 'Faltante', 'Extra', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(scan => {
                const accuracy = scan.total_expected_items > 0
                  ? Math.round((scan.total_expected_items - scan.missing_items) / scan.total_expected_items * 100)
                  : 100;
                return (
                  <tr key={scan.id} className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/scans/${scan.id}`)}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-medium text-slate-900">{new Date(scan.scan_date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-400">{new Date(scan.scan_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 whitespace-nowrap">{typeLabels[scan.scan_type]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${scan.module === 'assets' ? 'bg-yellow-50 text-yellow-700' : 'bg-teal-50 text-teal-700'}`}>
                        {scan.module === 'assets' ? 'Ativos' : 'Estoque'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700 whitespace-nowrap">{scan.location_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-600 whitespace-nowrap">{scan.operator_name}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-slate-700">{scan.total_expected_items}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-slate-700">{scan.total_scanned_items}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${scan.missing_items > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {scan.missing_items}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${scan.extra_items > 0 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                        {scan.extra_items}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={scan.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); navigate(`/scans/${scan.id}`); }}
                          className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {scan.status === 'pending_review' && (
                          <button onClick={e => { e.stopPropagation(); }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma sessão de leitura encontrada</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
