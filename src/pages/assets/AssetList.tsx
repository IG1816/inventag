import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Radio, Tag, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { assets, locations } from '../../lib/data';
import type { Asset } from '../../types';

const categories = ['All', 'notebook', 'desktop', 'monitor', 'tablet', 'smartphone', 'tool', 'machine', 'equipment', 'network', 'other'];
const statuses = ['All', 'active', 'missing', 'maintenance', 'retired', 'transferred'];
const departments = ['All', 'TI', 'Design', 'Financeiro', 'Vendas', 'Administrativo', 'Logística', 'Operações'];

export default function AssetList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.asset_name.toLowerCase().includes(q) || a.rfid_tag_code.toLowerCase().includes(q) || a.serial_number.toLowerCase().includes(q);
    const matchCat = filterCat === 'All' || a.category === filterCat;
    const matchLoc = filterLoc === 'All' || a.location_id === filterLoc;
    const matchDept = filterDept === 'All' || a.department === filterDept;
    const matchStatus = filterStatus === 'All' || a.current_status === filterStatus;
    return matchSearch && matchCat && matchLoc && matchDept && matchStatus;
  });

  const categoryIcon = (cat: Asset['category']) => {
    const icons: Record<string, string> = { notebook: '💻', desktop: '🖥️', monitor: '🖥', tablet: '📱', smartphone: '📱', network: '🔌', equipment: '⚡', tool: '🔧', machine: '⚙️', other: '📦' };
    return icons[cat] ?? '📦';
  };

  return (
    <Layout
      title="Ativos Fixos"
      subtitle={`${filtered.length} de ${assets.length} ativos`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/scans/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <Radio className="w-4 h-4" /> Iniciar Auditoria
          </button>
          <button onClick={() => navigate('/assets/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
            <Plus className="w-4 h-4" /> Novo Ativo
          </button>
        </div>
      }
    >
      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, código RFID ou número de série..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
            {[
              { label: 'Categoria', val: filterCat, set: setFilterCat, opts: categories },
              { label: 'Localização', val: filterLoc, set: setFilterLoc, opts: [{ label: 'Todos', value: 'All' }, ...locations.map(l => ({ label: l.location_name, value: l.id }))] },
              { label: 'Departamento', val: filterDept, set: setFilterDept, opts: departments },
              { label: 'Status', val: filterStatus, set: setFilterStatus, opts: statuses },
            ].map(({ label, val, set, opts }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 font-medium mb-1 block">{label}</label>
                <select value={val} onChange={e => set(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  {Array.isArray(opts) && typeof opts[0] === 'string'
                    ? (opts as string[]).map(o => <option key={o} value={o}>{o === 'All' ? 'Todos' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)
                    : (opts as { label: string; value: string }[]).map(o => <option key={o.value} value={o.value}>{o.label}</option>)
                  }
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Total', val: assets.length, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Ativo', val: assets.filter(a => a.current_status === 'active').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Ausente', val: assets.filter(a => a.current_status === 'missing').length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Manutenção', val: assets.filter(a => a.current_status === 'maintenance').length, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Transferido', val: assets.filter(a => a.current_status === 'transferred').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Ativo', 'Tag RFID', 'Localização', 'Departamento', 'Funcionário', 'Status', 'Última Leitura', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(asset => (
                <tr key={asset.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/assets/${asset.id}`)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{categoryIcon(asset.category)}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{asset.asset_name}</p>
                        <p className="text-xs text-slate-500">{asset.brand} {asset.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-mono text-slate-700">{asset.rfid_tag_code}</span>
                    </div>
                    <p className="text-xs text-slate-400 ml-5">{asset.rfid_tag_type}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700">{asset.location_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-600">{asset.department}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-600">{asset.assigned_employee || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.current_status} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-500">{new Date(asset.last_scan_date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={e => { e.stopPropagation(); navigate(`/assets/${asset.id}`); }}
                        className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); navigate(`/assets/${asset.id}/edit`); }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum ativo corresponde aos filtros</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
