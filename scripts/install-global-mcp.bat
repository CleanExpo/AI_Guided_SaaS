@echo off
echo Installing Global MCP System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Run the setup script
echo Setting up global MCP configuration...
node "%~dp0setup-global-mcp.cjs"

REM Create a global command for MCP
echo.
echo Creating global MCP command...

REM Create mcp.cmd in Windows directory
set "MCP_CMD=%USERPROFILE%\.mcp-global\scripts\mcp.cmd"
(
echo @echo off
echo node "%USERPROFILE%\.mcp-global\agents\mcp-management-agent.js" %%*
) > "%MCP_CMD%"

REM Add to PATH if not already there
echo.
echo Adding MCP to system PATH...
setx PATH "%PATH%;%USERPROFILE%\.mcp-global\scripts" >nul 2>&1

REM Create PowerShell profile if it doesn't exist
echo.
echo Setting up PowerShell integration...
if not exist "%USERPROFILE%\Documents\WindowsPowerShell" (
    mkdir "%USERPROFILE%\Documents\WindowsPowerShell"
)

REM Add to PowerShell profile
powershell -Command "if (!(Test-Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force } ; Add-Content $PROFILE '. ''%USERPROFILE%\.mcp-global\scripts\mcp-init.ps1'''"

REM Create scheduled task for auto-start
echo.
echo Creating auto-start task...
schtasks /create /tn "MCP Global Servers" /xml "%USERPROFILE%\.mcp-global\config\mcp-task.xml" /f >nul 2>&1

REM Install global npm packages
echo.
echo Installing required npm packages globally...
call npm install -g @modelcontextprotocol/server-sequential-thinking @modelcontextprotocol/server-memory @modelcontextprotocol/server-github playwright-mcp eslint-mcp

REM Create desktop shortcut
echo.
echo Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\MCP Manager.lnk'); $Shortcut.TargetPath = 'cmd.exe'; $Shortcut.Arguments = '/k mcp status'; $Shortcut.IconLocation = 'cmd.exe'; $Shortcut.Save()"

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Available commands:
echo   mcp start     - Start all MCP servers
echo   mcp stop      - Stop all MCP servers
echo   mcp status    - Check server status
echo   mcp logs      - View server logs
echo   mcp restart   - Restart all servers
echo.
echo The MCP servers will start automatically:
echo   - When you open a new terminal
echo   - When Windows starts (scheduled task)
echo.
echo Next steps:
echo   1. Restart your terminal or run: mcp start
echo   2. Check status with: mcp status
echo   3. View logs with: mcp logs
echo.
pause