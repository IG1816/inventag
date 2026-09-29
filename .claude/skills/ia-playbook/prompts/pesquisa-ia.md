# Prompt: refazer a pesquisa (usar a cada ~3 meses)

Cole numa sessão do Claude Code com acesso à web:

```
Quero atualizar meu ia-playbook (.claude/skills/ia-playbook). Faça em duas frentes,
com um subagente de pesquisa para cada uma, e só depois edite os arquivos.

CONTEXTO SOBRE MIM
Dev full stack júnior (Next.js/React/TypeScript, Python/FastAPI, Supabase, Vercel),
tech lead de squad, faço sites e SaaS para negócios locais, skills de RPG
(Códice Amaldiçoado / D&D Pensamentos, FM Combeiro), conteúdo no YouTube e
experimentos com redes neurais.

FRENTE 1 — PROJETOS E SKILLS
1. Liste todos os meus projetos: GitHub (IG1816 e gabrieldagostivana), Vercel e
   Supabase. Para cada um: o que é e a stack.
2. Consulte o GitHub Trending (semanal e mensal) e o tópico agent-skills por
   estrelas. Para cada projeto, recomende no máximo 3 skills, com estrelas, motivo
   e comando de instalação. Aponte os riscos (sobreposição, scripts de terceiros).

FRENTE 2 — COMO OS MELHORES USAM IA AGORA
Pesquise em fontes primárias (docs e blogs de engenharia da Anthropic, OpenAI e
Google; Karpathy, Simon Willison, Addy Osmani, Boris Cherny, Hamel Husain; papers
no arXiv; repos em alta) e responda:
a) O que mudou desde a última versão do playbook? MCP x skills x CLI x o que vier depois.
b) Engenharia de contexto, memória, subagentes, paralelismo, hooks, agentes agendados.
c) Métodos: verificação, spec, TDD, evals, loops com métrica.
d) Custo: preços atuais, effort, cache, batch.
e) Redes neurais com agentes: loops de experimento, pré-treinados, fine-tuning.
Para cada item: o que é, por que supera o jeito antigo, como fazer (comando ou
arquivo) e o link. Separe o que tem evidência do que é hype e diga o que não
conseguiu verificar.

SAÍDA
- Atualize os arquivos em referencias/ mantendo o SKILL.md curto (só postura,
  top 10 e roteador).
- Troque a data no topo.
- Mostre um resumo do que mudou e faça o commit.
```
