import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { divergences, locations } from '../../lib/data';

const modules = ['All', 'assets', 'inventory'];
const divTypes = ['All', 'missing_asset', 'wrong_location', 'missing_stock', 'extra_stock', 'unknown_tag', 'erp_mismatch'];
const priorities = ['All', 'critical', 'high', 'medium', 'low'];
const statuses = ['All', 'open', 'in_review', 'resolved', 'ignored'];

const typeLabels: Record<string, string> = {
  missing_asset: 'Ativo Faltante', wrong_location: 'Local Incorreto',
  missing_stock: 'Estoque Faltante', extra_stock: 'Estoque Extra',
  unknown_tag: 'Tag Desconhecida', erp_mismatch: 'Divergência ERP'
};

export default function DivergenceList() {
  const navigate = useNavigate();
  const [filterModule, setFilterModule] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = divergences.filter(d => {
    const matchModule = filterModule === 'All' || d.module === filterModule;
    const matchType = filterType === 'All' || d.divergence_type === filterType;
    const matchPriority = filterPriority === 'All' || d.priority === filterPriority;
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchLoc = filterLoc === 'All' || d.location_id === filterLoc;
    return matchModule && matchType && matchPriority && matchStatus && matchLoc;
  });

  return (
    <Layout
      title="Divergências"
      subtitle={`${filtered.length} divergências · ${divergences.filter(d => d.status === 'open').length} abertas`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Abertas', val: divergences.filter(d=>d.status==='open').length, bg:'bg-red-50', color:'text-red-700' },
          { label: 'Em Revisão', val: divergences.filter(d=>d.status==='in_review').length, bg:'bg-amber-50', color:'text-amber-700' },
          { label: 'Resolvidas', val: divergences.filter(d=>d.status==='resolved').length, bg:'bg-emerald-50', color:'text-emerald-700' },
          { label: 'Críticas', val: divergences.filter(d=>d.priority==='critical').length, bg:'bg-red-50', color:'text-red-800' },
        ].map(({ label, val, bg, color }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${showFilters ? 'text-yellow-600' : 'text-slate-600'}`}>
          <Filter className="w-4 h-4" /> Filtros
        </button>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-100">
            {[
              { label: 'Módulo', val: filterModule, set: setFilterModule, opts: modules },
              { label: 'Tipo', val: filterType, set: setFilterType, opts: divTypes },
              { label: 'Prioridade', val: filterPriority, set: setFilterPriority, opts: priorities },
              { label: 'Status', val: filterStatus, set: setFilterStatus, opts: statuses },
              { label: 'Localização', val: filterLoc, set: setFilterLoc, opts: ['All', ...locations.map(l => l.id)] },
            ].map(({ label, val, set, opts }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 font-medium mb-1 block">{label}</label>
                <select value={val} onChange={e => set(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  {opts.map(o => {
                    const locLabel = locations.find(l => l.id === o)?.location_name ?? o;
                    const display = label === 'Localização' ? locLabel : (o === 'All' ? 'Todos' : (typeLabels[o] ?? o.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase())));
                    return <option key={o} value={o}>{display}</option>;
                  })}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(div => (
          <div key={div.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm cursor-pointer transition-all"
            onClick={() => navigate(`/divergences/${div.id}`)}>
            <div className="flex items-start gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                div.priority === 'critical' ? 'bg-red-100' :
                div.priority === 'high' ? 'bg-yellow-100' :
                div.priority === 'medium' ? 'bg-amber-100' : 'bg-slate-100'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  div.priority === 'critical' ? 'text-red-600' :
                  div.priority === 'high' ? 'text-yellow-600' :
                  div.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{typeLabels[div.divergence_type]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${div.module === 'assets' ? 'bg-yellow-50 text-yellow-700' : 'bg-teal-50 text-teal-700'}`}>
                    {div.module === 'assets' ? 'Ativos' : 'Estoque'}
                  </span>
                  <StatusBadge status={div.priority} size="sm" />
                  <StatusBadge status={div.status} size="sm" />
                </div>
                <p className="text-sm text-slate-700 mb-1">
                  {div.related_asset_name || div.related_product_name || 'Unknown Item'}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>RFID: <span className="font-mono font-medium text-slate-700">{div.rfid_tag_code}</span></span>
                  <span>Esperado: <span className="font-medium text-slate-700">{div.expected_value}</span></span>
                  <span>Encontrado: <span className={`font-medium ${div.found_value === 'Not Found' ? 'text-red-600' : 'text-slate-700'}`}>{div.found_value}</span></span>
                  <span>Local: {div.location_name}</span>
                  {div.responsible_user_name && <span>Responsável: {div.responsible_user_name}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); navigate(`/divergences/${div.id}`); }}
                  className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                {div.status !== 'resolved' && (
                  <button onClick={e => e.stopPropagation()}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark resolved">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
              <span className="text-xs text-slate-400">Criado: {new Date(div.created_at).toLocaleDateString()}</span>
              {div.resolved_at && <span className="text-xs text-emerald-600">Resolvido: {new Date(div.resolved_at).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-500">Nenhuma divergência corresponde aos filtros</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
