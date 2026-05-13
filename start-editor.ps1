$port = 4174
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$healthy = $false
try {
  $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$port/__health" -TimeoutSec 1
  $healthy = $response.Content -match "map-editor-save-server-v6"
} catch {
  $healthy = $false
}

if (-not $healthy) {
  $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  $owners = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($owner in $owners) {
    if ($owner) {
      Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue
    }
  }

  Start-Process -FilePath python -ArgumentList @("editor-server.py", "$port") -WorkingDirectory $root -WindowStyle Hidden
  Start-Sleep -Seconds 1
}

Start-Process "http://127.0.0.1:$port/map-editor.html"
