import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, CheckCircle2, AlertTriangle, MapPin, Clock, Package2, Boxes, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { locations, rfidScans } from '../../lib/data';

export default function OperatorDashboard() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const myScans = rfidScans.filter(s => s.operator_user_id === userProfile?.id).slice(0, 5);
  const pendingScans = rfidScans.filter(s => s.status === 'pending_review');

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">RFID Manager</p>
            <p className="text-slate-400 text-xs">Módulo Operador</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{userProfile?.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{userProfile?.role}</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors">
            <LogOut className="w-3.5 h-3.5" /> {loggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Welcome */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h1 className="text-lg font-bold text-slate-900 mb-1">
            Olá, {userProfile?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-500">Selecione uma ação para começar</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/scans/new')}
            className="bg-yellow-600 hover:bg-yellow-700 rounded-2xl p-5 text-left transition-all hover:shadow-lg active:scale-95">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold text-sm">Iniciar Contagem</p>
            <p className="text-yellow-100 text-xs mt-1">Leitura RFID por localização</p>
          </button>

          <button onClick={() => navigate('/scans')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all hover:shadow-sm active:scale-95">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-slate-900 font-bold text-sm">Minhas Contagens</p>
            <p className="text-slate-500 text-xs mt-1">{myScans.length} realizadas</p>
          </button>

          <button onClick={() => navigate('/divergences')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all hover:shadow-sm active:scale-95">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${pendingScans.length > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${pendingScans.length > 0 ? 'text-red-600' : 'text-slate-600'}`} />
            </div>
            <p className="text-slate-900 font-bold text-sm">Divergências</p>
            <p className="text-slate-500 text-xs mt-1">{pendingScans.length} para revisar</p>
          </button>

          <button onClick={() => navigate('/locations')}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left transition-all hover:shadow-sm active:scale-95">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-slate-900 font-bold text-sm">Localizações</p>
            <p className="text-slate-500 text-xs mt-1">{locations.length} registradas</p>
          </button>
        </div>

        {/* Locations to count */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Locais para Contagem</h3>
            <span className="text-xs text-slate-400">Selecione para iniciar</span>
          </div>
          <div className="divide-y divide-slate-50">
            {locations.map(loc => (
              <button key={loc.id}
                onClick={() => navigate('/scans/new')}
                className="w-full flex items-center px-5 py-4 hover:bg-slate-50 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{loc.location_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Package2 className="w-3 h-3" /> {loc.asset_count} ativos
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Boxes className="w-3 h-3" /> {loc.product_count} produtos
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(loc.open_divergences ?? 0) > 0 && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {loc.open_divergences} diverg.
                    </span>
                  )}
                  <Radio className="w-4 h-4 text-yellow-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent scans */}
        {rfidScans.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Contagens Recentes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {rfidScans.slice(0, 4).map(scan => {
                const accuracy = scan.total_expected_items > 0
                  ? Math.round((scan.total_expected_items - scan.missing_items) / scan.total_expected_items * 100)
                  : 100;
                return (
                  <div key={scan.id}
                    className="flex items-center px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/scans/${scan.id}`)}>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{scan.location_name}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(scan.scan_date).toLocaleDateString('pt-BR')} · {scan.operator_name}
                      </p>
                    </div>
                    <div className={`text-sm font-bold ${accuracy >= 90 ? 'text-emerald-600' : accuracy >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {accuracy}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
