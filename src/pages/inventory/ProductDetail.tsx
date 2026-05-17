import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Tag, MapPin, DollarSign, Radio, AlertTriangle, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { products, inventoryItems, divergences, rfidScans } from '../../lib/data';

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right ml-4">{value ?? '—'}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const item = inventoryItems.find(i => i.product_id === id);
  const productDivergences = divergences.filter(d => d.related_product_id === id);
  const relatedScans = rfidScans.filter(s => s.module === 'inventory').slice(0, 3);

  if (!product) {
    return (
      <Layout title="Produto Não Encontrado">
        <div className="text-center py-20">
          <p className="text-slate-500">Produto não encontrado.</p>
          <button onClick={() => navigate('/inventory')} className="mt-4 text-yellow-600 hover:underline text-sm">Voltar</button>
        </div>
      </Layout>
    );
  }

  const diff = item ? item.scanned_quantity - item.expected_quantity : 0;
  const accuracy = item && item.expected_quantity > 0
    ? Math.round((item.scanned_quantity / item.expected_quantity) * 100)
    : 100;

  return (
    <Layout
      title={product.product_name}
      subtitle={`${product.sku} · ${product.category}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/inventory')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button onClick={() => navigate('/scans/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg">
            <Radio className="w-4 h-4" /> Iniciar Contagem
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Stock Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Esperado ERP</p>
              <p className="text-3xl font-bold text-slate-900">{item?.expected_quantity ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">unidades</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Lido RFID</p>
              <p className="text-3xl font-bold text-slate-900">{item?.scanned_quantity ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">unidades</p>
            </div>
            <div className={`rounded-xl border p-4 text-center ${diff < 0 ? 'bg-red-50 border-red-200' : diff > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className="text-xs text-slate-500 mb-1">Diferença</p>
              <p className={`text-3xl font-bold ${diff < 0 ? 'text-red-600' : diff > 0 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                {diff > 0 ? `+${diff}` : diff}
              </p>
              <p className="text-xs text-slate-400 mt-1">{accuracy}% precisão</p>
            </div>
          </div>

          {/* Product Data */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Tag className="w-3.5 h-3.5 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Dados do Produto</h3>
            </div>
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Nome do Produto" value={product.product_name} />
            <InfoRow label="Categoria" value={product.category} />
            <InfoRow label="Descrição" value={product.description} />
            <InfoRow label="Estoque Mínimo" value={`${product.minimum_stock} unidades`} />
          </div>

          {/* ERP Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Informações do ERP</h3>
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Sincronizado</span>
            </div>
            <InfoRow label="Código ERP do Produto" value={product.erp_product_code} />
            <InfoRow label="Sistema ERP" value="SAP Business One" />
            <InfoRow label="Última Sincronização" value="Hoje às 06:00" />
            <InfoRow label="Qtd. Esperada ERP" value={`${item?.expected_quantity ?? 0} unidades`} />
          </div>

          {/* RFID Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Radio className="w-3.5 h-3.5 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Informações da Tag RFID</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-slate-500 mb-1">Código da Tag RFID</p>
              <p className="text-lg font-mono font-bold text-slate-900">{item?.rfid_tag_code ?? '—'}</p>
            </div>
            <InfoRow label="Tipo de Tag" value={item?.rfid_tag_type === 'adhesive' ? 'Tag RFID Adesiva' : 'Tag RFID Metálica'} />
            <InfoRow label="Localização" value={item?.location_name} />
            <InfoRow label="Última Leitura" value={item?.last_scan_date ? new Date(item.last_scan_date).toLocaleString() : '—'} />
            <InfoRow label="Status da Leitura" value={item?.status?.replace(/_/g,' ')} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pricing */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Preços</h3>
            </div>
            <InfoRow label="Custo Unitário" value={`R$ ${product.unit_cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
            <InfoRow label="Preço de Venda" value={`R$ ${product.sale_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
            <InfoRow label="Valor em Estoque" value={`R$ ${((item?.scanned_quantity ?? 0) * product.unit_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-2">Status do Estoque</p>
            {item ? <StatusBadge status={item.status} /> : <span className="text-sm text-slate-400">Sem dados de leitura</span>}
          </div>

          {/* Divergences */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Divergências</h3>
            </div>
            {productDivergences.length > 0 ? (
              <div className="space-y-2">
                {productDivergences.map(d => (
                  <div key={d.id} onClick={() => navigate(`/divergences/${d.id}`)}
                    className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 capitalize">{d.divergence_type.replace(/_/g,' ')}</span>
                      <StatusBadge status={d.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">Esperado: {d.expected_value}</p>
                    <p className="text-xs text-slate-500">Encontrado: {d.found_value}</p>
                    <div className="mt-1"><StatusBadge status={d.status} size="sm" /></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">Nenhuma divergência</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Ações</p>
            {[
              { label: 'Editar Produto', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
              { label: 'Cadastrar Tags RFID', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
              { label: 'Ver Detalhes de Sync ERP', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
            ].map(({ label, color }) => (
              <button key={label} className={`w-full text-sm font-medium py-2 px-3 rounded-lg transition-colors text-left ${color}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
