# Orchestra Windows Installer (PowerShell)
# One-liner execution: irm https://raw.githubusercontent.com/ReyCannavaro/orchestra/main/install.ps1 | iex

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

# If running locally from cloned repo
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path -ErrorAction SilentlyContinue
if ($ScriptDir -and (Test-Path (Join-Path $ScriptDir "core-skills"))) {
    Write-Host "📂 Found local core-skills directory. Syncing..." -ForegroundColor Cyan
    Copy-Item -Path (Join-Path $ScriptDir "core-skills\*") -Destination $TargetDir -Recurse -Force
} else {
    Write-Host "🌐 Fetching latest Orchestra skills from GitHub (ReyCannavaro/orchestra)..." -ForegroundColor Cyan
    $TempZip = Join-Path $env:TEMP "orchestra-main-$([System.Guid]::NewGuid().ToString('N')).zip"
    $TempExtract = Join-Path $env:TEMP "orchestra-extract-$([System.Guid]::NewGuid().ToString('N'))"

    try {
        $ZipUrl = "https://github.com/ReyCannavaro/orchestra/archive/refs/heads/main.zip"
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        Invoke-WebRequest -Uri $ZipUrl -OutFile $TempZip -UseBasicParsing
        Expand-Archive -Path $TempZip -DestinationPath $TempExtract -Force

        $ExtractedCoreSkills = Join-Path $TempExtract "orchestra-main\core-skills"
        if (Test-Path $ExtractedCoreSkills) {
            Copy-Item -Path (Join-Path $ExtractedCoreSkills "*") -Destination $TargetDir -Recurse -Force
        } else {
            throw "core-skills directory not found in the downloaded archive."
        }
    } finally {
        if (Test-Path $TempZip) { Remove-Item -Path $TempZip -Force -ErrorAction SilentlyContinue }
        if (Test-Path $TempExtract) { Remove-Item -Path $TempExtract -Recurse -Force -ErrorAction SilentlyContinue }
    }
}

Write-Host "✔ Successfully installed Orchestra Core Skills to $TargetDir" -ForegroundColor Green
Write-Host "✨ To scaffold a project, run: npx orchestra-os init" -ForegroundColor Magenta
Write-Host ""
