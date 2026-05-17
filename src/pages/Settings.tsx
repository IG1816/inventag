import { useState } from 'react';
import { Building2, Users, Tag, Bell, Shield, CreditCard, Save, Plus, Trash2, CreditCard as Edit, Check, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { company, users as sampleUsers } from '../lib/data';
import { useAuth } from '../lib/auth-context';
import type { UserProfile } from '../types';

type Tab = 'company' | 'users' | 'rfid' | 'notifications' | 'security' | 'plan';

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'company', label: 'Empresa', icon: Building2 },
  { key: 'users', label: 'Usuários', icon: Users },
  { key: 'rfid', label: 'Config. RFID', icon: Tag },
  { key: 'notifications', label: 'Notificações', icon: Bell },
  { key: 'security', label: 'Segurança', icon: Shield },
  { key: 'plan', label: 'Plano', icon: CreditCard },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-yellow-100 text-yellow-700',
  operator: 'bg-teal-100 text-teal-700',
  viewer: 'bg-slate-100 text-slate-600',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin', manager: 'Gerente', operator: 'Operador', viewer: 'Visualizador',
};

function SaveButton({ onClick }: { onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  function handle() {
    setSaved(true);
    onClick?.();
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <button onClick={handle}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}>
      {saved ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar Alterações</>}
    </button>
  );
}

export default function Settings() {
  const { userProfile, registerUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('company');
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState('operator');
  const [inviteName, setInviteName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [users] = useState<UserProfile[]>(sampleUsers);

  const activeTabLabel = tabs.find(t => t.key === activeTab)?.label ?? '';

  return (
    <Layout title="Configurações" subtitle="Gerencie sua conta, equipe e preferências">
      {/* Mobile tab selector */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setShowTabMenu(!showTabMenu)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800">
          <span>{activeTabLabel}</span>
          <svg className={`w-4 h-4 text-slate-500 transition-transform ${showTabMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showTabMenu && (
          <div className="mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setActiveTab(key); setShowTabMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${activeTab === key ? 'bg-yellow-50 text-yellow-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar nav */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === key ? 'bg-yellow-50 text-yellow-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">Informações da Empresa</h3>
                <SaveButton />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nome da Empresa', defaultValue: company.company_name, full: true },
                  { label: 'CNPJ', defaultValue: company.tax_id },
                  { label: 'Setor', defaultValue: company.industry },
                  { label: 'Responsável', defaultValue: company.contact_name },
                  { label: 'E-mail de Contato', defaultValue: company.contact_email },
                  { label: 'Telefone de Contato', defaultValue: company.contact_phone },
                ].map(({ label, defaultValue, full }) => (
                  <div key={label} className={full ? 'sm:col-span-2' : ''}>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">{label}</label>
                    <input defaultValue={defaultValue}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Criar Novo Usuário</h3>
                {inviteError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{inviteError}</p>
                  </div>
                )}
                {inviteSuccess && (
                  <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-xs text-emerald-700">{inviteSuccess}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1 block">Nome Completo *</label>
                    <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="João Silva"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1 block">E-mail *</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="joao@empresa.com"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1 block">Senha inicial *</label>
                    <input value={invitePassword} onChange={e => setInvitePassword(e.target.value)} type="password" placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1 block">Papel *</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      <option value="admin">Admin — Acesso total</option>
                      <option value="manager">Gerente — Gerenciar e aprovar</option>
                      <option value="operator">Operador — Fazer contagens</option>
                      <option value="viewer">Visualizador — Somente leitura</option>
                    </select>
                  </div>
                </div>
                <button disabled={inviting}
                  onClick={async () => {
                    if (!inviteName || !inviteEmail || !invitePassword) { setInviteError('Preencha todos os campos obrigatórios.'); return; }
                    setInviting(true); setInviteError(''); setInviteSuccess('');
                    try {
                      await registerUser(inviteEmail, invitePassword, {
                        full_name: inviteName, email: inviteEmail,
                        role: inviteRole as UserProfile['role'],
                        company_id: userProfile?.company_id ?? 'comp-001',
                        department: '', status: 'active',
                      });
                      setInviteSuccess(`Usuário ${inviteName} criado com sucesso!`);
                      setInviteName(''); setInviteEmail(''); setInvitePassword(''); setInviteRole('operator');
                    } catch (err: unknown) {
                      setInviteError((err as { message?: string }).message ?? 'Erro ao criar usuário.');
                    } finally { setInviting(false); }
                  }}
                  className="mt-3 flex items-center gap-1.5 px-4 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
                  {inviting ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Criando...</> : <><Plus className="w-4 h-4" /> Criar Usuário</>}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-800">Membros da Equipe ({users.length})</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center px-4 py-3.5 hover:bg-slate-50 transition-colors gap-3">
                      <div className="w-9 h-9 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                          {user.id === userProfile?.id && (
                            <span className="text-xs bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded font-medium">Você</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{user.email} · {user.department}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:block ${roleColors[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                        <StatusBadge status={user.status} size="sm" />
                        {user.id !== userProfile?.id && (
                          <div className="flex gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rfid' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">Configurações RFID</h3>
                <SaveButton />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Tipo de Tag Padrão', type: 'select', options: ['metallic', 'adhesive', 'passive', 'active'], defaultVal: 'metallic', labels: ['Metálica', 'Adesiva', 'Passiva', 'Ativa'] },
                  { label: 'Frequência do Leitor', type: 'select', options: ['UHF 860-960 MHz', 'HF 13.56 MHz', 'LF 125 kHz'], defaultVal: 'UHF 860-960 MHz' },
                  { label: 'Prefixo de Tag (Ativos)', type: 'text', defaultVal: 'MTL-A' },
                  { label: 'Prefixo de Tag (Estoque)', type: 'text', defaultVal: 'ADH-I' },
                  { label: 'Timeout de Leitura (segundos)', type: 'number', defaultVal: '30' },
                  { label: 'Gerar Divergências Automaticamente', type: 'toggle', defaultVal: true },
                ].map(({ label, type, options, defaultVal, labels: optLabels }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 gap-4">
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    {type === 'toggle' ? (
                      <div className={`w-11 h-6 rounded-full flex-shrink-0 transition-colors cursor-pointer ${defaultVal ? 'bg-yellow-600' : 'bg-slate-200'} relative`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${defaultVal ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    ) : type === 'select' ? (
                      <select defaultValue={defaultVal as string}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        {options!.map((o, i) => <option key={o} value={o}>{optLabels?.[i] ?? o}</option>)}
                      </select>
                    ) : (
                      <input type={type} defaultValue={defaultVal as string}
                        className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">Preferências de Notificação</h3>
                <SaveButton />
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Divergência Crítica Detectada', sub: 'Alerta imediato para ativos ausentes críticos', email: true, push: true },
                  { label: 'Leitura Concluída', sub: 'Quando uma sessão de leitura RFID termina', email: true, push: false },
                  { label: 'Alerta de Ativo Ausente', sub: 'Quando um ativo não é encontrado no local esperado', email: true, push: true },
                  { label: 'Falha na Sincronização ERP', sub: 'Quando a sincronização com o ERP encontra um erro', email: true, push: false },
                  { label: 'Resumo Semanal', sub: 'Resumo de todas as atividades da semana', email: true, push: false },
                  { label: 'Novo Usuário Adicionado', sub: 'Quando um novo membro da equipe aceita o convite', email: false, push: false },
                ].map(({ label, sub, email, push }) => (
                  <div key={label} className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={email} className="w-4 h-4 rounded text-yellow-600" />
                        <span className="text-xs text-slate-600">E-mail</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={push} className="w-4 h-4 rounded text-yellow-600" />
                        <span className="text-xs text-slate-600">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Alterar Senha</h3>
                <div className="space-y-3 max-w-sm">
                  {[
                    { label: 'Senha Atual', key: 'current' },
                    { label: 'Nova Senha', key: 'new' },
                    { label: 'Confirmar Nova Senha', key: 'confirm' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">{label}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                  ))}
                  <SaveButton />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Autenticação de Dois Fatores</h3>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">App Autenticador (TOTP)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Use o Google Authenticator ou similar</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors flex-shrink-0">
                    Ativar
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Tempo Limite da Sessão</p>
                    <p className="text-xs text-slate-500 mt-0.5">Desconectar automaticamente após inatividade</p>
                  </div>
                  <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 flex-shrink-0">
                    {['30 minutos', '1 hora', '4 horas', '8 horas', 'Nunca'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Plano Atual</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Ciclo de cobrança: Mensal</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full">
                    Profissional
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'Ativos', used: 12, limit: 500 },
                    { label: 'Produtos', used: 10, limit: 2000 },
                    { label: 'Usuários', used: 5, limit: 15 },
                    { label: 'Leituras/mês', used: 5, limit: 200 },
                  ].map(({ label, used, limit }) => {
                    const pct = Math.round((used / limit) * 100);
                    return (
                      <div key={label} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="text-sm font-bold text-slate-900 mb-2">{used} / {limit}</p>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="px-4 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                    Fazer Upgrade
                  </button>
                  <button className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                    Histórico de Faturas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
