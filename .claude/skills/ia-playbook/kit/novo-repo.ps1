# Copia o ia-playbook para um repositório (novo ou existente). Windows.
# Uso: powershell -ExecutionPolicy Bypass -File kit\novo-repo.ps1 C:\caminho\do\repo
# Rodar de novo atualiza a skill; o CLAUDE.md do repo nunca é sobrescrito.
param([Parameter(Mandatory = $true)][string]$Destino)
$ErrorActionPreference = "Stop"
$skill = Split-Path -Parent $PSScriptRoot

$alvo = Join-Path $Destino ".claude\skills\ia-playbook"
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $alvo) | Out-Null
if (Test-Path $alvo) { Remove-Item -Recurse -Force $alvo }
Copy-Item -Recurse $skill $alvo
Write-Host "Skill copiada para $alvo"

$claudeMd = Join-Path $Destino "CLAUDE.md"
if (Test-Path $claudeMd) {
    Write-Host "CLAUDE.md já existe; mantido como está."
} else {
    Copy-Item (Join-Path $skill "kit\CLAUDE-modelo.md") $claudeMd
    Write-Host "CLAUDE.md criado a partir do modelo. Preencha os campos <...>."
}
