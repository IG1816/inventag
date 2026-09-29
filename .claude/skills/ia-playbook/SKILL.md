---
name: ia-playbook
description: Playbook pessoal do Igor sobre como usar IA no nível mais alto em 2026 — contexto, skills vs MCP vs CLI, verificação, agentes em paralelo, custo de tokens e loops de experimento para redes neurais — mais as skills recomendadas para cada projeto dele (Studio Beholder, D&D Pensamentos/Códice Amaldiçoado, FM Combeiro, FornoSlot, Agrolino, InvenTag, LeadFinder, landing pages). Use quando ele perguntar como usar IA melhor, como gastar menos tokens, se deve usar MCP, qual skill instalar num projeto, como montar um fluxo com agentes, ou como treinar/otimizar rede neural com agente.
---

# IA Playbook

Pesquisa de 29/09/2026. Reavaliar a cada ~3 meses: a área muda rápido.

## Postura

1. **Verificação antes de tudo.** O agente só "terminou" quando mostra evidência: teste, `tsc`, lint, build, screenshot. Sem isso, o humano vira o testador.
2. **Contexto é recurso escasso.** O desempenho cai conforme o contexto enche. Carregar só o que a tarefa pede.
3. **Conhecimento em skills, integrações em CLI, MCP só onde justifica** (OAuth, serviço remoto sem CLI). Ver [01-mcp-skills-cli.md](referencias/01-mcp-skills-cli.md).
4. **Medir custo por tarefa concluída**, não preço por token.

## Top 10 práticas (ordem de impacto)

1. Verificação executável + exigir evidência (Stop hook ou subagente revisor).
2. `/clear` entre tarefas, `/compact <foco>`, subagentes para exploração; depois de 2 correções falhas, recomeçar com prompt melhor.
3. Explorar → planejar → implementar (plan mode ou SPEC.md feito por entrevista, executado em sessão nova).
4. Trocar MCP "sempre ligado" por CLI (`gh`, `supabase`, `vercel`) + skills. Rodar `/context` para ver o custo de cada servidor.
5. CLAUDE.md/AGENTS.md curto e escrito à mão — gerado por LLM piora (arXiv 2602.11988).
6. Skills para conhecimento recorrente (as oficiais + as próprias, como o Códice).
7. Hooks para regras obrigatórias (lint/tsc após editar, bloquear pastas sensíveis).
8. 3–5 sessões em paralelo com worktrees; `claude -p` para tarefas em lote; Routines para o que é recorrente.
9. Modelo e effort certos por tarefa, cache com prefixo estável, Batch API (−50%) para o que pode esperar.
10. Loops com métrica (autoresearch, evals binários, rubricas), com conjunto de teste que o agente nunca vê.

## Roteador

| Pergunta | Abrir |
|---|---|
| MCP está ultrapassado? Skill, CLI ou MCP? | [01-mcp-skills-cli.md](referencias/01-mcp-skills-cli.md) |
| Contexto, CLAUDE.md, memória, subagentes, paralelismo, hooks | [02-contexto-e-orquestracao.md](referencias/02-contexto-e-orquestracao.md) |
| Fluxo de trabalho, verificação, spec, TDD, evals | [03-metodos.md](referencias/03-metodos.md) |
| Custo de tokens, modelo, effort, cache, batch | [04-custo.md](referencias/04-custo.md) |
| Rede neural com agente, autoresearch | [05-redes-neurais.md](referencias/05-redes-neurais.md) |
| Qual skill instalar em qual projeto | [06-projetos-e-skills.md](referencias/06-projetos-e-skills.md) |
| Refazer a pesquisa / prompt pronto | [prompts/pesquisa-ia.md](prompts/pesquisa-ia.md) |
| Levar para um repositório novo | `bash kit/novo-repo.sh <pasta>` ou `kit\novo-repo.ps1 <pasta>` |
