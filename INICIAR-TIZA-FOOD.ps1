$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (-not (Test-Path -LiteralPath $node)) { $node = 'node' }
$port = 3000
$stdout = Join-Path $project 'data\server.stdout.log'
$stderr = Join-Path $project 'data\server.stderr.log'
function Test-TizaHealth {
  try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/health" -TimeoutSec 2
    return $response.ok -eq $true -and $response.persistence -eq 'json'
  } catch { return $false }
}
if (Test-TizaHealth) {
  Start-Process "http://localhost:$port"
  exit 0
}
$occupied = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($occupied) { throw "El puerto $port está ocupado por otro programa. Cierra ese programa e intenta de nuevo." }
New-Item -ItemType Directory -Path (Join-Path $project 'data') -Force | Out-Null
$process = Start-Process -FilePath $node -ArgumentList @((Join-Path $project 'server.js')) -WorkingDirectory $project -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 250
  if (Test-TizaHealth) {
    Start-Process "http://localhost:$port"
    exit 0
  }
  if ($process.HasExited) { break }
}
$detail = if (Test-Path -LiteralPath $stderr) { (Get-Content -LiteralPath $stderr -Tail 12) -join [Environment]::NewLine } else { '' }
throw "Tiza Food no pudo iniciar. Revisa data\server.stderr.log.`n$detail"
