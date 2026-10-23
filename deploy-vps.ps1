# deploy-vps.ps1 — Deploy LICHT LUXE NATURALS Frontend to VPS
# Server: 148.66.154.222 | Domain: lichtluxenaturals.org

param(
    [string]$serverUser = "healing",
    [string]$serverIp = "148.66.154.222",
    [string]$keyPath = ""
)

$serverHost = "${serverUser}@${serverIp}"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying LICHT LUXE NATURALS Frontend" -ForegroundColor Cyan
Write-Host " Domain: lichtluxenaturals.org" -ForegroundColor Cyan
Write-Host " Server: $serverHost" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Build React frontend for production
Write-Host "`n1. Building React frontend for production..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "React build failed! Check errors above."
    exit 1
}

# 2. Archive build folder as deploy.zip
Write-Host "`n2. Creating deployment archive deploy.zip..." -ForegroundColor Green
Remove-Item -Force deploy.zip -ErrorAction SilentlyContinue
Compress-Archive -Path build\* -DestinationPath deploy.zip -Force
if (-not (Test-Path "deploy.zip")) {
    Write-Error "Failed to create deploy.zip archive!"
    exit 1
}

# 3. Upload deploy.zip and nginx config to VPS
Write-Host "`n3. Uploading build archive & Nginx config to server..." -ForegroundColor Green
$scpArgs = @("-o", "StrictHostKeyChecking=no")
if ($keyPath -and (Test-Path $keyPath)) {
    $scpArgs += @("-i", $keyPath)
}
$scpFiles = $scpArgs + @("deploy.zip", "nginx-lichtluxenaturals.conf", "${serverHost}:/home/healing/")

& "C:\Windows\System32\OpenSSH\scp.exe" @scpFiles
if ($LASTEXITCODE -ne 0) {
    Remove-Item -Force deploy.zip -ErrorAction SilentlyContinue
    Write-Error "SCP upload failed! Check server connection or password."
    exit 1
}
Remove-Item -Force deploy.zip -ErrorAction SilentlyContinue

# 4. Extract on server, link Nginx, set permissions, reload NGINX
Write-Host "`n4. Extracting frontend, linking Nginx configuration, and reloading..." -ForegroundColor Green
$remoteCommands = "sudo mkdir -p /var/www/lichtluxenaturals; " +
                  "sudo unzip -o /home/healing/deploy.zip -d /var/www/lichtluxenaturals/; " +
                  "sudo cp /home/healing/nginx-lichtluxenaturals.conf /etc/nginx/sites-available/lichtluxenaturals.org 2>/dev/null || sudo cp /home/healing/nginx-lichtluxenaturals.conf /etc/nginx/conf.d/lichtluxenaturals.conf; " +
                  "sudo ln -sf /etc/nginx/sites-available/lichtluxenaturals.org /etc/nginx/sites-enabled/ 2>/dev/null; " +
                  "sudo chown -R www-data:www-data /var/www/lichtluxenaturals 2>/dev/null || sudo chown -R nginx:nginx /var/www/lichtluxenaturals 2>/dev/null; " +
                  "sudo chmod -R 755 /var/www/lichtluxenaturals; " +
                  "sudo nginx -t && sudo systemctl reload nginx; " +
                  "rm -f /home/healing/deploy.zip"

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
