# Métodos de trabalho

## Verificação (regra nº 1)

Do mais simples ao mais forte:

1. Pedir no prompt: "rode `npm run typecheck && npm run lint` e mostre a saída".
2. `/goal` com critério de pronto.
3. Stop hook que bloqueia o fim com teste falhando.
4. Subagente revisor em contexto limpo (`/code-review`).

Para UI: screenshot comparado com o design.

## Fluxo

- **Explorar → planejar → implementar → commitar.** Plan mode (`Shift+Tab`); editar o plano com `Ctrl+G`. Se o diff cabe numa frase, pular o plano.
- **Spec por entrevista:** "me entreviste até ter uma SPEC.md completa"; implementar numa sessão nova lendo a SPEC. Versão formal: [github/spec-kit](https://github.com/github/spec-kit). Crítica (Böckeler, martinfowler.com): custo de revisão e falsa sensação de controle.
- **TDD com dois agentes:** um escreve os testes falhando, outro implementa até passarem.

## Evals (para features de IA nos produtos)

Segundo Hamel Husain ([evals FAQ](https://hamel.dev/blog/posts/evals-faq/)):

- começar pela análise de erros em respostas reais;
- critérios **binários** passa/falha, nada de nota de 1 a 5;
- calibrar o LLM-juiz contra o julgamento humano.

Skills prontas: [hamelsmu/evals-skills](https://github.com/hamelsmu/evals-skills).

**Rubrica:** os Outcomes do Claude Managed Agents usam um avaliador separado que itera até aprovar (até +10 pontos de sucesso, segundo a Anthropic).
