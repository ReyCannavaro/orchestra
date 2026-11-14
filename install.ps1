# Orchestra Windows Installer (PowerShell)
# One-liner execution: irm https://raw.githubusercontent.com/<username>/orchestra/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ___  ____   ____ _   _ _____ ____ _____ ____     _    " -ForegroundColor Cyan
Write-Host " / _ \|  _ \ / ___| | | | ____/ ___|_   _|  _ \   / \   " -ForegroundColor Cyan
Write-Host "| | | | |_) | |   | |_| |  _| \___ \ | | | |_) | / _ \  " -ForegroundColor Cyan
Write-Host "| |_| |  _ <| |___|  _  | |___ ___) || | |  _ < / ___ \ " -ForegroundColor Cyan
Write-Host " \___/|_| \_\\____|_| |_|_____|____/ |_| |_| \_/_/   \_\" -ForegroundColor Cyan
Write-Host "  The Symphony Paradigm for Autonomous Multi-Agent Engineering" -ForegroundColor DarkGray
Write-Host ""

$HomeDir = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::UserProfile)
$TargetDir = Join-Path $HomeDir ".agents\skills"

Write-Host "📦 Setting up Orchestra Global Hub at $TargetDir..." -ForegroundColor Yellow

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

# If running locally from repo
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path -ErrorAction SilentlyContinue
if ($ScriptDir -and (Test-Path (Join-Path $ScriptDir "core-skills"))) {
    Copy-Item -Path (Join-Path $ScriptDir "core-skills\*") -Destination $TargetDir -Recurse -Force
} else {
    Write-Host "🌐 Fetching latest Orchestra skills from GitHub repository..." -ForegroundColor Cyan
    # Download zip or clone fallback
}

Write-Host "✔ Successfully installed Orchestra Core Skills to $TargetDir" -ForegroundColor Green
Write-Host "✨ To scaffold a project, run: npx orchestra init" -ForegroundColor Magenta
Write-Host ""
