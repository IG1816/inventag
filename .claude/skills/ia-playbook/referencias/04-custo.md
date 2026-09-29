# Custo de tokens

Preços oficiais em 29/09/2026 ([pricing](https://platform.claude.com/docs/en/about-claude/pricing)), por milhão de tokens, entrada/saída:

| Modelo | Preço | Usar para |
|---|---|---|
| Opus 5.5 | $4 / $20 | Raciocínio difícil, arquitetura, bug cabeludo |
| Sonnet 5.5 | $2 / $10 | Dia a dia |
| Haiku 4.5 | $1 / $5 | Tarefas repetitivas, subagentes de busca |

## Alavancas, das grátis para as que trocam qualidade

1. **Contexto limpo:** `/clear`, subagentes, MCP desligado, CLI no lugar.
2. **Prompt caching:** leitura custa 0,1x a entrada (0,05x no Opus 5.5); escrita 1,25x (5 min) ou 2x (1 h). Deixar o prefixo estável no começo (system, CLAUDE.md, ferramentas). MCP que muda ferramentas no meio da sessão quebra o cache.
3. **Batch API:** −50% em entrada e saída, soma com o cache. Para o que pode esperar até 24 h: classificar comentários do YouTube, gerar descrições, rodar evals, rotular dados.
4. **Effort:** `claude --effort low|medium|high|xhigh|max`. Testar o modelo forte com effort baixo antes de trocar para um modelo mais fraco.
5. **Modelo por tarefa:** `model: haiku` no frontmatter de subagentes simples.

## Métrica

Custo por tarefa concluída e verificada. O tokenizer do Claude 4.7+ gera ~30% mais tokens para o mesmo texto, então comparar preço por token entre gerações engana.
