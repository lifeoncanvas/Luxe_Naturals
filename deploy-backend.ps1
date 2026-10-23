# deploy-backend.ps1 — Deploy LICHT LUXE NATURALS Spring Boot Backend to VPS
# Server: 148.66.154.222 | Domain: lichtluxenaturals.org

param(
    [string]$serverUser = "healing",
    [string]$serverIp = "148.66.154.222"
)

$serverHost = "${serverUser}@${serverIp}"
$backendDir = "c:\Users\Sharon\IdeaProjects\luxe_naturals_backend"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying LICHT LUXE NATURALS Backend" -ForegroundColor Cyan
Write-Host " Server: $serverHost" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Package backend JAR
Write-Host "`n1. Packaging Spring Boot JAR (skipping tests)..." -ForegroundColor Green
Push-Location $backendDir
mvn clean package -DskipTests
Pop-Location

$jarPath = "$backendDir\target\luxe-naturals-backend-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path $jarPath)) {
    Write-Error "Build failed! JAR not found at $jarPath."
    exit 1
}

# 2. Upload JAR to VPS
Write-Host "`n2. Uploading JAR to server 148.66.154.222..." -ForegroundColor Green
& "C:\Windows\System32\OpenSSH\scp.exe" -o StrictHostKeyChecking=no $jarPath "${serverHost}:/home/healing/luxe-naturals-backend.jar"
if ($LASTEXITCODE -ne 0) {
    Write-Error "SCP upload failed! Check password or connection."
    exit 1
}

# 3. Create or restart systemd service on VPS
Write-Host "`n3. Configuring & restarting luxe-naturals service on server..." -ForegroundColor Green
$serviceContent = @"
[Unit]
Description=LICHT LUXE NATURALS Backend API
After=network.target

[Service]
User=healing
ExecStart=/usr/bin/java -Dserver.port=9090 -jar /home/healing/luxe-naturals-backend.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"@

$remoteScript = "echo '$serviceContent' | sudo tee /etc/systemd/system/luxe-naturals.service > /dev/null && " +
                "sudo systemctl daemon-reload && " +
                "sudo systemctl enable luxe-naturals.service && " +
                "sudo systemctl restart luxe-naturals.service && " +
                "sleep 3 && " +
                "sudo systemctl status luxe-naturals.service --no-pager"

& "C:\Windows\System32\OpenSSH\ssh.exe" -o StrictHostKeyChecking=no $serverHost $remoteScript

Write-Host "`n✨ BACKEND DEPLOYMENT COMPLETE! API running live on https://lichtluxenaturals.org/api/" -ForegroundColor Green
