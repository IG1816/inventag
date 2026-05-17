import { useNavigate } from 'react-router-dom';
import {
  Tag, AlertTriangle, BarChart3, Plug, Shield, Zap, ArrowRight,
  CheckCircle2, Clock, TrendingUp, Package2, Boxes, Radio, Target,
  Users, Building2, MapPin, Wrench, FileText, Bell, Search, RefreshCw,
  ChevronRight, Star
} from 'lucide-react';
import Layout from '../components/Layout';

const problems = [
  { icon: Clock, title: 'Auditorias demoram dias', desc: 'Uma contagem física tradicional exige parar a operação por horas ou dias inteiros. Com RFID, o mesmo processo leva minutos.' },
  { icon: AlertTriangle, title: 'Ativos somem sem explicação', desc: 'Empresas brasileiras perdem em média 8% dos seus ativos fixos todo ano por furto, extravio ou transferências não registradas.' },
  { icon: TrendingUp, title: 'ERP desatualizado e divergente', desc: 'O sistema tem 150 notebooks cadastrados. Na realidade, há 132. Essa diferença gera problemas fiscais, seguros errados e relatórios inválidos.' },
  { icon: Package2, title: 'Estoque no escuro', desc: 'Sem visibilidade em tempo real, a equipe descobre a falta de um item crítico só quando já é tarde — ou compra em excesso e imobiliza capital.' },
];

const solutions = [
  { icon: Radio, color: 'bg-yellow-600', title: 'Leitura RFID em massa', desc: 'Leia centenas de ativos de uma só vez, sem necessidade de linha de visão. Tags metálicas para ativos fixos, adesivas para itens de estoque.' },
  { icon: Bell, color: 'bg-red-500', title: 'Divergências detectadas na hora', desc: 'O sistema compara automaticamente o que deveria estar lá com o que foi lido. Itens ausentes, excedentes ou deslocados são alertados instantaneamente.' },
  { icon: Plug, color: 'bg-teal-600', title: 'Integração nativa com ERP', desc: 'Sincronização bidirecional com SAP, TOTVS, Bling e outros. O ERP envia as quantidades esperadas; o RFID Manager envia o que realmente existe.' },
  { icon: BarChart3, color: 'bg-amber-500', title: 'Analytics e relatórios em tempo real', desc: 'Dashboard ao vivo com saúde dos ativos, precisão do estoque, tendências de leitura e KPIs de divergência por setor ou localização.' },
];

const modules = [
  {
    icon: Package2, accent: 'blue',
    title: 'Gestão de Ativos Fixos',
    subtitle: 'Computadores, equipamentos, mobiliário e tudo mais.',
    items: [
      'Cadastro com tag RFID metálica e foto',
      'Rastreamento por localização e departamento',
      'Responsável e funcionário vinculado ao ativo',
      'Histórico completo de movimentações',
      'Alerta de ativos ausentes com prioridade',
      'Módulo de manutenção integrado',
    ],
  },
  {
    icon: Boxes, accent: 'teal',
    title: 'Controle de Estoque',
    subtitle: 'Insumos, produtos, peças e materiais de consumo.',
    items: [
      'Tag RFID adesiva por item ou lote',
      'Comparação esperado vs. lido em tempo real',
      'Conciliação com quantidade do ERP',
      'Relatório de divergências (faltante/excedente)',
      'Alertas de estoque mínimo',
      'Movimentação entre localizações',
    ],
  },
  {
    icon: MapPin, accent: 'amber',
    title: 'Gestão de Localizações',
    subtitle: 'Filiais, salas, armazéns e zonas de picking.',
    items: [
      'Mapa de localizações cadastradas',
      'Contagem de ativos e itens por local',
      'Responsável por localização',
      'Divergências por área',
      'Suporte a múltiplos endereços e filiais',
      'QR code de localização para acesso rápido',
    ],
  },
  {
    icon: Wrench, accent: 'rose',
    title: 'Manutenção de Ativos',
    subtitle: 'Preventiva, corretiva e preditiva integrada.',
    items: [
      'Ordens de serviço vinculadas ao ativo',
      'Histórico de manutenções por ativo',
      'Controle de custo por OS',
      'Alertas de próxima manutenção',
      'Status: agendado, em andamento, concluído',
      'Registro de peças trocadas',
    ],
  },
];

const workflow = [
  { step: '01', icon: Tag, title: 'Etiquete seus ativos', desc: 'Cole ou parafuse as tags RFID nos itens. Tags metálicas para equipamentos, adesivas para estoque.' },
  { step: '02', icon: Radio, title: 'Faça uma leitura', desc: 'Use o leitor RFID para varrer um ambiente inteiro em segundos. O sistema registra tudo automaticamente.' },
  { step: '03', icon: Search, title: 'Veja as divergências', desc: 'O RFID Manager compara com os dados do ERP e aponta exatamente o que está fora de lugar.' },
  { step: '04', icon: RefreshCw, title: 'Resolva e sincronize', desc: 'Registre o tratamento da divergência e sincronize o resultado com seu ERP em um clique.' },
];

const testimonials = [
  { name: 'Marcos Oliveira', role: 'Gerente de TI', company: 'Grupo Varejo Nacional', text: 'Antes levávamos 3 dias para auditar nossos 400 notebooks. Com o RFID Manager, fazemos isso em 40 minutos e com 99% de precisão.' },
  { name: 'Fernanda Castro', role: 'Diretora de Operações', company: 'LogFast Transportes', text: 'Reduzimos em 70% as discrepâncias entre ERP e estoque físico no primeiro mês. O ROI foi imediato.' },
  { name: 'Ricardo Nunes', role: 'Controller', company: 'MedSupply Brasil', text: 'A integração com o TOTVS foi simples e sem dor. Agora tenho confiança nos números que apresento para o conselho.' },
];

const integrations = [
  { name: 'SAP', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'TOTVS', color: 'bg-red-100 text-red-700' },
  { name: 'Bling', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Omie', color: 'bg-teal-100 text-teal-700' },
  { name: 'Oracle', color: 'bg-red-100 text-red-800' },
  { name: 'Sankhya', color: 'bg-green-100 text-green-700' },
  { name: 'Zebra', color: 'bg-slate-100 text-slate-700' },
  { name: 'Impinj', color: 'bg-yellow-100 text-yellow-800' },
];

const roadmap = [
  { phase: 'Disponível Agora', color: 'bg-emerald-500', badge: 'emerald', items: ['Cadastro de ativos e estoque', 'Simulação de leitura RFID', 'Detecção de divergências', 'Integração ERP (SAP, Bling)', 'Dashboard e analytics', 'Módulo de manutenção'] },
  { phase: 'Em Breve — Fase 2', color: 'bg-yellow-500', badge: 'blue', items: ['App mobile iOS & Android', 'SDK para leitores RFID reais', 'Leitura por QR Code / Barras', 'Relatórios avançados e BI', 'Suporte multi-empresa'] },
  { phase: 'Futuro — Fase 3', color: 'bg-amber-500', badge: 'amber', items: ['IA para detecção de anomalias', 'Manutenção preditiva com ML', 'Integração com câmeras', 'Trilha de auditoria blockchain', 'Marketplace de hardware RFID'] },
];

const accentMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
  blue:  { bg: 'bg-yellow-600',  text: 'text-yellow-600',  border: 'border-yellow-200',  light: 'bg-yellow-50' },
  teal:  { bg: 'bg-teal-600',  text: 'text-teal-600',  border: 'border-teal-200',  light: 'bg-teal-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50' },
  rose:  { bg: 'bg-rose-500',  text: 'text-rose-600',  border: 'border-rose-200',  light: 'bg-rose-50' },
};

export default function Presentation() {
  const navigate = useNavigate();

  return (
    <Layout title="Visão Geral" subtitle="RFID Manager — A plataforma de controle patrimonial e estoque">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-10 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-600/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-5">
            <Tag className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-semibold tracking-wide uppercase">Plataforma SaaS · MVP v1.0</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Controle total de ativos<br />e estoque com <span className="text-yellow-400">RFID</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Elimine auditorias manuais, detecte divergências em segundos e sincronize com seu ERP automaticamente.
            Feito para empresas brasileiras que querem parar de perder ativos e tempo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white font-semibold rounded-xl hover:bg-yellow-700 transition-colors shadow-lg shadow-yellow-900/40">
              Acessar o Sistema <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/pricing')}
              className="px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-xl hover:border-slate-400 hover:text-white transition-colors">
              Ver Planos e Preços
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
            {[
              { val: '99%+', label: 'Precisão de inventário' },
              { val: '90%', label: 'Auditorias mais rápidas' },
              { val: '3×', label: 'Redução de perdas' },
              { val: '< 2h', label: 'Contagem completa' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-yellow-400">{val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Problemas ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">O Problema</p>
          <h2 className="text-2xl font-black text-slate-900">Sua empresa ainda sofre com isso?</h2>
          <p className="text-slate-500 mt-1">Empresas brasileiras perdem bilhões por ano com gestão ineficiente de ativos e estoque.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {problems.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 hover:border-red-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Solução ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">A Solução</p>
          <h2 className="text-2xl font-black text-slate-900">RFID Manager fecha a lacuna entre o físico e o digital</h2>
          <p className="text-slate-500 mt-1">Uma plataforma completa que conecta leitores RFID, dados de ERP e sua equipe operacional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {solutions.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 hover:border-yellow-200 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Como funciona ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-8">
        <div className="mb-6">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Como Funciona</p>
          <h2 className="text-xl font-black text-slate-900">Do leitor ao ERP em 4 passos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflow.map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              {i < workflow.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[-28px] h-0.5 bg-slate-200 z-0">
                  <ChevronRight className="absolute -right-2 -top-2.5 w-5 h-5 text-slate-300" />
                </div>
              )}
              <div className="relative z-10 w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-yellow-200">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black text-yellow-400 mb-1">{step}</span>
              <p className="text-sm font-bold text-slate-900 mb-1">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Módulos ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Módulos</p>
          <h2 className="text-2xl font-black text-slate-900">Tudo que você precisa em uma plataforma</h2>
          <p className="text-slate-500 mt-1">Quatro módulos integrados que cobrem todo o ciclo de vida dos seus ativos e estoque.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(({ icon: Icon, accent, title, subtitle, items }) => {
            const a = accentMap[accent];
            return (
              <div key={title} className={`bg-white rounded-xl border-2 ${a.border} p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${a.light} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${a.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${a.text} flex-shrink-0`} />
                      <span className="text-xs text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Integrações ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-8">
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Integrações</p>
          <h2 className="text-xl font-black text-slate-900">Conecta com os sistemas que você já usa</h2>
          <p className="text-sm text-slate-500 mt-1">Sincronização bidirecional com os principais ERPs e leitores RFID do mercado brasileiro.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map(({ name, color }) => (
            <span key={name} className={`px-4 py-2 rounded-xl text-sm font-bold ${color}`}>{name}</span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">+ API aberta para integração com qualquer sistema</p>
      </div>

      {/* ── Depoimentos ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-5 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Depoimentos</p>
          <h2 className="text-2xl font-black text-slate-900">O que nossos clientes dizem</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(({ name, role, company, text }) => (
            <div key={name} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed flex-1">"{text}"</p>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{role} · {company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mercado-alvo ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-8">
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mercado</p>
          <h2 className="text-xl font-black text-slate-900">Para quem é o RFID Manager?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Building2, title: 'Setores', items: ['Varejo e E-commerce', 'Saúde e Farmácia', 'Indústria e Manufatura', 'TI e Tecnologia', 'Logística e Distribuição', 'Educação e Governo'] },
            { icon: Users, title: 'Porte da Empresa', items: ['PMEs: 20–200 funcionários', 'Médio porte: 200–1.000', 'Enterprise: 1.000+', 'Redes de franquias', 'Setor público e ONGs'] },
            { icon: Target, title: 'Dores Resolvidas', items: ['Inventário anual patrimonial', 'Sumiço de equipamentos de TI', 'Divergências entre ERP e físico', 'Relatórios para seguradoras', 'Auditorias fiscais e compliance'] },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">{title}</span>
              </div>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Roadmap ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Roadmap</p>
          <h2 className="text-2xl font-black text-slate-900">O que vem por aí</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmap.map(({ phase, color, badge, items }) => {
            const badgeColors: Record<string, string> = {
              emerald: 'bg-emerald-100 text-emerald-700',
              blue: 'bg-yellow-100 text-yellow-700',
              amber: 'bg-amber-100 text-amber-700',
            };
            const iconColors: Record<string, string> = {
              emerald: 'text-emerald-500', blue: 'text-yellow-500', amber: 'text-amber-500',
            };
            return (
              <div key={phase} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 ${color} rounded-full`} />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColors[badge]}`}>{phase}</span>
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${iconColors[badge]} flex-shrink-0 mt-0.5`} />
                      <span className="text-xs text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-yellow-950 rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-4">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-semibold">Teste grátis por 14 dias · Sem cartão de crédito</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Pronto para transformar seu controle patrimonial?</h3>
          <p className="text-slate-300 text-sm mb-7 max-w-md mx-auto">
            Mais de 200 empresas brasileiras já usam o RFID Manager para alcançar 99%+ de precisão no inventário.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/scans/new')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-yellow-700 font-bold rounded-xl hover:bg-yellow-50 transition-colors shadow-lg">
              <Radio className="w-4 h-4" /> Experimentar Leitura RFID
            </button>
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 border border-yellow-400 text-white font-medium rounded-xl hover:bg-yellow-900/40 transition-colors">
              Ver Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-xl hover:border-slate-400 hover:text-white transition-colors">
              <FileText className="w-4 h-4" /> Ver Planos
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
