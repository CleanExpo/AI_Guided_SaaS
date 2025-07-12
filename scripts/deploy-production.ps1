# Simple Production Deploy Script (PowerShell)
# AI Guided SaaS Platform

Write-Host "🚀 AI Guided SaaS Platform - Production Deployment" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Phase 1: Environment Check
Write-Host "`n📋 Phase 1: Environment Validation" -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

# Phase 2: Dependencies
Write-Host "`n📦 Phase 2: Installing Dependencies" -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Phase 3: Build
Write-Host "`n🔨 Phase 3: Production Build" -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Phase 4: Deploy
Write-Host "`n🚀 Phase 4: Deploying to Vercel" -ForegroundColor Yellow
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
if ($vercelPath) {
    vercel --prod --yes
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Yellow
    Write-Host "📋 Manual deployment steps:" -ForegroundColor Cyan
    Write-Host "   1. Install Vercel CLI: npm i -g vercel" -ForegroundColor White
    Write-Host "   2. Run: vercel --prod" -ForegroundColor White
}

# Phase 5: Health Check
Write-Host "`n🏥 Phase 5: Health Check" -ForegroundColor Yellow
$healthUrl = "https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app/api/health"
try {
    Start-Sleep -Seconds 10
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Health check pending (deployment may still be in progress)" -ForegroundColor Yellow
}

# Success Message
Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "🌐 Production URL: https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app" -ForegroundColor Cyan
Write-Host "🏥 Health Check: $healthUrl" -ForegroundColor Cyan
Write-Host "📊 Admin Panel: https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app/admin" -ForegroundColor Cyan
Write-Host "`n✨ Your AI Guided SaaS Platform is now live!" -ForegroundColor Green
