$ssh = "C:\Windows\System32\OpenSSH\ssh.exe"
$scp = "C:\Windows\System32\OpenSSH\scp.exe"
$srv = "healing@148.66.154.222"

Set-Location C:\Users\Sharon\Luxe_Naturals
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed" -ForegroundColor Red; exit 1 }

& $ssh $srv "rm -rf /home/healing/luxe-frontend-new"
if ($LASTEXITCODE -ne 0) { Write-Host "SSH failed. Nothing changed." -ForegroundColor Red; exit 1 }

& $scp -r build "${srv}:/home/healing/luxe-frontend-new"
if ($LASTEXITCODE -ne 0) { Write-Host "Upload failed. Nothing changed." -ForegroundColor Red; exit 1 }

& $ssh -t $srv "test -f /home/healing/luxe-frontend-new/index.html && sudo bash -c 'rm -rf /var/www/lichtluxenaturals/* && cp -r /home/healing/luxe-frontend-new/* /var/www/lichtluxenaturals/ && chown -R www-data:www-data /var/www/lichtluxenaturals' && rm -rf /home/healing/luxe-frontend-new"
if ($LASTEXITCODE -ne 0) { Write-Host "Swap failed." -ForegroundColor Red; exit 1 }

Write-Host "Done. Open https://lichtluxenaturals.org and press Ctrl+Shift+R" -ForegroundColor Green