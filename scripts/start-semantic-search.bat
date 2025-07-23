@echo off
REM Start Semantic Search Services
REM This script launches the Docker containers for semantic search

echo Starting Semantic Search Services...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Navigate to project root
cd /d "%~dp0\.."

REM Stop any existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.semantic.yml down

REM Build and start the services
echo Building and starting semantic search services...
docker-compose -f docker-compose.semantic.yml up -d --build

REM Wait for services to be healthy
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check health status
echo Checking service health...

REM Check Elasticsearch
curl -s http://localhost:9200/_cluster/health 2>nul | findstr /C:"status" >nul
if %errorlevel%==0 (
    echo [OK] Elasticsearch is healthy
) else (
    echo [ERROR] Elasticsearch is not healthy
)

REM Check Embeddings service
curl -s http://localhost:8000/health 2>nul | findstr /C:"healthy" >nul
if %errorlevel%==0 (
    echo [OK] Embeddings service is healthy
) else (
    echo [ERROR] Embeddings service is not healthy
)

REM Check Semantic API
curl -s http://localhost:8080/health 2>nul | findstr /C:"healthy" >nul
if %errorlevel%==0 (
    echo [OK] Semantic API is healthy
) else (
    echo [ERROR] Semantic API is not healthy
)

echo.
echo Semantic Search Services Status:
docker-compose -f docker-compose.semantic.yml ps

echo.
echo Services are available at:
echo   - Embeddings Service: http://localhost:8000
echo   - Elasticsearch: http://localhost:9200
echo   - Semantic API: http://localhost:8080
echo   - Serena MCP Server: http://localhost:9121

echo.
echo To view logs:
echo   docker-compose -f docker-compose.semantic.yml logs -f

echo.
echo To stop services:
echo   docker-compose -f docker-compose.semantic.yml down

pause