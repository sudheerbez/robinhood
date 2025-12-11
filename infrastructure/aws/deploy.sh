#!/bin/bash
# TradeWise AWS Deployment Script
# Run this after ec2-setup.sh

set -e

echo "========================================="
echo "  TradeWise Deployment Script"
echo "========================================="

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$DB_HOST" ] || [ "$DB_HOST" == "your-rds-endpoint.region.rds.amazonaws.com" ]; then
    echo "❌ Error: Please configure DB_HOST in .env file"
    exit 1
fi

echo "🗄️ Database: $DB_HOST"

# Start local Redis (since ElastiCache isn't free tier)
echo "🔄 Starting Redis locally..."
docker run -d --name redis -p 6379:6379 redis:7-alpine 2>/dev/null || docker start redis

# Build and run Auth Service
echo "🔨 Building Auth Service..."
cd backend/services/auth-service
mvn clean package -DskipTests -q

echo "🚀 Starting Auth Service..."
nohup java -jar \
    -Dspring.profiles.active=aws \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASSWORD} \
    -Dspring.redis.host=${REDIS_HOST} \
    target/*.jar > /var/log/auth-service.log 2>&1 &
cd ../../..

# Build and run User Profiling Service
echo "🔨 Building User Profiling Service..."
cd backend/services/user-profiling-service
mvn clean package -DskipTests -q

echo "🚀 Starting User Profiling Service..."
nohup java -jar \
    -Dspring.profiles.active=aws \
    -Dserver.port=8082 \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASSWORD} \
    -Dspring.redis.host=${REDIS_HOST} \
    target/*.jar > /var/log/profiling-service.log 2>&1 &
cd ../../..

echo ""
echo "✅ Backend services deployed!"
echo ""
echo "Services running:"
echo "  - Auth Service:      http://localhost:8081"
echo "  - Profiling Service: http://localhost:8082"
echo ""
echo "View logs:"
echo "  - tail -f /var/log/auth-service.log"
echo "  - tail -f /var/log/profiling-service.log"
