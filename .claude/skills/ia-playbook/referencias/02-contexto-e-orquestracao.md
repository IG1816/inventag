# Contexto e orquestração

## Contexto

- **CLAUDE.md/AGENTS.md curto e escrito à mão.** Arquivos gerados por LLM reduziram o sucesso em ~3% e aumentaram o custo em >20%; os escritos por humanos melhoraram ~4% ([arXiv 2602.11988](https://arxiv.org/abs/2602.11988)). Para cada linha: "tirar isso causaria erro?". Manter comandos de build/teste, exceções de estilo e armadilhas. Tirar tutoriais e o que o modelo deduz lendo o código. Não usar `/init` sem revisar.
- **`/clear`** entre tarefas sem relação; **`/compact <foco>`** na troca de fase; **`/rewind`** para voltar. Dizer no CLAUDE.md o que precisa sobreviver à compactação (restrições se perdem no resumo — "Lost in Compaction", arXiv 2608.11242).
- **Subagentes** (`.claude/agents/*.md`, com `tools` e `model` próprios) exploram num contexto separado e devolvem 1–2k tokens.
- **Saídas em arquivo** (SPEC.md, PLAN.md, notas) = memória persistente e barata.
- **Memória opcional:** [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory) (brasileiro; handoff entre Claude/Codex/opencode), [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight). Na maioria dos casos, CLAUDE.md enxuto + notas em arquivo bastam.

## Orquestração

- **Worktrees + sessões paralelas.** Boris Cherny (criador do Claude Code) roda 3–5 worktrees locais + 5–10 sessões na nuvem.
- **`/batch`** divide uma mudança grande em vários subagentes, cada um no seu worktree.
- **Headless:** `claude -p "..." --output-format json` para CI e lote:
  `for f in $(cat files.txt); do claude -p "Migrate $f" --allowedTools "Edit,Bash(git commit *)"; done`
- **Hooks** (`.claude/settings.json`) são determinísticos; instruções no CLAUDE.md não. Exemplos: eslint/tsc depois de cada edição; Stop hook que não deixa terminar com teste falhando.
- **Routines:** agentes por cron, API ou evento do GitHub, rodando com o notebook fechado ([docs](https://code.claude.com/docs/en/routines)).
- **Frotas** ([stablyai/orca](https://github.com/stablyai/orca), [paperclipai/paperclip](https://github.com/paperclipai/paperclip)): para dev solo, 3–5 worktrees com revisão humana tem muito mais evidência do que "empresa zero-humano".
