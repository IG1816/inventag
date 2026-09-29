# MCP, Skills e CLI

## Veredito

O Samuel acerta em parte. Encher o contexto com vários servidores MCP carregando todas as definições de ferramenta a cada turno é prática velha e cara. Mas MCP não morreu: foi doado à Agentic AI Foundation (Linux Foundation) em dez/2025, ganhou MCP Apps em jan/2026 e o Claude Code ainda documenta `claude mcp add`. Nenhuma fonte sustenta "2–3 gerações atrás" literalmente.

A prática atual é em camadas:

| Camada | Serve para | Como |
|---|---|---|
| **Skills** (`SKILL.md`) | "Como fazer": convenções, fluxos, conhecimento de domínio | `.claude/skills/<nome>/SKILL.md`; só nome+descrição entram no contexto até ser acionada |
| **CLI via bash** | Integrações comuns | `gh`, `supabase`, `vercel`, `gws`; "rode `foo --help` para aprender" |
| **MCP** | OAuth multiusuário, serviço remoto sem CLI, governança, UI interativa | Com tool search (`defer_loading`) ou execução de código |

## Números

- 5 servidores MCP ≈ 55k tokens de definições; caso interno da Anthropic chegou a 134k ([advanced-tool-use](https://www.anthropic.com/engineering/advanced-tool-use)).
- Tool search: −85% de tokens e melhor escolha de ferramenta (Opus 4.5: 79,5% → 88,1%).
- Execução de código com MCP: 150k → 2k tokens num fluxo Drive→Salesforce (melhor caso, não média).
- Doc oficial do Claude Code: "CLI tools are the most context-efficient way to interact with external services" ([best-practices](https://code.claude.com/docs/en/best-practices)).
- Benchmarks de fornecedor dizem que CLI sai 4–35x mais barata que MCP. A direção é confiável; a magnitude, não verificada.

## Aplicado ao Igor

- Supabase: preferir `supabase` CLI + skill `supabase/agent-skills`; MCP do Supabase só para o que a CLI não cobre.
- Vercel: `vercel` CLI + `vercel-labs/agent-skills`.
- GitHub: `gh`.
- Google (Drive/Sheets/Gmail): `googleworkspace/cli` (`gws`) já traz SKILL.md.
- Desligar conectores que não estão em uso na sessão.
