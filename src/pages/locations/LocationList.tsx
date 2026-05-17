import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Eye, Radio, Package2, Boxes, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { locations as sampleLocations } from '../../lib/data';
import { getLocations, createLocation } from '../../lib/firestore';
import { useAuth } from '../../lib/auth-context';
import type { Location, LocationType } from '../../types';

const typeIcons: Record<string, string> = {
  it_room: '💻', server_room: '🖥️', office: '🏢', warehouse: '📦',
  headquarters: '🏛️', store: '🏪', production: '⚙️', other: '📍'
};
const typeLabels: Record<string, string> = {
  it_room: 'Sala de TI', server_room: 'Sala de Servidores', office: 'Escritório',
  warehouse: 'Armazém', headquarters: 'Sede', store: 'Loja',
  production: 'Produção', other: 'Outro'
};

export default function LocationList() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<LocationType>('office');
  const [newAddress, setNewAddress] = useState('');
  const [newResponsible, setNewResponsible] = useState('');

  useEffect(() => {
    if (userProfile?.company_id) {
      getLocations(userProfile.company_id)
        .then(data => { if (data.length > 0) setLocations(data); })
        .catch(() => {});
    }
  }, [userProfile]);

  async function handleSave() {
    if (!newName) return;
    setSaving(true);
    try {
      const id = await createLocation({
        company_id: userProfile?.company_id ?? 'comp-001',
        location_name: newName,
        type: newType,
        address: newAddress,
        responsible_person: newResponsible,
        status: 'active',
        asset_count: 0,
        product_count: 0,
        open_divergences: 0,
      });
      const newLoc: Location = {
        id, company_id: userProfile?.company_id ?? 'comp-001',
        location_name: newName, type: newType, address: newAddress,
        responsible_person: newResponsible, status: 'active',
        asset_count: 0, product_count: 0, open_divergences: 0,
        created_at: new Date().toISOString(),
      };
      setLocations(prev => [...prev, newLoc]);
      setShowNew(false);
      setNewName(''); setNewType('office'); setNewAddress(''); setNewResponsible('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title="Localizações"
      subtitle={`${locations.length} localizações registradas`}
      actions={
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
          <Plus className="w-4 h-4" /> Nova Localização
        </button>
      }
    >
      {/* Add Location Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Nova Localização</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="ex: Escritório 3° Andar"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo</label>
                <select value={newType} onChange={e => setNewType(e.target.value as LocationType)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
                <input value={newAddress} onChange={e => setNewAddress(e.target.value)}
                  placeholder="Rua, número, sala..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Responsável</label>
                <input value={newResponsible} onChange={e => setNewResponsible(e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} disabled={saving || !newName}
                className="flex-1 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
                {saving ? 'Salvando...' : 'Salvar Localização'}
              </button>
              <button onClick={() => setShowNew(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {locations.map(loc => (
          <div key={loc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/locations/${loc.id}`)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                  {typeIcons[loc.type] ?? '📍'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{loc.location_name}</h3>
                  <p className="text-xs text-slate-500">{typeLabels[loc.type]}</p>
                </div>
              </div>
              <StatusBadge status={loc.status} size="sm" />
            </div>

            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {loc.address}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Package2 className="w-3 h-3 text-yellow-500" />
                </div>
                <p className="text-sm font-bold text-slate-800">{loc.asset_count}</p>
                <p className="text-xs text-slate-400">Ativos</p>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Boxes className="w-3 h-3 text-teal-500" />
                </div>
                <p className="text-sm font-bold text-slate-800">{loc.product_count}</p>
                <p className="text-xs text-slate-400">Produtos</p>
              </div>
              <div className={`text-center p-2 rounded-lg ${(loc.open_divergences ?? 0) > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <AlertTriangle className={`w-3 h-3 ${(loc.open_divergences ?? 0) > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                </div>
                <p className={`text-sm font-bold ${(loc.open_divergences ?? 0) > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {loc.open_divergences ?? 0}
                </p>
                <p className="text-xs text-slate-400">Diverg.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">Responsável: <span className="font-medium">{loc.responsible_person}</span></p>
              <div className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); navigate(`/locations/${loc.id}`); }}
                  className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={e => { e.stopPropagation(); navigate('/scans/new'); }}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Start scan">
                  <Radio className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
