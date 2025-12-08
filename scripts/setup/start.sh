#!/bin/bash

# Robinhood Strategies Platform - Quick Start Script

echo "🚀 Starting Robinhood Strategies Platform..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ docker-compose is available"
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📦 Building and starting all services..."
echo "This may take a few minutes on first run..."
echo ""

# Start all services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✨ Robinhood Strategies Platform is starting up!"
echo ""
echo "📍 Access Points:"
echo "   Frontend Dashboard:    http://localhost:3000"
echo "   API Gateway:           http://localhost:8080"
echo "   Auth Service:          http://localhost:8081"
echo "   Order Service:         http://localhost:8082"
echo "   Strategy Service:      http://localhost:8083"
echo "   Portfolio Service:     http://localhost:8084"
echo "   RabbitMQ Management:   http://localhost:15672 (guest/guest)"
echo "   Grafana Dashboards:    http://localhost:3001 (admin/admin)"
echo "   Prometheus:            http://localhost:9090"
echo ""
echo "📝 Demo Credentials:"
echo "   Username: demo"
echo "   Password: demo123"
echo ""
echo "🔍 View logs: docker-compose logs -f [service-name]"
echo "🛑 Stop all:  docker-compose down"
echo ""
