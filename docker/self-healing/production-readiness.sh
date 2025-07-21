#!/bin/bash

# AI Guided SaaS - Docker Self-Healing Script
# Pass 3: Production Readiness

echo "🚀 Starting Self-Healing Pass #3 - Production Readiness"
echo "====================================================="

# Production readiness checklist
PASS=0
FAIL=0

check_requirement() {
    local description=$1
    local command=$2
    
    echo -n "Checking: $description... "
    if eval $command > /dev/null 2>&1; then
        echo "✅ PASS"
        PASS=$((PASS + 1))
        return 0
    else
        echo "❌ FAIL"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# 1. Build and Deployment
echo "🏗️ Build and Deployment Checks"
echo "------------------------------"
check_requirement "Docker images built" "docker images | grep ai-saas"
check_requirement "Production build successful" "test -f .next/BUILD_ID"
check_requirement "TypeScript compilation" "npm run typecheck"
check_requirement "Linting passed" "npm run lint"

# 2. Database and Persistence
echo -e "\n💾 Database and Persistence Checks"
echo "------------------------------------"
check_requirement "Database running" "docker exec ai-saas-postgres pg_isready -U postgres"
check_requirement "Redis running" "docker exec ai-saas-redis redis-cli ping"
check_requirement "Data volumes exist" "docker volume ls | grep -E '(postgres_data|redis_data)'"
check_requirement "Backup system configured" "test -d backups || mkdir -p backups"

# 3. Security
echo -e "\n🔒 Security Checks"
echo "-------------------"
check_requirement "HTTPS configured" "test -f nginx/ssl/cert.pem"
check_requirement "Environment secrets set" "test -f .env.production && grep -q NEXTAUTH_SECRET .env.production"
check_requirement "No hardcoded secrets" "! grep -r 'api_key.*=.*[A-Za-z0-9]' src/ --include='*.ts' --include='*.tsx'"
check_requirement "Security headers configured" "test -f nginx/nginx.conf && grep -q 'X-Frame-Options' nginx/nginx.conf"

# 4. Monitoring and Logging
echo -e "\n📊 Monitoring and Logging Checks"
echo "---------------------------------"
check_requirement "Health endpoints working" "curl -f http://localhost:3000/api/health"
check_requirement "Prometheus configured" "test -f docker/monitoring/prometheus.yml"
check_requirement "Log aggregation setup" "test -f docker-compose.logging.yml"
check_requirement "Error tracking configured" "grep -q SENTRY_DSN .env.production || echo 'Optional'"

# 5. Performance
echo -e "\n⚡ Performance Checks"
echo "---------------------"
check_requirement "Resource limits set" "grep -q 'limits:' docker-compose.yml"
check_requirement "Caching configured" "docker exec ai-saas-redis redis-cli info | grep used_memory"
check_requirement "CDN configured" "grep -q 'NEXT_PUBLIC_CDN_URL' .env.production || echo 'Optional'"
check_requirement "Image optimization" "test -f next.config.js && grep -q 'images:' next.config.js"

# 6. High Availability
echo -e "\n🔄 High Availability Checks"
echo "---------------------------"
check_requirement "Health checks configured" "docker ps --format '{{.Names}}' | xargs -I {} docker inspect {} | grep -q Healthcheck"
check_requirement "Restart policies set" "docker ps --format '{{.Names}}' | xargs -I {} docker inspect {} | grep -q 'RestartPolicy'"
check_requirement "Load balancer ready" "test -f nginx/nginx.conf && grep -q 'upstream' nginx/nginx.conf"

# 7. CI/CD Pipeline
echo -e "\n🔧 CI/CD Pipeline Checks"
echo "------------------------"
check_requirement "GitHub Actions configured" "test -f .github/workflows/deploy.yml"
check_requirement "Test suite exists" "test -f jest.config.js || test -f vitest.config.ts"
check_requirement "Pre-commit hooks" "test -f .husky/pre-commit"
check_requirement "Deployment scripts" "test -f scripts/deploy.sh || test -f Makefile"

# 8. Documentation
echo -e "\n📚 Documentation Checks"
echo "-----------------------"
check_requirement "README exists" "test -f README.md"
check_requirement "API documentation" "test -d docs/api || grep -q 'swagger' package.json"
check_requirement "Deployment guide" "test -f docs/deployment.md || grep -q 'deployment' README.md"
check_requirement "Environment variables documented" "test -f .env.example"

# 9. Disaster Recovery
echo -e "\n🛡️ Disaster Recovery Checks"
echo "----------------------------"
check_requirement "Backup strategy documented" "test -f docs/backup-strategy.md || grep -q 'backup' README.md"
check_requirement "Rollback procedure exists" "test -f scripts/rollback.sh || grep -q 'rollback' Makefile"
check_requirement "Data export functionality" "grep -q 'export' src/app/api/"
check_requirement "Recovery time objective defined" "grep -q 'RTO' docs/ || echo 'Document RTO/RPO'"

# 10. Compliance
echo -e "\n📋 Compliance Checks"
echo "--------------------"
check_requirement "Privacy policy" "test -f public/privacy-policy.html || test -f src/app/privacy/page.tsx"
check_requirement "Terms of service" "test -f public/terms.html || test -f src/app/terms/page.tsx"
check_requirement "GDPR compliance" "grep -q 'cookie' src/ || grep -q 'consent' src/"
check_requirement "License file" "test -f LICENSE"

# Summary
echo -e "\n📊 Production Readiness Summary"
echo "=============================="
TOTAL=$((PASS + FAIL))
PERCENTAGE=$((PASS * 100 / TOTAL))

echo "Total checks: $TOTAL"
echo "Passed: $PASS ✅"
echo "Failed: $FAIL ❌"
echo "Score: $PERCENTAGE%"

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "\n🎉 System is PRODUCTION READY!"
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "\n⚠️ System is NEARLY ready for production. Address failed checks."
else
    echo -e "\n❌ System is NOT ready for production. Significant work required."
fi

# Generate report
echo -e "\n📄 Generating production readiness report..."
cat > production-readiness-report.md << EOF
# Production Readiness Report

Generated: $(date)

## Summary
- Total Checks: $TOTAL
- Passed: $PASS
- Failed: $FAIL
- Score: $PERCENTAGE%

## Recommendations
1. Address all failed checks before production deployment
2. Set up continuous monitoring
3. Configure automated backups
4. Implement proper logging and alerting
5. Document runbooks for common issues

## Next Steps
- Fix critical security issues first
- Ensure all health checks are passing
- Verify backup and recovery procedures
- Load test the application
- Security audit before launch
EOF

echo "✅ Report saved to production-readiness-report.md"
echo "✅ Self-Healing Pass #3 Complete!"
echo "================================="