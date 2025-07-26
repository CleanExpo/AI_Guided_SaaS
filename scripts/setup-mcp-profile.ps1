# Setup MCP PowerShell Profile
# This script sets up the PowerShell profile to automatically load MCP

$ErrorActionPreference = "Continue"

Write-Host "🔧 Setting up MCP PowerShell profile..." -ForegroundColor Cyan

# Get PowerShell profile path
$profilePath = $PROFILE.CurrentUserAllHosts
$profileDir = Split-Path $profilePath -Parent

# Create profile directory if it doesn't exist
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    Write-Host "✅ Created PowerShell profile directory" -ForegroundColor Green
}

# Create or update the profile
$mcpInitPath = "$env:USERPROFILE\.mcp-global\scripts\mcp-init.ps1"

# Check if profile exists
if (Test-Path $profilePath) {
    $profileContent = Get-Content $profilePath -Raw
    
    # Check if MCP init is already in profile
    if ($profileContent -notlike "*mcp-init.ps1*") {
        # Add MCP initialization to existing profile
        $mcpInit = @"

# MCP (Model Context Protocol) Initialization
if (Test-Path "$mcpInitPath") {
    . "$mcpInitPath"
} else {
    Write-Host "MCP not found. Run setup-mcp-profile.ps1 to install." -ForegroundColor Yellow
}
"@
        
        Add-Content -Path $profilePath -Value $mcpInit
        Write-Host "✅ Added MCP to existing PowerShell profile" -ForegroundColor Green
    } else {
        Write-Host "✅ MCP already configured in PowerShell profile" -ForegroundColor Green
    }
} else {
    # Create new profile with MCP initialization
    $profileContent = @"
# PowerShell Profile
# This file is loaded every time PowerShell starts

# MCP (Model Context Protocol) Initialization
if (Test-Path "$mcpInitPath") {
    . "$mcpInitPath"
} else {
    Write-Host "MCP not found. Run setup-mcp-profile.ps1 to install." -ForegroundColor Yellow
}

# Welcome message
Write-Host "🚀 PowerShell Profile Loaded - MCP Ready" -ForegroundColor Cyan
"@
    
    Set-Content -Path $profilePath -Value $profileContent -Force
    Write-Host "✅ Created new PowerShell profile with MCP" -ForegroundColor Green
}

# Set execution policy for current user
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force -ErrorAction Stop
    Write-Host "✅ Set execution policy to RemoteSigned for current user" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set execution policy (may require admin rights)" -ForegroundColor Yellow
    Write-Host "   Run as Administrator: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force" -ForegroundColor Yellow
}

Write-Host "`n📋 Profile setup complete!" -ForegroundColor Green
Write-Host "   Profile location: $profilePath" -ForegroundColor Cyan
Write-Host "   MCP init script: $mcpInitPath" -ForegroundColor Cyan

Write-Host "`n🔄 To apply changes:" -ForegroundColor Yellow
Write-Host "   1. Close and reopen PowerShell, or" -ForegroundColor White
Write-Host "   2. Run: . `$PROFILE" -ForegroundColor White

Write-Host "`n💡 MCP Commands:" -ForegroundColor Yellow
Write-Host "   mcp-status (or mcps) - Check running MCP servers" -ForegroundColor White
Write-Host "   mcp-restart (or mcpr) - Restart MCP servers" -ForegroundColor White
Write-Host "   mcp-logs (or mcpl) - View MCP logs" -ForegroundColor White