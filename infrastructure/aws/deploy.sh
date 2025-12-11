#!/bin/bash
# TradeWise AWS Deployment Script
# Run this after ec2-setup.sh

set -e

echo "========================================="
echo "  TradeWise Deployment Script"
echo "========================================="

# Default configuration (PostgreSQL runs locally in Docker)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-robinhood}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
REDIS_HOST="${REDIS_HOST:-localhost}"

# Load environment variables from .env if exists (overrides defaults)
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🗄️ Database: $DB_HOST:$DB_PORT/$DB_NAME"

# Check if using RDS or Local Docker
if [[ "$DB_HOST" == *"rds.amazonaws.com"* ]]; then
    echo "☁️ Using RDS Database (skipping local Docker)..."
    # Optional: Stop local Docker containers to save resources
    docker stop postgres redis 2>/dev/null || true
else
    # Ensure Docker containers are running for local setup
    echo "🐳 Starting Docker containers..."
    docker start postgres 2>/dev/null || docker run -d --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=robinhood -p 5432:5432 postgres:15-alpine
fi

# Ensure Redis is running (native or docker)
if [[ "$REDIS_HOST" == "localhost" ]]; then
    # Check if native redis is running
    if systemctl is-active --quiet redis6; then
        echo "✅ Native Redis is running."
    elif systemctl is-active --quiet redis; then
        echo "✅ Native Redis is running."
    elif [[ "$DB_HOST" != *"rds.amazonaws.com"* ]]; then
        # Fallback to Docker only if not using RDS (assuming full local setup) or if explicitly desired
        echo "🐳 Starting Docker Redis..."
        docker start redis 2>/dev/null || docker run -d --name redis -p 6379:6379 redis:7-alpine
    else
        echo "⚠️ Warning: Redis service not found running natively. Ensure it is installed."
    fi
fi


# Kill existing Java processes
echo "🔄 Stopping existing services..."
pkill -f "auth-service" 2>/dev/null || true
pkill -f "user-profiling-service" 2>/dev/null || true
sleep 2

# Build and run Auth Service
echo "🔨 Building Auth Service..."
cd backend/services/auth-service
mvn package -DskipTests -q

echo "🚀 Starting Auth Service with Auto-Schema Creation..."
nohup java -jar \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASSWORD} \
    -Dspring.redis.host=${REDIS_HOST} \
    -Dspring.jpa.hibernate.ddl-auto=update \
    -Dspring.jpa.properties.hibernate.hbm2ddl.create_namespaces=true \
    target/*.jar > /tmp/auth-service.log 2>&1 &
cd ../../..

# Build and run User Profiling Service
echo "🔨 Building User Profiling Service..."
cd backend/services/user-profiling-service
mvn package -DskipTests -q

echo "🚀 Starting User Profiling Service with Auto-Schema Creation..."
nohup java -jar \
    -Dserver.port=8082 \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASSWORD} \
    -Dspring.redis.host=${REDIS_HOST} \
    -Dspring.jpa.hibernate.ddl-auto=update \
    -Dspring.jpa.properties.hibernate.hbm2ddl.create_namespaces=true \
    target/*.jar > /tmp/profiling-service.log 2>&1 &
cd ../../..

echo ""
echo "✅ Backend services deployed!"
echo ""
echo "Services running:"
echo "  - Auth Service:      http://localhost:8081"
echo "  - Profiling Service: http://localhost:8082"
echo ""
echo "View logs:"
echo "  - tail -f /tmp/auth-service.log"
echo "  - tail -f /tmp/profiling-service.log"
