@echo off
echo ====================================
echo    Node.js v20 Setup for AI Guided SaaS
echo ====================================
echo.

REM Switch to Node v20
echo [1/5] Switching to Node v20.19.4...
call nvm use 20.19.4

REM Verify version
echo.
echo [2/5] Verifying Node version...
node -v
npm -v

REM Clean old installations
echo.
echo [3/5] Cleaning old node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Update npm
echo.
echo [4/5] Updating npm (may show warnings)...
call npm install -g npm@10.8.3

REM Install dependencies
echo.
echo [5/5] Installing dependencies with Node v20...
call npm install

echo.
echo ====================================
echo    Setup Complete!
echo ====================================
echo.
echo Node v20 is now configured for this project.
echo.
echo IMPORTANT: For each new terminal, run:
echo   nvm use 20.19.4
echo.
echo Or double-click: use-node-20.bat
echo.
pause