#!/bin/bash
# Frontend Deployment Script for S3 + CloudFront
# Run this locally or in CI/CD

set -e

# Configuration
S3_BUCKET="${S3_BUCKET:-your-bucket-name}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
API_URL="${API_URL:-http://your-ec2-public-ip:8081}"

echo "========================================="
echo "  Frontend Deployment to AWS"
echo "========================================="

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not installed. Install it first:"
    echo "   brew install awscli (Mac)"
    echo "   pip install awscli (Python)"
    exit 1
fi

# Navigate to frontend
cd frontend

# Update API URL for production
echo "⚙️ Configuring API URL: $API_URL"
cat > src/services/api-config.ts << EOF
// Auto-generated - Production API Configuration
export const API_BASE_URL = '${API_URL}';
EOF

# Build frontend
echo "🔨 Building frontend..."
npm ci
npm run build

# Deploy to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://${S3_BUCKET}/ --delete

# Invalidate CloudFront cache
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*"
fi

echo ""
echo "✅ Frontend deployed!"
echo "   S3 Bucket: s3://${S3_BUCKET}"
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "   CloudFront: https://your-cloudfront-domain.cloudfront.net"
fi
