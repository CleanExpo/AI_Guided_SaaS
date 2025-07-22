#!/bin/bash

echo "🚀 AGENT-OS DEPLOYMENT VALIDATION"
echo "=================================="

echo "📋 Running pre-deployment checks..."

echo "1️⃣  Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "2️⃣  Type checking..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

echo "3️⃣  Linting code..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint check failed"
    exit 1
fi

echo "✅ All pre-deployment checks passed!"
echo "🚀 Ready for production deployment"
