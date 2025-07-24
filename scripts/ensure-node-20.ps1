# PowerShell script to ensure Node v20 is used
$nodeVersion = "20.19.4"

Write-Host "Ensuring Node.js v$nodeVersion is active..." -ForegroundColor Green

# Use nvm to switch to Node v20
& nvm use $nodeVersion

# Verify the version
$currentVersion = & node -v
Write-Host "Current Node version: $currentVersion" -ForegroundColor Yellow

if ($currentVersion -match "v20") {
    Write-Host "✓ Node v20 is active!" -ForegroundColor Green
    
    # Update npm to latest
    Write-Host "Updating npm to latest version..." -ForegroundColor Yellow
    & npm install -g npm@latest
    
    $npmVersion = & npm -v
    Write-Host "NPM version: $npmVersion" -ForegroundColor Yellow
} else {
    Write-Host "✗ Failed to activate Node v20" -ForegroundColor Red
    Write-Host "Please run: nvm install 20.19.4" -ForegroundColor Yellow
}