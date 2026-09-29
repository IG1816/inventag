#!/usr/bin/env bash
# Copia o ia-playbook para um repositório (novo ou existente).
# Uso: bash kit/novo-repo.sh /caminho/do/repo
# Rodar de novo atualiza a skill; o CLAUDE.md do repo nunca é sobrescrito.
set -euo pipefail
destino="${1:?Informe a pasta do repositório}"
skill="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$destino/.claude/skills"
rm -rf "$destino/.claude/skills/ia-playbook"
cp -r "$skill" "$destino/.claude/skills/ia-playbook"
echo "Skill copiada para $destino/.claude/skills/ia-playbook"

if [ -f "$destino/CLAUDE.md" ]; then
  echo "CLAUDE.md já existe; mantido como está."
else
  cp "$skill/kit/CLAUDE-modelo.md" "$destino/CLAUDE.md"
  echo "CLAUDE.md criado a partir do modelo. Preencha os campos <...>."
fi
