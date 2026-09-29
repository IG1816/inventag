# Instala o ia-playbook como memória global do Claude Code e do Cursor (Windows).
# Uso: na pasta do repositório, rode  powershell -ExecutionPolicy Bypass -File .claude\skills\ia-playbook\instalar\instalar.ps1
$ErrorActionPreference = "Stop"
$origem = Split-Path -Parent $PSScriptRoot

foreach ($base in @("$HOME\.claude\skills", "$HOME\.cursor\skills")) {
    New-Item -ItemType Directory -Force -Path $base | Out-Null
    Copy-Item -Recurse -Force $origem "$base\ia-playbook"
    Write-Host "Skill instalada em $base\ia-playbook"
}

$claudeMd = "$HOME\.claude\CLAUDE.md"
$regras = Get-Content -Raw "$PSScriptRoot\CLAUDE-global.md"
if ((Test-Path $claudeMd) -and (Select-String -Quiet -Path $claudeMd -Pattern "ia-playbook")) {
    Write-Host "$claudeMd já tem as regras; nada a fazer."
} else {
    Add-Content -Path $claudeMd -Value "`n$regras"
    Write-Host "Regras adicionadas em $claudeMd"
}
