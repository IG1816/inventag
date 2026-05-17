import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Radio, RefreshCw, Tag } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { inventoryItems, products, locations } from '../../lib/data';

const categories = ['All', 'Consumíveis', 'Material de Escritório', 'Acessórios', 'Infraestrutura', 'Cabos', 'Armazenamento', 'Componentes'];
const statuses = ['All', 'correct', 'missing', 'extra', 'not_scanned', 'pending_review'];

export default function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const enriched = inventoryItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.product_id),
  }));

  const filtered = enriched.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q || (item.product_name ?? '').toLowerCase().includes(q) ||
      (item.sku ?? '').toLowerCase().includes(q) || (item.product?.erp_product_code ?? '').toLowerCase().includes(q);
    const matchCat = filterCat === 'All' || item.product?.category === filterCat;
    const matchLoc = filterLoc === 'All' || item.location_id === filterLoc;
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchCat && matchLoc && matchStatus;
  });

  const totalExpected = inventoryItems.reduce((s, i) => s + i.expected_quantity, 0);
  const totalScanned = inventoryItems.reduce((s, i) => s + i.scanned_quantity, 0);
  const accuracy = totalExpected > 0 ? Math.round((inventoryItems.filter(i => i.status === 'correct').length / inventoryItems.length) * 100) : 0;

  return (
    <Layout
      title="Estoque"
      subtitle={`${filtered.length} SKUs · ${totalExpected} itens esperados`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/scans/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <Radio className="w-4 h-4" /> Contagem
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Sincronizar ERP
          </button>
          <button onClick={() => navigate('/inventory/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Precisão', val: `${accuracy}%`, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Correto', val: inventoryItems.filter(i=>i.status==='correct').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Faltante', val: inventoryItems.filter(i=>i.status==='missing').length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Extra', val: inventoryItems.filter(i=>i.status==='extra').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Não Lido', val: inventoryItems.filter(i=>i.status==='not_scanned').length, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome do produto, SKU ou código ERP..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Categoria</label>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Localização</label>
              <select value={filterLoc} onChange={e => setFilterLoc(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option value="All">Todos</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.location_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Todos' : s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['SKU', 'Produto', 'Código ERP', 'Localização', 'Esperado', 'Lido', 'Diferença', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(item => {
                const diff = item.scanned_quantity - item.expected_quantity;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/inventory/${item.product_id}`)}>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-slate-600">{item.sku}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{item.product_name}</p>
                      <p className="text-xs text-slate-500">{item.product?.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-slate-500">{item.product?.erp_product_code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{item.location_name}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-slate-700">{item.expected_quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-slate-700">{item.scanned_quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${diff < 0 ? 'text-red-600' : diff > 0 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); navigate(`/inventory/${item.product_id}`); }}
                        className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum produto corresponde aos filtros</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
