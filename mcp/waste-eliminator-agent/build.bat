@echo off
echo Building Waste Eliminator Agent...
echo.

REM Install dependencies
echo Installing dependencies...
call npm install --legacy-peer-deps

REM Build TypeScript
echo.
echo Compiling TypeScript...
call npm run build

REM Verify build
if exist dist\index.js (
    echo.
    echo ✅ Build successful!
    echo Agent ready at: dist\index.js
) else (
    echo.
    echo ❌ Build failed!
    exit /b 1
)

echo.
echo To start the agent:
echo   - Standalone: npm start
echo   - With MCP: Run the main MCP starter
echo.
pause