@echo off
echo 🚀 Starting MCP Servers...
echo.

REM Check Node version
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the MCP starter
npm run mcp:start

REM Keep window open if script fails
if errorlevel 1 (
    echo.
    echo ❌ MCP startup failed. Check the errors above.
    pause
)