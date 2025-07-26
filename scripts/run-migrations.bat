@echo off
REM Database Migration Runner for Windows
REM This script runs all pending database migrations

echo 🚀 AI Guided SaaS - Database Migration Runner
echo ============================================

REM Load environment variables from .env.local
if exist .env.local (
    for /f "tokens=1,2 delims==" %%a in (.env.local) do (
        if not "%%a"=="" if not "%%b"=="" set %%a=%%b
    )
)

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Installing...
    npm install -g supabase
)

REM Parse command line argument
set ENV=%1
if "%ENV%"=="" set ENV=local

if "%ENV%"=="local" goto :local
if "%ENV%"=="staging" goto :staging
if "%ENV%"=="production" goto :production
if "%ENV%"=="rollback" goto :rollback
goto :usage

:local
echo 🏠 Running LOCAL migrations
supabase start
supabase db push
goto :end

:staging
echo 🔧 Running STAGING migrations
if "%STAGING_DATABASE_URL%"=="" (
    echo ❌ STAGING_DATABASE_URL not found in environment
    exit /b 1
)
echo 🔄 Applying migrations...
supabase db push --db-url "%STAGING_DATABASE_URL%"
goto :end

:production
echo 🚀 Running PRODUCTION migrations
echo.
echo ⚠️  WARNING: You are about to run migrations on PRODUCTION!
echo This action cannot be undone without a backup.
set /p confirm="Are you sure? (type 'yes' to continue): "

if not "%confirm%"=="yes" (
    echo ❌ Migration cancelled
    exit /b 1
)

if "%DATABASE_URL%"=="" (
    echo ❌ DATABASE_URL not found in environment
    exit /b 1
)

REM Create backup directory if it doesn't exist
if not exist backups mkdir backups

REM Create backup
echo 📸 Creating database backup...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ("%TIME%") do (set mytime=%%a%%b)
set timestamp=%mydate%_%mytime%

pg_dump "%DATABASE_URL%" > "backups\prod_backup_%timestamp%.sql"
echo ✅ Backup created: backups\prod_backup_%timestamp%.sql

REM Run migrations
echo 🔄 Applying migrations...
supabase db push --db-url "%DATABASE_URL%"
goto :end

:rollback
echo ⏪ Rolling back last migration
if "%2"=="" (
    echo ❌ Please specify migration version to rollback to
    echo Usage: %0 rollback ^<version^>
    exit /b 1
)
echo 🔄 Rolling back to version: %2
REM Add rollback implementation here
goto :end

:usage
echo Usage: %0 [local^|staging^|production^|rollback]
exit /b 1

:end
echo.
echo ✅ Migration process completed!
echo.

REM Show current schema status
echo 📊 Current Schema Status:
echo ========================

if "%ENV%"=="local" (
    supabase db dump --schema-only | findstr /R "CREATE TABLE CREATE INDEX" | more
) else (
    echo Run 'supabase db remote db list' to see schema info
)

exit /b 0