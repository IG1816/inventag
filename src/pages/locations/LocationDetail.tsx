import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Radio, FileText } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { locations, assets, inventoryItems, rfidScans, divergences } from '../../lib/data';

const typeIcons: Record<string, string> = {
  it_room: '💻', server_room: '🖥️', office: '🏢', warehouse: '📦',
  headquarters: '🏛️', store: '🏪', production: '⚙️', other: '📍'
};

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = locations.find(l => l.id === id);

  if (!location) {
    return (
      <Layout title="Não Encontrado">
        <div className="text-center py-20">
          <p className="text-slate-500">Localização não encontrada.</p>
          <button onClick={() => navigate('/locations')} className="mt-4 text-yellow-600 hover:underline text-sm">Voltar</button>
        </div>
      </Layout>
    );
  }

  const locationAssets = assets.filter(a => a.location_id === id);
  const locationInventory = inventoryItems.filter(i => i.location_id === id);
  const locationScans = rfidScans.filter(s => s.location_id === id);
  const locationDivergences = divergences.filter(d => d.location_id === id);

  return (
    <Layout
      title={location.location_name}
      subtitle={`${location.type.replace('_', ' ')} · ${location.address}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/locations')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button onClick={() => navigate('/scans/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
            <Radio className="w-4 h-4" /> Iniciar Leitura
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Assets */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Ativos nesta Localização ({locationAssets.length})</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {locationAssets.slice(0, 5).map(asset => (
                <div key={asset.id} className="flex items-center px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/assets/${asset.id}`)}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{asset.asset_name}</p>
                    <p className="text-xs text-slate-500 font-mono">{asset.rfid_tag_code} · {asset.department}</p>
                  </div>
                  <StatusBadge status={asset.current_status} size="sm" />
                </div>
              ))}
              {locationAssets.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Nenhum ativo nesta localização</p>}
              {locationAssets.length > 5 && (
                <div className="px-5 py-3 text-center">
                  <button onClick={() => navigate('/assets')} className="text-xs text-yellow-600 hover:underline">
                    Ver todos os {locationAssets.length} ativos
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Itens de Estoque ({locationInventory.length})</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {locationInventory.slice(0, 5).map(item => {
                const diff = item.scanned_quantity - item.expected_quantity;
                return (
                  <div key={item.id} className="flex items-center px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/inventory/${item.product_id}`)}>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.product_name}</p>
                      <p className="text-xs text-slate-500">Esperado: {item.expected_quantity} · Lido: {item.scanned_quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${diff < 0 ? 'text-red-600' : diff > 0 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                  </div>
                );
              })}
              {locationInventory.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Nenhum item de estoque nesta localização</p>}
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Leituras Recentes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {locationScans.slice(0, 3).map(scan => (
                <div key={scan.id} className="flex items-center px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/scans/${scan.id}`)}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{scan.scan_type.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase())}</p>
                    <p className="text-xs text-slate-500">{scan.operator_name} · {new Date(scan.scan_date).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={scan.status} size="sm" />
                </div>
              ))}
              {locationScans.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Nenhuma leitura para esta localização</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Location Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                {typeIcons[location.type] ?? '📍'}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{location.location_name}</p>
                <p className="text-xs text-slate-500 capitalize">{location.type.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Endereço</span>
                <span className="font-medium text-slate-800 text-right ml-4 text-xs">{location.address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Responsável</span>
                <span className="font-medium text-slate-800">{location.responsible_person}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={location.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{location.asset_count}</p>
              <p className="text-xs text-slate-500">Ativos</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-teal-700">{location.product_count}</p>
              <p className="text-xs text-slate-500">Produtos</p>
            </div>
            <div className={`${(location.open_divergences ?? 0) > 0 ? 'bg-red-50' : 'bg-emerald-50'} rounded-xl p-4 text-center col-span-2`}>
              <p className={`text-2xl font-bold ${(location.open_divergences ?? 0) > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {location.open_divergences ?? 0}
              </p>
              <p className="text-xs text-slate-500">Divergências Abertas</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Ações</p>
            {[
              { label: 'Iniciar Auditoria de Ativos', icon: Radio, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100', action: () => navigate('/scans/new') },
              { label: 'Iniciar Contagem de Estoque', icon: Radio, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100', action: () => navigate('/scans/new') },
              { label: 'Gerar Relatório da Localização', icon: FileText, color: 'bg-slate-100 text-slate-700 hover:bg-slate-200', action: () => navigate('/reports') },
              { label: 'Editar Localização', icon: Edit, color: 'bg-slate-100 text-slate-700 hover:bg-slate-200', action: () => {} },
            ].map(({ label, icon: Icon, color, action }) => (
              <button key={label} onClick={action}
                className={`w-full flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-colors text-left ${color}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
