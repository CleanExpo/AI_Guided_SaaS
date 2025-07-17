# WSL Ubuntu Environment Setup Script for Sequential Thinking MCP
# This script configures the WSL Ubuntu environment for optimal deployment workflows

param(
    [string]$ProjectName = "AI_Guided_SaaS",
    [string]$WSLDistro = "Ubuntu",
    [switch]$InstallDependencies = $false,
    [switch]$ConfigureGit = $false,
    [switch]$SetupMCP = $false
)

Write-Host "🚀 WSL Ubuntu Environment Setup for Sequential Thinking MCP" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Function to execute WSL commands with error handling
function Invoke-WSLCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host "📋 $Description..." -ForegroundColor Yellow
    try {
        $result = wsl -d $WSLDistro -e bash -c $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Description completed successfully" -ForegroundColor Green
            return $result
        } else {
            Write-Host "❌ $Description failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "❌ Error executing $Description`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Verify WSL Installation and Distribution
Write-Host "`n🔍 Step 1: Verifying WSL Installation" -ForegroundColor Cyan
$wslList = wsl -l -v
if ($wslList -match $WSLDistro) {
    Write-Host "✅ WSL $WSLDistro distribution found" -ForegroundColor Green
} else {
    Write-Host "❌ WSL $WSLDistro distribution not found. Please install it first." -ForegroundColor Red
    exit 1
}

# 2. Create Project Directory Structure in WSL
Write-Host "`n📁 Step 2: Setting up Project Directory Structure" -ForegroundColor Cyan
$projectPath = "/home/`$USER/projects/$ProjectName"
Invoke-WSLCommand "mkdir -p $projectPath" "Creating project directory"
Invoke-WSLCommand "mkdir -p $projectPath/.mcp" "Creating MCP directory"
Invoke-WSLCommand "mkdir -p $projectPath/logs" "Creating logs directory"
Invoke-WSLCommand "mkdir -p $projectPath/scripts" "Creating scripts directory"

# 3. Configure Environment Variables
Write-Host "`n🔧 Step 3: Configuring Environment Variables" -ForegroundColor Cyan
$envConfig = @"
# WSL Ubuntu Environment Configuration for Sequential Thinking MCP
export WSL_DISTRO_NAME='$WSLDistro'
export WINDOWS_USER_PROFILE='/mnt/c/Users/$env:USERNAME'
export PROJECT_ROOT='$projectPath'
export MCP_SERVER_PATH='$projectPath/.mcp'
export NODE_ENV='development'
export ENABLE_THINKING_LOGS='true'
export WSL_INTEROP_ENABLED='true'

# Path additions
export PATH="`$PATH:`$PROJECT_ROOT/scripts:`$PROJECT_ROOT/.mcp"

# Aliases for common operations
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Project-specific aliases
alias cdproject='cd `$PROJECT_ROOT'
alias mcpstart='node `$MCP_SERVER_PATH/wsl-sequential-thinking-server.js'
alias mcpbuild='cd `$MCP_SERVER_PATH && npm run build'
alias syncwin='rsync -av --exclude=node_modules --exclude=.git `$PROJECT_ROOT/ /mnt/d/AI\ Guided\ SaaS/'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'
"@

$envConfig | Out-File -FilePath "temp_bashrc_addition" -Encoding UTF8
wsl -d $WSLDistro -e bash -c "cat /mnt/c/Users/$env:USERNAME/temp_bashrc_addition >> ~/.bashrc"
Remove-Item "temp_bashrc_addition"
Write-Host "✅ Environment variables configured in ~/.bashrc" -ForegroundColor Green

# 4. Install Dependencies (if requested)
if ($InstallDependencies) {
    Write-Host "`n📦 Step 4: Installing Dependencies" -ForegroundColor Cyan
    
    # Update package lists
    Invoke-WSLCommand "sudo apt update" "Updating package lists"
    
    # Install Node.js and npm
    Invoke-WSLCommand "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -" "Adding Node.js repository"
    Invoke-WSLCommand "sudo apt-get install -y nodejs" "Installing Node.js"
    
    # Install additional tools
    Invoke-WSLCommand "sudo apt-get install -y git curl wget rsync build-essential" "Installing development tools"
    
    # Verify installations
    Invoke-WSLCommand "node --version" "Verifying Node.js installation"
    Invoke-WSLCommand "npm --version" "Verifying npm installation"
    Invoke-WSLCommand "git --version" "Verifying Git installation"
}

# 5. Configure Git (if requested)
if ($ConfigureGit) {
    Write-Host "`n🔧 Step 5: Configuring Git" -ForegroundColor Cyan
    
    # Get Git configuration from Windows
    $gitUserName = git config --global user.name
    $gitUserEmail = git config --global user.email
    
    if ($gitUserName -and $gitUserEmail) {
        Invoke-WSLCommand "git config --global user.name '$gitUserName'" "Setting Git username"
        Invoke-WSLCommand "git config --global user.email '$gitUserEmail'" "Setting Git email"
        Invoke-WSLCommand "git config --global init.defaultBranch main" "Setting default branch to main"
        Invoke-WSLCommand "git config --global core.autocrlf input" "Configuring line endings for WSL"
        Write-Host "✅ Git configured with Windows credentials" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Git credentials not found in Windows. Please configure manually." -ForegroundColor Yellow
    }
}

# 6. Setup MCP Server (if requested)
if ($SetupMCP) {
    Write-Host "`n🤖 Step 6: Setting up MCP Server" -ForegroundColor Cyan
    
    # Copy MCP server files to WSL
    $mcpSourcePath = "d:\AI Guided SaaS\mcp"
    $mcpDestPath = "$projectPath/.mcp"
    
    if (Test-Path $mcpSourcePath) {
        Invoke-WSLCommand "cp -r /mnt/d/AI\ Guided\ SaaS/mcp/* $mcpDestPath/" "Copying MCP server files"
        Invoke-WSLCommand "cd $mcpDestPath && npm install" "Installing MCP dependencies"
        Invoke-WSLCommand "cd $mcpDestPath && npm run build" "Building MCP server"
        
        # Create MCP configuration
        $mcpConfig = @"
{
  "mcpServers": {
    "wsl-sequential-thinking": {
      "command": "node",
      "args": ["$mcpDestPath/dist/wsl-sequential-thinking-server.js"],
      "env": {
        "NODE_ENV": "development",
        "WSL_DISTRO_NAME": "$WSLDistro",
        "ENABLE_THINKING_LOGS": "true",
        "PROJECT_ROOT": "$projectPath"
      }
    }
  }
}
"@
        $mcpConfig | Out-File -FilePath "temp_mcp_config.json" -Encoding UTF8
        wsl -d $WSLDistro -e bash -c "cp /mnt/c/Users/$env:USERNAME/temp_mcp_config.json ~/.config/claude-cli/mcp-servers.json"
        Remove-Item "temp_mcp_config.json"
        
        Write-Host "✅ MCP server configured and ready" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MCP source files not found at $mcpSourcePath" -ForegroundColor Yellow
    }
}

# 7. Create Sync Scripts
Write-Host "`n🔄 Step 7: Creating Synchronization Scripts" -ForegroundColor Cyan

# WSL to Windows sync script
$wslToWindowsScript = @"
#!/bin/bash
# WSL to Windows synchronization script
echo "🔄 Syncing from WSL to Windows..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' \
    "$projectPath/" "/mnt/d/AI Guided SaaS/"
echo "✅ Sync completed successfully"
"@

$wslToWindowsScript | Out-File -FilePath "temp_sync_script.sh" -Encoding UTF8
wsl -d $WSLDistro -e bash -c "cp /mnt/c/Users/$env:USERNAME/temp_sync_script.sh $projectPath/scripts/sync-to-windows.sh && chmod +x $projectPath/scripts/sync-to-windows.sh"
Remove-Item "temp_sync_script.sh"

# Windows to WSL sync script
$windowsToWSLScript = @"
#!/bin/bash
# Windows to WSL synchronization script
echo "🔄 Syncing from Windows to WSL..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' \
    "/mnt/d/AI Guided SaaS/" "$projectPath/"
echo "✅ Sync completed successfully"
"@

$windowsToWSLScript | Out-File -FilePath "temp_sync_script2.sh" -Encoding UTF8
wsl -d $WSLDistro -e bash -c "cp /mnt/c/Users/$env:USERNAME/temp_sync_script2.sh $projectPath/scripts/sync-from-windows.sh && chmod +x $projectPath/scripts/sync-from-windows.sh"
Remove-Item "temp_sync_script2.sh"

Write-Host "✅ Synchronization scripts created" -ForegroundColor Green

# 8. Create Sequential Thinking Test Script
Write-Host "`n🧠 Step 8: Creating Sequential Thinking Test Script" -ForegroundColor Cyan

$testScript = @"
#!/bin/bash
# Sequential Thinking MCP Test Script
echo "🧠 Testing Sequential Thinking MCP Server..."

# Test WSL environment validation
echo "📋 Testing WSL environment validation..."
node $mcpDestPath/dist/wsl-sequential-thinking-server.js --test validate-wsl-environment

# Test Git status analysis
echo "📋 Testing Git status analysis..."
node $mcpDestPath/dist/wsl-sequential-thinking-server.js --test analyze-git-status

# Test file synchronization
echo "📋 Testing file synchronization..."
node $mcpDestPath/dist/wsl-sequential-thinking-server.js --test sync-wsl-windows --dry-run

echo "✅ Sequential Thinking MCP tests completed"
"@

$testScript | Out-File -FilePath "temp_test_script.sh" -Encoding UTF8
wsl -d $WSLDistro -e bash -c "cp /mnt/c/Users/$env:USERNAME/temp_test_script.sh $projectPath/scripts/test-mcp.sh && chmod +x $projectPath/scripts/test-mcp.sh"
Remove-Item "temp_test_script.sh"

Write-Host "✅ Test script created" -ForegroundColor Green

# 9. Final Verification
Write-Host "`n✅ Step 9: Final Verification" -ForegroundColor Cyan

Write-Host "`n📊 Environment Summary:" -ForegroundColor White
Write-Host "  • WSL Distribution: $WSLDistro" -ForegroundColor Gray
Write-Host "  • Project Path: $projectPath" -ForegroundColor Gray
Write-Host "  • MCP Server Path: $projectPath/.mcp" -ForegroundColor Gray
Write-Host "  • Sync Scripts: $projectPath/scripts/" -ForegroundColor Gray

# Test basic functionality
$testResult = Invoke-WSLCommand "cd $projectPath && pwd && ls -la" "Testing project directory access"
if ($testResult) {
    Write-Host "✅ WSL environment setup completed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Setup completed with some issues. Please check manually." -ForegroundColor Yellow
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor White
Write-Host "  1. Restart your WSL session to load new environment variables" -ForegroundColor Gray
Write-Host "  2. Run: wsl -d $WSLDistro" -ForegroundColor Gray
Write-Host "  3. Test MCP server: ~/projects/$ProjectName/scripts/test-mcp.sh" -ForegroundColor Gray
Write-Host "  4. Start development: cdproject && mcpstart" -ForegroundColor Gray

Write-Host "`n🚀 WSL Ubuntu Environment Setup Complete!" -ForegroundColor Green
