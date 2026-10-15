# deploy-vps.ps1 — Deploy LICHT LUXE NATURALS Frontend to VPS
# Server: 148.66.154.222 | Domain: lichtluxenaturals.org

param(
    [string]$serverUser = "deploy",
    [string]$serverIp = "148.66.154.222",
    [string]$keyPath = ""  # e.g. "C:\Users\Sharon\Downloads\your-key.pem" if using SSH key
)

$serverHost = "${serverUser}@${serverIp}"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying LICHT LUXE NATURALS Frontend" -ForegroundColor Cyan
Write-Host " Domain: lichtluxenaturals.org" -ForegroundColor Cyan
Write-Host " Server: $serverHost" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Build React frontend for production
Write-Host "`n1. Building React frontend..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "React build failed! Check errors above."
    exit 1
}

# 2. Archive build folder
Write-Host "`n2. Archiving production build..." -ForegroundColor Green
tar -czf build.tar.gz -C build .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create build archive!"
    exit 1
}

# 3. Upload archive to VPS
Write-Host "`n3. Uploading build archive to server..." -ForegroundColor Green
$scpArgs = @("-o", "StrictHostKeyChecking=no")
if ($keyPath -and (Test-Path $keyPath)) {
    $scpArgs += @("-i", $keyPath)
}
$scpArgs += @("build.tar.gz", "${serverHost}:~/build.tar.gz")

& "C:\Windows\System32\OpenSSH\scp.exe" @scpArgs
if ($LASTEXITCODE -ne 0) {
    Remove-Item -Force build.tar.gz -ErrorAction SilentlyContinue
    Write-Error "SCP upload failed! Check server connection, username, or key."
    exit 1
}
Remove-Item -Force build.tar.gz -ErrorAction SilentlyContinue

# 4. Extract on server, set permissions, reload NGINX
Write-Host "`n4. Deploying to /var/www/lichtluxenaturals and reloading NGINX..." -ForegroundColor Green
$remoteCommands = "sudo mkdir -p /var/www/lichtluxenaturals; " +
                  "sudo rm -rf /var/www/lichtluxenaturals/*; " +
                  "sudo tar -xzf ~/build.tar.gz -C /var/www/lichtluxenaturals/; " +
                  "sudo chown -R www-data:www-data /var/www/lichtluxenaturals 2>/dev/null || sudo chown -R nginx:nginx /var/www/lichtluxenaturals 2>/dev/null; " +
                  "sudo chmod -R 755 /var/www/lichtluxenaturals; " +
                  "sudo systemctl reload nginx; " +
                  "rm -f ~/build.tar.gz"

$sshArgs = @("-o", "StrictHostKeyChecking=no")
if ($keyPath -and (Test-Path $keyPath)) {
    $sshArgs += @("-i", $keyPath)
}
$sshArgs += @($serverHost, $remoteCommands)

& "C:\Windows\System32\OpenSSH\ssh.exe" @sshArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✨ Successfully deployed to https://lichtluxenaturals.org!" -ForegroundColor Green
} else {
    Write-Host "`nDeployment completed with warnings. Check Nginx status on VPS." -ForegroundColor Yellow
}
