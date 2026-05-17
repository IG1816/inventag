import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../lib/theme-context';
import {
  Radio, Package2, Boxes, BarChart2, Shield, Zap, CheckCircle,
  ArrowRight, Sun, Moon, AlertTriangle, Clock, MapPin,
  Plug, TrendingUp, RefreshCw, Tag, Menu, X, Wifi, Glasses
} from 'lucide-react';

/* ─── Scroll-animation hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Nav ─── */
function Nav({ onDemo }: { onDemo: () => void }) {
  const { theme, toggleTheme, elderlyMode, toggleElderlyMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">RFID Control</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {[['problema', 'Problema'], ['solucao', 'Solucao'], ['recursos', 'Recursos'], ['precos', 'Precos']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-slate-400 hover:text-white text-sm transition-colors">
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Elderly toggle */}
          <button onClick={toggleElderlyMode}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              elderlyMode
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={elderlyMode ? 'Desativar modo acessível' : 'Ativar modo acessível'}>
            <Glasses className="w-4 h-4" />
          </button>

          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            {theme === 'dark'
              ? <Sun className="w-4 h-4 transition-transform duration-300 rotate-0" />
              : <Moon className="w-4 h-4 transition-transform duration-300 rotate-180" />
            }
          </button>
          <button onClick={() => navigate('/login')}
            className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">
            Acessar sistema
          </button>
          <button onClick={onDemo}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            Ver demonstracao <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/98 border-t border-slate-800 px-5 py-4 space-y-3">
          {[['problema', 'Problema'], ['solucao', 'Solucao'], ['recursos', 'Recursos'], ['precos', 'Precos']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left text-slate-300 hover:text-white text-sm py-1 transition-colors">
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero({ onDemo }: { onDemo: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const base = 'transition-all ease-out';
  const show = 'opacity-100 translate-y-0';
  const hide = 'opacity-0 translate-y-6';

  return (
    <section className="min-h-screen bg-black relative overflow-hidden flex items-center pt-16">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 w-full py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className={`${base} duration-500 ${mounted ? show : hide} inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase`}
              style={{ transitionDelay: '0ms' }}>
              <Radio className="w-3 h-3" /> Gestao de Ativos e Estoque com RFID
            </div>
            <h1 className={`${base} duration-700 ${mounted ? show : hide} text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6`}
              style={{ transitionDelay: '100ms' }}>
              Inventario<br />automatico.<br />
              <span className="text-yellow-400">Zero falhas.</span>
            </h1>
            <p className={`${base} duration-700 ${mounted ? show : hide} text-slate-400 text-lg leading-relaxed mb-8 max-w-md`}
              style={{ transitionDelay: '200ms' }}>
              Elimine inventarios manuais, detecte divergencias em tempo real e sincronize com seu ERP automaticamente usando tecnologia RFID.
            </p>
            <div className={`${base} duration-700 ${mounted ? show : hide} flex gap-4 flex-wrap`}
              style={{ transitionDelay: '300ms' }}>
              <button onClick={onDemo}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/25">
                Ver demonstracao <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all">
                Saiba mais
              </button>
            </div>

            {/* Stats */}
            <div className={`${base} duration-700 ${mounted ? show : hide} flex gap-8 mt-10 pt-8 border-t border-slate-800/80`}
              style={{ transitionDelay: '420ms' }}>
              {[['80%', 'Reducao no tempo de inventario'], ['99.2%', 'Acuracia de leitura RFID'], ['3x', 'Mais rapido que codigo de barras']].map(([val, label]) => (
                <div key={val}>
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock scan card */}
          <div className={`hidden lg:block ${base} duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{ transitionDelay: '250ms' }}>
            <div className="bg-[#141414]/80 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-semibold text-sm">Leitura RFID — Sala de TI</p>
                  <p className="text-slate-400 text-xs mt-0.5">Auditoria em andamento</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  Leitura RFID ativa
                </span>
              </div>
              <div className="space-y-2.5 mb-4">
                {[
                  { name: 'Notebook Dell Latitude 5530', tag: 'RFID-NB-001', status: 'Localizado', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { name: 'Monitor LG 27" 4K',           tag: 'RFID-MN-002', status: 'Localizado', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { name: 'Lenovo ThinkPad X1 Carbon',   tag: 'RFID-NB-003', status: 'Ausente',    color: 'text-red-400',     bg: 'bg-red-400/10'     },
                  { name: 'iPad Air 5a geracao',          tag: 'RFID-TB-004', status: 'Fora do setor',color:'text-amber-400', bg: 'bg-amber-400/10'   },
                ].map(item => (
                  <div key={item.tag} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                      <div>
                        <p className="text-slate-200 text-xs font-medium">{item.name}</p>
                        <p className="text-slate-500 text-xs font-mono">{item.tag}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.color} ${item.bg}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/60">
                <span>4 de 12 itens lidos</span>
                <div className="flex-1 mx-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-yellow-500 rounded-full" />
                </div>
                <span>33%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Problems ─── */
const problems = [
  { icon: Clock,         title: 'Inventario Manual Demorado',   desc: 'Equipes inteiras param a operacao por dias para contar itens um a um — propenso a erros e extremamente custoso.' },
  { icon: AlertTriangle, title: 'Divergencias Frequentes',       desc: 'Itens no lugar errado, quantidades incorretas e registros desatualizados causam decisoes baseadas em dados falsos.' },
  { icon: MapPin,        title: 'Sem Visibilidade em Tempo Real',desc: 'Nao e possivel saber onde cada ativo esta nem quanto ha em estoque sem parar tudo para auditar.' },
  { icon: TrendingUp,    title: 'Perdas e Falta de Produto',     desc: 'Ruptura de estoque, furtos nao detectados e ativos em manutencao desconhecidos geram perdas diretas no faturamento.' },
];

function Problems() {
  return (
    <section id="problema" className="py-24 bg-white dark:bg-[#141414]">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-3">O Problema</div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Por que inventarios manuais<br />nao funcionam mais
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Empresas que ainda dependem de planilhas e contagem manual enfrentam os mesmos problemas cronicos.
            </p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-2 leading-tight">{p.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Solution ─── */
function Solution() {
  return (
    <section id="solucao" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">A Solucao</div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
              Dois modulos. Uma plataforma.<br />Controle total.
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              RFID Control unifica gestao de bens patrimoniais e estoque em um unico sistema integrado ao seu ERP.
            </p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: Package2, color: 'bg-yellow-500',
              title: 'Gestao de Ativos (Bens)',
              desc: 'Rastreie cada ativo patrimonial em tempo real. Saiba onde esta, quem e o responsavel, historico de movimentacoes e alertas de ausencia automaticos.',
              items: ['Localizacao em tempo real', 'Historico de movimentacoes', 'Alertas de ativo ausente', 'Controle de manutencao', 'Relatorio de divergencias'],
            },
            {
              icon: Boxes, color: 'bg-indigo-500',
              title: 'Gestao de Estoque',
              desc: 'Contagem de estoque em segundos, nao em horas. Detecte falta, excesso e itens fora do lugar antes que impactem a operacao.',
              items: ['Contagem em segundos', 'Alerta de ruptura automatico', 'Comparacao com ERP', 'Rastreio por localizacao', 'Acuracia de 99%+'],
            },
          ].map((mod, i) => (
            <Reveal key={mod.title} delay={i * 100}>
              <div className="bg-[#141414] border border-slate-800 rounded-2xl p-7 h-full">
                <div className={`w-11 h-11 ${mod.color} rounded-xl flex items-center justify-center mb-5`}>
                  <mod.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{mod.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{mod.desc}</p>
                <ul className="space-y-2">
                  {mod.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Conference highlight */}
        <Reveal>
          <div className="bg-gradient-to-r from-yellow-900/40 to-indigo-900/30 border border-yellow-700/30 rounded-2xl p-7 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Radio className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base mb-1.5">Conferencia RFID em tempo real</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aponte o leitor RFID e veja os itens aparecendo na tela um a um — automaticamente classificados em
                <span className="text-emerald-400 font-semibold"> Localizado</span>,
                <span className="text-red-400 font-semibold"> Ausente</span> e
                <span className="text-amber-400 font-semibold"> Fora do Setor</span>.
                O que levava horas agora leva minutos.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-white">95%</div>
                <div className="text-xs text-slate-500">mais rapido</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { icon: Radio,     title: 'Leitura RFID UHF',         desc: 'Compativel com leitores UHF EPC Gen2. Ate 1000 tags/segundo.' },
  { icon: Plug,      title: 'Integracao ERP',            desc: 'Conecte SAP, TOTVS, Oracle e outros via API REST ou importacao CSV.' },
  { icon: BarChart2, title: 'Relatorios Completos',      desc: 'Dashboards em tempo real com historico de conferencias e tendencias.' },
  { icon: Shield,    title: 'Controle de Acesso',        desc: 'Perfis Admin, Gerente, Operador e Visualizador com permissoes granulares.' },
  { icon: Zap,       title: 'Alertas Automaticos',       desc: 'Notificacoes de divergencia, ativo ausente e estoque critico em tempo real.' },
  { icon: MapPin,    title: 'Multiplos Setores',         desc: 'Gerencie varios setores, depositos e filiais em uma unica plataforma.' },
  { icon: RefreshCw, title: 'Sincronizacao Continua',    desc: 'Dados sincronizados automaticamente com ERP a cada leitura RFID.' },
  { icon: Wifi,      title: 'Operacao Offline',          desc: 'Modo offline com sincronizacao automatica ao reconectar.' },
  { icon: Tag,       title: 'Etiquetas Flexiveis',       desc: 'Suporte a etiquetas metalicas, adesivas e de tecido para qualquer ativo.' },
];

function Features() {
  return (
    <section id="recursos" className="py-24 bg-white dark:bg-[#141414]">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-3">Recursos</div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Tudo que voce precisa<br />em um unico sistema
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
                <div className="w-9 h-9 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all">
                  <f.icon className="w-4 h-4 text-yellow-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const plans = [
  {
    name: 'Starter', price: 'R$ 299', period: '/mes', featured: false,
    desc: 'Ideal para piloto ou operacao inicial.',
    features: ['1 modulo (Bens ou Estoque)', 'Ate 500 itens', '2 usuarios', 'Dashboard basico', 'Historico 30 dias', 'Suporte por e-mail'],
    cta: 'Comecar agora',
  },
  {
    name: 'Business', price: 'R$ 799', period: '/mes', featured: true,
    badge: 'Mais popular',
    desc: 'Para operacao recorrente de inventario.',
    features: ['2 modulos (Bens + Estoque)', 'Ate 3.000 itens', '10 usuarios', 'Dashboard + relatorios', 'Integracao ERP', 'Historico 12 meses', 'Suporte prioritario'],
    cta: 'Assinar Business',
  },
  {
    name: 'Enterprise', price: 'Sob consulta', period: 'contrato anual', featured: false,
    desc: 'Para multiplas filiais e grande volume.',
    features: ['Itens ilimitados', 'Usuarios ilimitados', 'Multiplas filiais', 'Integracao ERP + SLA', 'Multiplos leitores RFID', 'Relatorios personalizados', 'Suporte premium 24/7'],
    cta: 'Falar com especialista',
  },
];

function Pricing({ onDemo }: { onDemo: () => void }) {
  return (
    <section id="precos" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">Planos e Precos</div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
              Simples, transparente<br />e escalavel
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Comece pequeno e expanda conforme o crescimento da operacao.
            </p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <div className={`rounded-2xl p-7 relative transition-shadow ${
                plan.featured
                  ? 'bg-gradient-to-b from-[#1f1f1f] to-[#141414] border border-yellow-500/40 shadow-xl shadow-yellow-500/10'
                  : 'bg-[#141414] border border-slate-800'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{plan.name}</div>
                <div className="text-4xl font-black text-white mb-0.5 tracking-tight">{plan.price}</div>
                <div className="text-xs text-slate-500 mb-3">{plan.period}</div>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">{plan.desc}</p>
                <div className="h-px bg-slate-800 mb-5" />
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={onDemo}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
                  }`}>
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="py-24 bg-white dark:bg-[#141414]">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <Reveal>
          <div className="bg-gradient-to-br from-[#141414] to-black border border-slate-800 rounded-3xl p-12">
            <div className="w-12 h-12 bg-yellow-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Radio className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">
              Pronto para transformar<br />sua operacao?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Acesse a demonstracao completa agora. Sem cartao de credito, sem instalacao.
            </p>
            <button onClick={onDemo}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors inline-flex items-center gap-2 shadow-lg shadow-yellow-500/25">
              Ver demonstracao completa <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const { theme, toggleTheme, elderlyMode, toggleElderlyMode } = useTheme();
  return (
    <footer className="bg-black border-t border-slate-800 py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-slate-400 text-sm font-medium">RFID Control</span>
        </div>
        <p className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} RFID Control. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <button onClick={toggleElderlyMode}
            className={`flex items-center gap-2 text-xs transition-colors ${
              elderlyMode ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'
            }`}>
            <Glasses className="w-3.5 h-3.5" />
            {elderlyMode ? 'Acessível ativo' : 'Modo acessível'}
          </button>
          <button onClick={toggleTheme}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs transition-colors">
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Landing() {
  const navigate = useNavigate();
  const goDemo = () => navigate('/login');

  return (
    <div className="bg-white dark:bg-black">
      <Nav onDemo={goDemo} />
      <Hero onDemo={goDemo} />
      <Problems />
      <Solution />
      <Features />
      <Pricing onDemo={goDemo} />
      <CTA onDemo={goDemo} />
      <Footer />
    </div>
  );
}
