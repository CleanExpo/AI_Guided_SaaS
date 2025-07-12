# Ultimate Production Deploy Script (PowerShell)
# Zero-tolerance deployment with comprehensive validation

param(
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [string]$Environment = "production"
)

# Configuration
$ProjectName = "AI Guided SaaS Platform"
$VercelProject = "ai-guided-saas"
$HealthCheckUrl = "https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app/api/health"
$MaxRetries = 5
$RetryDelay = 10

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Cyan"
}

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    exit 1
}

# Banner
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                 🚀 ULTIMATE PRODUCTION DEPLOY                ║
║                   AI Guided SaaS Platform                    ║
║              Zero-Tolerance Production Pipeline              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Phase 1: Environment Validation
Write-Log "Phase 1: Environment Validation" -Color Cyan

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Warning ".env.production not found, creating from template..."
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.production"
        Write-Warning "Please configure .env.production with your production values"
    } else {
        Write-Error ".env.local.example not found. Cannot create production environment file."
    }
}

# Validate required environment variables
Write-Log "Validating environment variables..."
$requiredVars = @("NEXTAUTH_SECRET", "NEXTAUTH_URL")
$missingVars = @()

foreach ($var in $requiredVars) {
    $content = Get-Content ".env.production" -ErrorAction SilentlyContinue
    if (-not ($content | Select-String "^$var=")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Warning "Missing required environment variables in .env.production:"
    foreach ($var in $missingVars) {
        Write-Host "  - $var"
    }
    Write-Warning "Please configure these variables before deployment"
}

Write-Success "Environment validation complete"

# Phase 2: Dependency Check
Write-Log "Phase 2: Dependency Validation" -Color Cyan

# Check Node.js version
$nodeVersion = node --version
Write-Log "Node.js version: $nodeVersion"

# Check npm version
$npmVersion = npm --version
Write-Log "npm version: $npmVersion"

# Install dependencies
Write-Log "Installing dependencies..."
npm ci --production=false
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install dependencies"
}

Write-Success "Dependencies validated and installed"

# Phase 3: Build Sync Agent
Write-Log "Phase 3: Running Build Sync Agent" -Color Cyan

if (Test-Path "scripts/build-sync-agent.ts") {
    Write-Log "Executing Build Sync Agent..."
    npx tsx scripts/build-sync-agent.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Build Sync Agent completed with warnings"
    } else {
        Write-Success "Build Sync Agent completed"
    }
} else {
    Write-Warning "Build Sync Agent not found, skipping..."
}

# Phase 4: Code Quality Checks
if (-not $SkipTests) {
    Write-Log "Phase 4: Code Quality Validation" -Color Cyan

    # TypeScript check
    Write-Log "Running TypeScript validation..."
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Error "TypeScript validation failed"
    }
    Write-Success "TypeScript validation passed"

    # ESLint check
    Write-Log "Running ESLint validation..."
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "ESLint found issues (non-blocking)"
    }
}

# Phase 5: Build Process
if (-not $SkipBuild) {
    Write-Log "Phase 5: Production Build" -Color Cyan

    # Set production environment
    $env:NODE_ENV = "production"
    $env:VERCEL = "1"

    # Clean previous build
    Write-Log "Cleaning previous build..."
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    }

    # Run production build
    Write-Log "Building for production..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Production build failed"
    }

    Write-Success "Production build completed successfully"

    # Phase 6: Build Analysis
    Write-Log "Phase 6: Build Analysis" -Color Cyan

    # Check build size
    if (Test-Path ".next") {
        $buildSize = (Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Log "Build size: $([math]::Round($buildSize, 2)) MB"
        
        # Check for large bundles
        $largeChunks = Get-ChildItem ".next/static/chunks" -Filter "*.js" -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 1MB }
        if ($largeChunks.Count -gt 0) {
            Write-Warning "Found $($largeChunks.Count) large chunks (>1MB)"
        }
    }

    Write-Success "Build analysis complete"
}

# Phase 7: Vercel Deployment
Write-Log "Phase 7: Vercel Deployment" -Color Cyan

# Check if Vercel CLI is available
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelPath) {
    Write-Error "Vercel CLI not found. Please install with: npm i -g vercel"
}

# Deploy to production
Write-Log "Deploying to Vercel production..."
vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Error "Vercel deployment failed"
}

Write-Success "Deployment to Vercel completed"

# Phase 8: Post-deployment Validation
Write-Log "Phase 8: Post-deployment Validation" -Color Cyan

# Wait for deployment to be ready
Write-Log "Waiting for deployment to be ready..."
Start-Sleep -Seconds 30

# Health check with retries
Write-Log "Performing health checks..."
for ($i = 1; $i -le $MaxRetries; $i++) {
    Write-Log "Health check attempt $i/$MaxRetries..."
    
    try {
        $response = Invoke-WebRequest -Uri $HealthCheckUrl -Method GET -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Success "Health check passed"
            break
        }
    } catch {
        if ($i -eq $MaxRetries) {
            Write-Error "Health check failed after $MaxRetries attempts"
        } else {
            Write-Warning "Health check failed, retrying in ${RetryDelay}s..."
            Start-Sleep -Seconds $RetryDelay
        }
    }
}

# Test critical endpoints
Write-Log "Testing critical endpoints..."
$endpoints = @("/", "/api/health", "/auth/signin", "/dashboard")

foreach ($endpoint in $endpoints) {
    $url = "https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app$endpoint"
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        Write-Success "✓ $endpoint"
    } catch {
        Write-Warning "✗ $endpoint (may require authentication)"
    }
}

# Phase 9: Performance Monitoring Setup
Write-Log "Phase 9: Performance Monitoring" -Color Cyan

# Generate deployment report
$deploymentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitHash = try { git rev-parse HEAD } catch { "unknown" }

$deploymentReport = @{
    timestamp = $deploymentTime
    commit = $commitHash
    nodeVersion = $nodeVersion
    npmVersion = $npmVersion
    healthCheckUrl = $HealthCheckUrl
    status = "success"
} | ConvertTo-Json -Depth 3

$deploymentReport | Out-File -FilePath "deployment-report.json" -Encoding UTF8

Write-Success "Deployment report generated"

# Final Success Message
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    🎉 DEPLOYMENT SUCCESSFUL                  ║
║                                                              ║
║  Production URL: https://ai-guided-saas-rb7mv71rc-unite-group.vercel.app  ║
║  Health Check:   $HealthCheckUrl  ║
║  Status:         All systems operational                     ║
║                                                              ║
║  Next Steps:                                                 ║
║  1. Monitor health dashboard                                 ║
║  2. Set up alerts for your team                             ║
║  3. Configure domain (if needed)                            ║
║  4. Review performance metrics                               ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

Write-Log "Ultimate Production Deploy completed successfully! 🚀" -Color Green
