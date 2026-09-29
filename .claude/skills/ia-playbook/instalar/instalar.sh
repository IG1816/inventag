#!/usr/bin/env bash
# Instala o ia-playbook como memória global do Claude Code e do Cursor (macOS/Linux).
# Uso: bash .claude/skills/ia-playbook/instalar/instalar.sh
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"
origem="$(dirname "$aqui")"

for base in "$HOME/.claude/skills" "$HOME/.cursor/skills"; do
  mkdir -p "$base"
  rm -rf "$base/ia-playbook"
  cp -r "$origem" "$base/ia-playbook"
  echo "Skill instalada em $base/ia-playbook"
done

claude_md="$HOME/.claude/CLAUDE.md"
if [ -f "$claude_md" ] && grep -q "ia-playbook" "$claude_md"; then
  echo "$claude_md já tem as regras; nada a fazer."
else
  printf '\n' >> "$claude_md"
  cat "$aqui/CLAUDE-global.md" >> "$claude_md"
  echo "Regras adicionadas em $claude_md"
fi
