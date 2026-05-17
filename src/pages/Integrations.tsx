import { useState } from 'react';
import { Plug, CheckCircle2, XCircle, RefreshCw, AlertCircle, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { erpIntegrations } from '../lib/data';

const erpLogos: Record<string, { color: string; bg: string; label: string }> = {
  sap: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'SAP' },
  totvs: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'TOTVS' },
  bling: { color: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Bling' },
  netsuite: { color: 'text-red-700', bg: 'bg-red-50', label: 'NetSuite' },
  omie: { color: 'text-cyan-700', bg: 'bg-cyan-50', label: 'Omie' },
  other: { color: 'text-slate-700', bg: 'bg-slate-100', label: 'Custom ERP' },
};

const availableIntegrations = [
  { key: 'totvs', name: 'TOTVS Fluig', description: 'Conecte ao TOTVS para gestão empresarial brasileira', category: 'ERP' },
  { key: 'netsuite', name: 'Oracle NetSuite', description: 'ERP na nuvem para médias e grandes empresas', category: 'ERP' },
  { key: 'omie', name: 'Omie ERP', description: 'ERP brasileiro focado em PMEs e gestão integrada', category: 'ERP' },
  { key: 'sheets', name: 'Google Sheets', description: 'Exporte dados para o Google Sheets para análises personalizadas', category: 'Exportação' },
  { key: 'powerbi', name: 'Microsoft Power BI', description: 'Conecte diretamente ao Power BI para análises avançadas', category: 'Analytics' },
  { key: 'webhook', name: 'Webhook Personalizado', description: 'Envie eventos em tempo real para qualquer endpoint HTTP', category: 'Desenvolvedor' },
];

export default function Integrations() {
  const [syncing, setSyncing] = useState<string | null>(null);

  function handleSync(id: string) {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2500);
  }

  return (
    <Layout title="Integrações" subtitle="Conecte seu ERP e sistemas externos">
      {/* Flow diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Arquitetura de Fluxo de Dados</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            { label: 'Sistema ERP', sub: 'Catálogo de produtos, quantidades esperadas', color: 'bg-yellow-600', icon: Plug },
            null,
            { label: 'RFID Manager', sub: 'Hub central de dados e processamento', color: 'bg-slate-900', icon: Zap },
            null,
            { label: 'Leitores RFID', sub: 'Leitura física e dados em tempo real', color: 'bg-teal-600', icon: Shield },
          ].map((item, i) => {
            if (item === null) {
              return (
                <div key={i} className="flex items-center">
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              );
            }
            const { label, sub, color, icon: Icon } = item;
            return (
              <div key={label} className="flex flex-col items-center text-center max-w-[130px]">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-2 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{sub}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Clock, label: 'Frequência de Sincronização', val: 'A cada 15 minutos' },
            { icon: Shield, label: 'Segurança de Dados', val: 'TLS 1.3 Criptografado' },
            { icon: Zap, label: 'Latência', val: '< 500ms média' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Integrations */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Integrações Conectadas</h3>
        <div className="space-y-3">
          {erpIntegrations.map(erp => {
            const meta = erpLogos[erp.erp_type] ?? erpLogos.other;
            const isSyncing = syncing === erp.id;
            return (
              <div key={erp.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${meta.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold ${meta.color}`}>{meta.label.substring(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-semibold text-slate-900">{erp.erp_name}</h4>
                      <StatusBadge status={erp.api_status} size="sm" />
                      {erp.api_status === 'connected' && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Ativo
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">URL Base da API</p>
                        <p className="text-xs font-mono text-slate-700 truncate">{erp.api_base_url || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Freq. de Sincronização</p>
                        <p className="text-xs font-medium text-slate-700 capitalize">{erp.sync_frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Última Sincronização</p>
                        <p className="text-xs text-slate-700">
                          {erp.last_sync_date ? new Date(erp.last_sync_date).toLocaleString() : 'Nunca'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Tipo de Autenticação</p>
                        <p className="text-xs font-semibold text-slate-700">{erp.auth_type}</p>
                      </div>
                    </div>
                    {erp.notes && (
                      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600">{erp.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleSync(erp.id)} disabled={isSyncing || erp.api_status === 'disconnected'}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 rounded-lg transition-colors">
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                      Configurar
                    </button>
                    {erp.api_status === 'connected' ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Desconectar
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reconectar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Integrações Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {availableIntegrations.map(({ key, name, description, category }) => {
            const meta = erpLogos[key] ?? erpLogos.other;
            return (
              <div key={key} className="bg-white rounded-xl border border-slate-200 border-dashed p-5 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${meta.bg} rounded-xl flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${meta.color}`}>{name.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{category}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>
                <button className="w-full py-2 text-xs font-medium text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors">
                  + Conectar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
