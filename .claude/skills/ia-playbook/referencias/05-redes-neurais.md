# Redes neurais com agentes

## O erro

Pedir no chat "cria uma rede neural que faz X" e ir ajustando na conversa. O LLM vira um digitador caro, e ninguém mede se melhorou.

## O jeito atual: o Loop Karpathy ([autoresearch](https://github.com/karpathy/autoresearch))

Três arquivos:

- `prepare.py` — dados e avaliação. **Congelado**; o agente não mexe.
- `train.py` — o **único** arquivo que o agente edita.
- `program.md` — suas instruções para o agente.

Cada experimento treina por um tempo fixo (5 min) e é medido por uma métrica escalar só. Melhorou: `git commit`. Piorou: `git reset`. Dá ~12 experimentos por hora e ~100 numa noite. Karpathy relatou ~700 experimentos em 2 dias e ~20 ganhos que somaram −11% no tempo até a qualidade do GPT-2. São números do próprio autor.

## Receita

1. Congele dados e avaliação.
2. Fixe o orçamento de tempo ou de compute por experimento.
3. Uma métrica escalar comparável (val loss, acurácia, F1).
4. O agente edita um arquivo só.
5. Tudo em git + log (`results.tsv`).
6. **Conjunto de teste que o agente nunca vê**, contra overfitting na validação e "reward hacking".

## Antes de treinar

- **Baseline simples primeiro.** Em dados tabulares, XGBoost costuma vencer rede neural.
- **Pré-treinado > do zero.** Para produto: fine-tuning/LoRA, foundation model (ex.: [TimesFM](https://github.com/google-research/timesfm) para séries temporais) ou prompting + RAG. Do zero só para aprender (nanoGPT/nanochat) ou em domínio muito específico com muitos dados.
- **LLM para preparar dados** (rotular, gerar sintético) via Batch API, pela metade do preço.
