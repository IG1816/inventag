const variants: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  missing: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  maintenance: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  retired: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  transferred: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  correct: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  extra: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  not_scanned: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  pending_review: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  in_progress: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  approved: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
  open: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  in_review: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  ignored: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  low: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  high: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  critical: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  connected: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  disconnected: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  testing: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  found_correctly: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  wrong_location: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  unknown_tag: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  ready: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  generating: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  scheduled: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  pending_parts: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  cancelled: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

const labels: Record<string, string> = {
  active: 'Ativo', missing: 'Ausente', maintenance: 'Manutenção',
  retired: 'Baixado', transferred: 'Transferido',
  correct: 'Correto', extra: 'Extra', not_scanned: 'Não Lido',
  pending_review: 'Aguard. Revisão',
  in_progress: 'Em Andamento', completed: 'Concluído', approved: 'Aprovado',
  open: 'Aberto', in_review: 'Em Revisão', resolved: 'Resolvido', ignored: 'Ignorado',
  low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica',
  connected: 'Conectado', disconnected: 'Desconectado', error: 'Erro', testing: 'Testando',
  found_correctly: 'Encontrado', wrong_location: 'Local Errado',
  unknown_tag: 'Tag Desconhecida', ready: 'Pronto', generating: 'Gerando',
  scheduled: 'Agendada', pending_parts: 'Aguard. Peças', cancelled: 'Cancelada',
};

interface Props { status: string; size?: 'sm' | 'md'; }

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cls = variants[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  const label = labels[status] ?? status.replace(/_/g, ' ');
  const sz = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sz} ${cls}`}>
      {label}
    </span>
  );
}
