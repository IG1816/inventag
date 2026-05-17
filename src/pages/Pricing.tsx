import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Building2, ArrowRight, Star, HelpCircle } from 'lucide-react';
import Layout from '../components/Layout';

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: 'R$ 299',
    period: '/mês',
    description: 'Ideal para pequenas empresas que querem começar a controlar ativos com RFID sem complicação.',
    icon: Zap,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    buttonStyle: 'bg-teal-600 hover:bg-teal-700 text-white',
    badge: null,
    features: [
      'Até 100 ativos cadastrados',
      'Até 500 produtos no estoque',
      '3 usuários',
      '2 localizações',
      '50 leituras RFID por mês',
      'Relatórios básicos de divergência',
      'Exportação em PDF',
      'Suporte por e-mail',
    ],
    notIncluded: ['Integração com ERP', 'Acesso à API', 'White-label', 'CSM dedicado'],
  },
  {
    key: 'professional',
    name: 'Profissional',
    price: 'R$ 799',
    period: '/mês',
    description: 'Para equipes em crescimento que precisam de integração com ERP e analytics avançado.',
    icon: Shield,
    color: 'text-yellow-600',
    bg: 'bg-yellow-600',
    border: 'border-yellow-600',
    buttonStyle: 'bg-white hover:bg-yellow-50 text-yellow-700',
    badge: 'Mais popular',
    features: [
      'Até 500 ativos cadastrados',
      'Até 2.000 produtos no estoque',
      '15 usuários',
      '10 localizações',
      '200 leituras RFID por mês',
      'Analytics avançado com gráficos',
      'Integração ERP (SAP, TOTVS, Bling)',
      'Exportação Excel e CSV',
      'Módulo de manutenção completo',
      'Suporte prioritário por e-mail e chat',
      'Prefixos customizados de tags RFID',
    ],
    notIncluded: ['White-label', 'CSM dedicado'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Solução completa para grandes empresas com requisitos de compliance e customização avançada.',
    icon: Building2,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
    badge: null,
    features: [
      'Ativos ilimitados',
      'Produtos ilimitados',
      'Usuários ilimitados',
      'Localizações ilimitadas',
      'Leituras ilimitadas',
      'Suite Analytics completa',
      'Todas as integrações ERP + API aberta',
      'Opção de white-label',
      'Customer Success Manager dedicado',
      'SLA com 99,9% de uptime garantido',
      'Webhooks e integrações customizadas',
      'Opção de deploy on-premise',
    ],
    notIncluded: [],
  },
];

const faqs = [
  { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim. Você pode fazer upgrade ou downgrade quando quiser. A mudança entra em vigor imediatamente com cobrança proporcional ao período utilizado.' },
  { q: 'Qual hardware RFID é necessário?', a: 'O RFID Manager funciona com leitores UHF RFID (860–960 MHz). Suportamos equipamentos Zebra, Impinj, Nordic ID e outros. Nossa equipe auxilia na escolha do leitor ideal para seu ambiente.' },
  { q: 'Existe período de teste gratuito?', a: 'Sim! Todos os planos incluem 14 dias de teste grátis com acesso completo a todas as funcionalidades. Nenhum cartão de crédito é necessário para começar.' },
  { q: 'Como funciona a integração com ERP?', a: 'A integração é feita via API REST ou sincronização por arquivo. Nossa equipe auxilia na configuração inicial e no mapeamento do seu catálogo de produtos do ERP.' },
  { q: 'Os dados ficam seguros na nuvem?', a: 'Sim. Usamos criptografia TLS em trânsito e AES-256 em repouso. Seus dados são hospedados em data centers no Brasil com backup diário e certificação ISO 27001.' },
  { q: 'Tenho suporte em português?', a: 'Sim! Toda a nossa equipe de suporte é brasileira e atende em português. Temos suporte por e-mail, chat e videoconferência dependendo do plano contratado.' },
];

const comparisons = [
  { label: 'Auditorias mais rápidas', rfid: true, manual: false, barcode: false },
  { label: 'Sem necessidade de linha de visão', rfid: true, manual: false, barcode: false },
  { label: 'Leitura em massa simultânea', rfid: true, manual: false, barcode: false },
  { label: 'Integração com ERP', rfid: true, manual: false, barcode: true },
  { label: 'Detecção automática de divergências', rfid: true, manual: false, barcode: false },
  { label: 'Funciona em ambientes metálicos', rfid: true, manual: true, barcode: true },
  { label: 'Custo inicial de implantação', rfid: false, manual: true, barcode: true },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <Layout title="Planos e Preços" subtitle="Escolha o plano ideal para o seu negócio">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-700 font-semibold">14 dias grátis em todos os planos · Sem cartão de crédito</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Preços simples e transparentes</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-sm">
          Comece gratuitamente e escale conforme sua operação cresce. Cancele quando quiser, sem multa.
        </p>
      </div>

      {/* ── Planos ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {plans.map(plan => {
          const Icon = plan.icon;
          const featured = plan.key === 'professional';
          return (
            <div key={plan.key}
              className={`relative rounded-2xl border-2 ${featured
                ? 'border-yellow-600 bg-yellow-600 text-white shadow-2xl shadow-yellow-200 scale-[1.02]'
                : `${plan.border} bg-white`
              } p-6 flex flex-col transition-transform`}>

              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-black rounded-full uppercase tracking-wide shadow-md">
                    <Star className="w-3 h-3 fill-current" /> {plan.badge}
                  </span>
                </div>
              )}

              <div className={`w-10 h-10 ${featured ? 'bg-white/20' : plan.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${featured ? 'text-white' : plan.color}`} />
              </div>

              <h3 className={`text-lg font-black mb-1 ${featured ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <p className={`text-xs mb-5 leading-relaxed ${featured ? 'text-yellow-100' : 'text-slate-500'}`}>{plan.description}</p>

              <div className="mb-6">
                <span className={`text-3xl font-black ${featured ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                {plan.period && <span className={`text-sm ml-1 ${featured ? 'text-yellow-200' : 'text-slate-500'}`}>{plan.period}</span>}
                {plan.key !== 'enterprise' && (
                  <p className={`text-xs mt-1 ${featured ? 'text-yellow-200' : 'text-slate-400'}`}>cobrado mensalmente</p>
                )}
              </div>

              <div className="flex-1 space-y-2 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${featured ? 'text-yellow-200' : 'text-emerald-500'}`} />
                    <span className={`text-xs ${featured ? 'text-yellow-50' : 'text-slate-700'}`}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map(f => (
                  <div key={f} className="flex items-start gap-2 opacity-35">
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-2.5 h-0.5 bg-current rounded-full" />
                    </div>
                    <span className={`text-xs ${featured ? 'text-yellow-100' : 'text-slate-500'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate(plan.key === 'enterprise' ? '/settings' : '/')}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${plan.buttonStyle}`}>
                {plan.key === 'enterprise' ? 'Falar com Vendas' : plan.key === 'professional' ? 'Começar Grátis' : 'Iniciar Teste Gratuito'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Comparativo ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-8">
        <h3 className="text-base font-black text-slate-900 mb-5 text-center">RFID Manager vs. alternativas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3 w-1/2">Funcionalidade</th>
                <th className="text-center text-xs font-bold text-yellow-600 pb-3 px-4">RFID Manager</th>
                <th className="text-center text-xs font-semibold text-slate-400 pb-3 px-4">Manual / Planilha</th>
                <th className="text-center text-xs font-semibold text-slate-400 pb-3 px-4">Código de Barras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map(({ label, rfid, manual, barcode }) => (
                <tr key={label}>
                  <td className="py-3 text-xs text-slate-700">{label}</td>
                  {[rfid, manual, barcode].map((val, i) => (
                    <td key={i} className="text-center py-3 px-4">
                      {val
                        ? <span className="inline-block w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-emerald-600 mx-auto" /></span>
                        : <span className="inline-block w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center"><div className="w-2 h-0.5 bg-slate-300 rounded-full mx-auto" /></span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Números ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { stat: '< 2 h', label: 'Tempo médio de onboarding' },
          { stat: '98,7%', label: 'Precisão de inventário alcançada' },
          { stat: '3×', label: 'Mais rápido que auditorias manuais' },
          { stat: '99,9%', label: 'Uptime garantido da plataforma' },
        ].map(({ stat, label }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <p className="text-2xl font-black text-yellow-600">{stat}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <h3 className="text-base font-black text-slate-900">Perguntas frequentes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-bold text-slate-900 mb-2">{q}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-yellow-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h3 className="text-2xl font-black text-white mb-2">Pronto para eliminar divergências de inventário?</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Junte-se a mais de 200 empresas brasileiras que já usam o RFID Manager para alcançar 99%+ de precisão.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-700 transition-colors shadow-lg shadow-yellow-900/40">
              Iniciar Teste Gratuito <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/presentation')}
              className="px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-xl hover:border-slate-400 hover:text-white transition-colors">
              Ver Demonstração
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4">14 dias grátis · Sem cartão de crédito · Cancele quando quiser</p>
        </div>
      </div>
    </Layout>
  );
}
