# deploy-all.ps1 — Deploy Both Frontend & Backend to VPS
# Server: 148.66.154.222 | Domain: lichtluxenaturals.org

param(
    [string]$serverUser = "healing",
    [string]$serverIp = "148.66.154.222"
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " FULL DEPLOYMENT: LICHT LUXE NATURALS TO VPS" -ForegroundColor Cyan
Write-Host " Domain: https://lichtluxenaturals.org" -ForegroundColor Cyan
Write-Host " Host:   ${serverUser}@${serverIp}" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Deploy Frontend
Write-Host "`n>>> STEP 1: Deploying React Frontend..." -ForegroundColor Yellow
.\deploy-vps.ps1 -serverUser $serverUser -serverIp $serverIp
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend deployment failed! Aborting."
    exit 1
}

# 2. Deploy Backend
Write-Host "`n>>> STEP 2: Deploying Spring Boot Backend..." -ForegroundColor Yellow
.\deploy-backend.ps1 -serverUser $serverUser -serverIp $serverIp
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend deployment failed!"
    exit 1
}

Write-Host "`n🎉 FULL DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "Visit: https://lichtluxenaturals.org" -ForegroundColor Green
