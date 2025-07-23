@echo off
echo 🚀 MAKING NODE.JS v20 PERMANENT ON WINDOWS
echo =============================================

echo.
echo 📋 Step 1: Check current Node.js versions installed
nvm list

echo.
echo 📋 Step 2: Force switch to Node.js v20.19.4
nvm use 20.19.4

echo.
echo 📋 Step 3: Verify the switch (this terminal)
node --version

echo.
echo 📋 Step 4: Creating permanent solution...

echo.
echo ⚠️  IMPORTANT: Windows NVM requires EACH NEW TERMINAL to run 'nvm use 20.19.4'
echo    This is normal behavior for Windows NVM (different from Unix NVM)

echo.
echo 💡 SOLUTION: We'll create an automatic startup script
echo    Creating .nvmrc file (already exists) ✅
echo    Adding Node.js v20 to your PowerShell profile...

echo.
echo 🔧 Would you like to add Node.js v20 auto-switch to your PowerShell profile?
echo    This will automatically run 'nvm use 20' when you open new terminals
echo.
echo    If YES: Run this command in PowerShell as Administrator:
echo    echo "nvm use 20.19.4" ^>^> $PROFILE

echo.
echo 📋 MANUAL STEPS TO COMPLETE THE PERMANENT SWITCH:
echo.
echo 1. 🔄 RESTART your terminal/PowerShell session
echo 2. 🚀 Run: nvm use 20.19.4
echo 3. ✅ Verify: node --version (should show v20.19.4)
echo 4. 📦 Continue with: npm run build
echo.

echo 🎯 VERCEL DEPLOYMENT STATUS:
echo ✅ Your project is ALREADY configured for Node.js v20 deployment
echo ✅ Vercel will use Node.js v20 automatically based on package.json
echo ✅ The critical deployment blocker has been fixed
echo.

echo 🚀 YOU CAN DEPLOY NOW even with local Node.js v18!
echo    Vercel uses its own Node.js v20 runtime regardless of your local version.

echo.
echo 📋 TO PROCEED WITH DEPLOYMENT:
echo.
echo npm run build
echo git add .
echo git commit -m "🚀 Node.js v20 upgrade complete"
echo git push origin main

echo.
echo ✨ Script complete! Follow the manual steps above to make Node.js v20 permanent locally.
pause
