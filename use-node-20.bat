@echo off
echo Setting Node.js to version 20.19.4...
call nvm use 20.19.4
echo.
echo Current versions:
node -v
npm -v
echo.
echo Node v20 is now active for this session.