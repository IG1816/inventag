import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Tag, MapPin, User, DollarSign, Clock, AlertTriangle, Radio, ChevronRight } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { assets, locations, divergences, rfidScans, scanResults } from '../../lib/data';

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right ml-4">{value || '—'}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-yellow-50 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-yellow-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === id);

  if (!asset) {
    return (
      <Layout title="Ativo Não Encontrado">
        <div className="text-center py-20">
          <p className="text-slate-500">Ativo não encontrado.</p>
          <button onClick={() => navigate('/assets')} className="mt-4 text-yellow-600 hover:underline text-sm">
            Voltar para Ativos
          </button>
        </div>
      </Layout>
    );
  }

  const location = locations.find(l => l.id === asset.location_id);
  const assetDivergences = divergences.filter(d => d.related_asset_id === asset.id);
  const assetScans = rfidScans.filter(s => s.location_id === asset.location_id).slice(0, 3);
  const assetScanResults = scanResults.filter(r => r.rfid_tag_code === asset.rfid_tag_code).slice(0, 4);

  const catIcons: Record<string, string> = {
    notebook: '💻', desktop: '🖥️', monitor: '🖥', tablet: '📱',
    smartphone: '📱', network: '🔌', equipment: '⚡', tool: '🔧', machine: '⚙️', other: '📦'
  };

  return (
    <Layout
      title={asset.asset_name}
      subtitle={`${asset.brand} ${asset.model} · ${asset.serial_number}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/assets')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button onClick={() => navigate(`/assets/${id}/edit`)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
            <Edit className="w-4 h-4" /> Editar Ativo
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Asset Identification */}
          <Section title="Identificação do Ativo" icon={Tag}>
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                {catIcons[asset.category] ?? '📦'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{asset.asset_name}</h2>
                <p className="text-sm text-slate-500">{asset.brand} · {asset.model}</p>
                <div className="mt-1.5">
                  <StatusBadge status={asset.current_status} />
                </div>
              </div>
            </div>
            <InfoRow label="Categoria" value={asset.category.charAt(0).toUpperCase() + asset.category.slice(1)} />
            <InfoRow label="Marca" value={asset.brand} />
            <InfoRow label="Modelo" value={asset.model} />
            <InfoRow label="Número de Série" value={asset.serial_number} />
          </Section>

          {/* RFID Tag Information */}
          <Section title="Informações da Tag RFID" icon={Radio}>
            <div className="bg-slate-50 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Código da Tag RFID</p>
                  <p className="text-xl font-mono font-bold text-slate-900">{asset.rfid_tag_code}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <InfoRow label="Tipo de Tag" value={asset.rfid_tag_type === 'metallic' ? 'Tag RFID Metálica' : 'Tag RFID Adesiva'} />
            <InfoRow label="Última Leitura" value={new Date(asset.last_scan_date).toLocaleString()} />
          </Section>

          {/* Scan History */}
          <Section title="Histórico de Leituras" icon={Clock}>
            {assetScanResults.length > 0 ? (
              <div className="space-y-2">
                {assetScanResults.map(result => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{result.linked_item_name}</p>
                      <p className="text-xs text-slate-500">Lido em: {result.scanned_location || 'Não encontrado'}</p>
                    </div>
                    <StatusBadge status={result.result_status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum histórico de leitura disponível</p>
            )}
            <button onClick={() => navigate('/scans')}
              className="w-full mt-3 text-center text-xs text-yellow-600 hover:text-yellow-700 font-medium flex items-center justify-center gap-1">
              Ver todas as leituras <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Location */}
          <Section title="Localização e Departamento" icon={MapPin}>
            {location && (
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold text-slate-900">{location.location_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{location.address}</p>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">{location.type.replace('_', ' ')}</p>
              </div>
            )}
            <InfoRow label="Departamento" value={asset.department} />
          </Section>

          {/* Assigned Employee */}
          <Section title="Funcionário Responsável" icon={User}>
            {asset.assigned_employee ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{asset.assigned_employee}</p>
                  <p className="text-xs text-slate-500">{asset.department}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">Nenhum funcionário atribuído</p>
            )}
          </Section>

          {/* Purchase Info */}
          <Section title="Compra e Valor" icon={DollarSign}>
            <InfoRow label="Data de Compra" value={asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : undefined} />
            <InfoRow label="Valor de Compra" value={`R$ ${asset.purchase_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          </Section>

          {/* Divergences */}
          <Section title="Histórico de Divergências" icon={AlertTriangle}>
            {assetDivergences.length > 0 ? (
              <div className="space-y-2">
                {assetDivergences.map(d => (
                  <div key={d.id}
                    onClick={() => navigate(`/divergences/${d.id}`)}
                    className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 capitalize">{d.divergence_type.replace(/_/g,' ')}</span>
                      <StatusBadge status={d.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">Esperado: {d.expected_value}</p>
                    <p className="text-xs text-slate-500">Encontrado: {d.found_value}</p>
                    <div className="flex justify-between items-center mt-1">
                      <StatusBadge status={d.status} size="sm" />
                      <span className="text-xs text-slate-400">{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">Nenhuma divergência registrada</p>
            )}
          </Section>

          {/* Notes */}
          {asset.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">Observações</p>
              <p className="text-sm text-amber-900">{asset.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Ações</p>
            {[
              { label: 'Transferir Localização', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
              { label: 'Marcar em Manutenção', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
              { label: 'Marcar como Baixado', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
            ].map(({ label, color }) => (
              <button key={label}
                className={`w-full text-sm font-medium py-2 px-3 rounded-lg transition-colors text-left ${color}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
