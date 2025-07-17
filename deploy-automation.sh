#!/bin/bash

# 🚀 AI Guided SaaS - Automated Deployment Script
# This script automates the complete deployment process with safety checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="AI Guided SaaS"
DOCKER_COMPOSE_DEV="docker-compose.dev.yml"
DOCKER_COMPOSE_PROD="docker-compose.production.yml"
DOCKER_COMPOSE_BYPASS="docker-compose.bypass.yml"

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🚀 $PROJECT_NAME Deployment${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Some features may not work."
    else
        print_success "Node.js is installed"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    print_success "Git is installed"
    
    # Check GitHub CLI
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI is not installed. Some features may not work."
    else
        print_success "GitHub CLI is installed"
    fi
}

check_environment() {
    print_info "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_warning ".env file not found. Copying from .env.example..."
            cp .env.example .env
            print_warning "Please configure your .env file with actual values before proceeding."
            read -p "Press Enter after configuring .env file..."
        else
            print_error ".env.example file not found. Cannot create .env file."
            exit 1
        fi
    fi
    print_success "Environment file exists"
    
    # Check critical environment variables
    source .env
    
    critical_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "ANTHROPIC_API_KEY")
    missing_vars=()
    
    for var in "${critical_vars[@]}"; do
        if [ -z "${!var}" ] || [[ "${!var}" == *"your_"* ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing or unconfigured environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please configure these variables in your .env file"
        exit 1
    fi
    
    print_success "Critical environment variables are configured"
}

cleanup_docker() {
    print_info "Cleaning up Docker resources..."
    
    # Stop existing containers
    docker-compose down 2>/dev/null || true
    docker-compose -f $DOCKER_COMPOSE_DEV down 2>/dev/null || true
    docker-compose -f $DOCKER_COMPOSE_PROD down 2>/dev/null || true
    docker-compose -f $DOCKER_COMPOSE_BYPASS down 2>/dev/null || true
    
    # Remove unused containers, networks, images
    docker system prune -f
    
    print_success "Docker cleanup completed"
}

build_images() {
    print_info "Building Docker images..."
    
    case $1 in
        "dev")
            docker-compose -f $DOCKER_COMPOSE_DEV build --no-cache
            ;;
        "prod")
            docker-compose -f $DOCKER_COMPOSE_PROD build --no-cache
            ;;
        "bypass")
            docker-compose -f $DOCKER_COMPOSE_BYPASS build --no-cache
            ;;
        *)
            docker-compose build --no-cache
            ;;
    esac
    
    print_success "Docker images built successfully"
}

deploy_services() {
    local mode=$1
    print_info "Deploying services in $mode mode..."
    
    case $mode in
        "dev")
            docker-compose -f $DOCKER_COMPOSE_DEV up -d
            ;;
        "prod")
            docker-compose -f $DOCKER_COMPOSE_PROD up -d
            ;;
        "bypass")
            docker-compose -f $DOCKER_COMPOSE_BYPASS up -d
            ;;
        *)
            docker-compose up -d
            ;;
    esac
    
    print_success "Services deployed successfully"
}

health_check() {
    print_info "Performing health checks..."
    
    # Wait for services to start
    sleep 10
    
    # Check if containers are running
    if [ "$(docker ps -q)" ]; then
        print_success "Docker containers are running"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_error "No Docker containers are running"
        return 1
    fi
    
    # Check application health endpoint (if available)
    if curl -f http://localhost:3000/api/health &>/dev/null; then
        print_success "Application health check passed"
    else
        print_warning "Application health check failed or endpoint not available"
    fi
    
    # Check database connection (if available)
    if curl -f http://localhost:3000/api/health/db &>/dev/null; then
        print_success "Database health check passed"
    else
        print_warning "Database health check failed or endpoint not available"
    fi
}

run_tests() {
    print_info "Running tests..."
    
    if [ -f "package.json" ]; then
        if npm list --depth=0 | grep -q "jest\|vitest\|playwright"; then
            npm test 2>/dev/null || print_warning "Some tests failed"
            print_success "Test suite completed"
        else
            print_warning "No test framework detected"
        fi
    else
        print_warning "No package.json found, skipping tests"
    fi
}

show_deployment_info() {
    print_info "Deployment Information:"
    echo ""
    echo "🌐 Application URLs:"
    echo "  - Main Application: http://localhost:3000"
    echo "  - API Health: http://localhost:3000/api/health"
    echo "  - Database Health: http://localhost:3000/api/health/db"
    echo ""
    echo "🐳 Docker Commands:"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop services: docker-compose down"
    echo "  - Restart services: docker-compose restart"
    echo ""
    echo "📊 Monitoring:"
    echo "  - Container status: docker ps"
    echo "  - Resource usage: docker stats"
    echo "  - Service logs: docker-compose logs [service-name]"
    echo ""
}

backup_data() {
    print_info "Creating backup..."
    
    backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup environment file
    cp .env "$backup_dir/.env.backup" 2>/dev/null || true
    
    # Backup database (if using local database)
    if [ -f "database.sqlite" ]; then
        cp database.sqlite "$backup_dir/database.sqlite.backup"
    fi
    
    # Backup configuration files
    cp *.json "$backup_dir/" 2>/dev/null || true
    cp *.yml "$backup_dir/" 2>/dev/null || true
    cp *.yaml "$backup_dir/" 2>/dev/null || true
    
    print_success "Backup created in $backup_dir"
}

show_menu() {
    echo ""
    echo "Select deployment mode:"
    echo "1) Development (with hot reload)"
    echo "2) Production (optimized)"
    echo "3) Bypass (quick testing)"
    echo "4) Custom Docker Compose file"
    echo "5) Run tests only"
    echo "6) Health check only"
    echo "7) Cleanup and exit"
    echo "8) Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
}

main() {
    print_header
    
    # Check prerequisites
    check_prerequisites
    
    # Show menu
    show_menu
    
    case $choice in
        1)
            check_environment
            cleanup_docker
            build_images "dev"
            deploy_services "dev"
            health_check
            run_tests
            show_deployment_info
            ;;
        2)
            check_environment
            backup_data
            cleanup_docker
            build_images "prod"
            deploy_services "prod"
            health_check
            run_tests
            show_deployment_info
            ;;
        3)
            check_environment
            cleanup_docker
            build_images "bypass"
            deploy_services "bypass"
            health_check
            show_deployment_info
            ;;
        4)
            read -p "Enter Docker Compose file path: " compose_file
            if [ -f "$compose_file" ]; then
                check_environment
                cleanup_docker
                docker-compose -f "$compose_file" build --no-cache
                docker-compose -f "$compose_file" up -d
                health_check
                show_deployment_info
            else
                print_error "Docker Compose file not found: $compose_file"
            fi
            ;;
        5)
            run_tests
            ;;
        6)
            health_check
            ;;
        7)
            cleanup_docker
            print_success "Cleanup completed"
            ;;
        8)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please select 1-8."
            main
            ;;
    esac
    
    echo ""
    print_success "Deployment process completed!"
    print_info "Check the logs with: docker-compose logs -f"
    print_info "Stop services with: docker-compose down"
}

# Handle script interruption
trap 'print_warning "Script interrupted. Cleaning up..."; cleanup_docker; exit 1' INT TERM

# Run main function
main
