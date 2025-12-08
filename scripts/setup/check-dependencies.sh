#!/bin/bash

# Robinhood Strategies - Automated Setup Script
# This script will check for required dependencies and guide you through installation

echo "🔍 Checking system dependencies..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    DOCKER_INSTALLED=true
else
    echo -e "${RED}❌ Docker is not installed${NC}"
    DOCKER_INSTALLED=false
fi

# Check Maven
if command -v mvn &> /dev/null; then
    echo -e "${GREEN}✅ Maven is installed${NC}"
    MAVEN_INSTALLED=true
else
    echo -e "${RED}❌ Maven is not installed${NC}"
    MAVEN_INSTALLED=false
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL is installed${NC}"
    POSTGRES_INSTALLED=true
else
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    POSTGRES_INSTALLED=false
fi

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    echo -e "${GREEN}✅ Java $JAVA_VERSION is installed${NC}"
    JAVA_INSTALLED=true
else
    echo -e "${RED}❌ Java is not installed${NC}"
    JAVA_INSTALLED=false
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION is installed${NC}"
    NODE_INSTALLED=true
else
    echo -e "${RED}❌ Node.js is not installed${NC}"
    NODE_INSTALLED=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Provide recommendations
if [ "$DOCKER_INSTALLED" = true ]; then
    echo -e "${GREEN}🎉 Recommended: Use Docker setup${NC}"
    echo ""
    echo "Run the following commands:"
    echo ""
    echo "  cd $(pwd)"
    echo "  docker compose up -d"
    echo ""
    echo "Then access:"
    echo "  - Auth Service: http://localhost:8081"
    echo "  - RabbitMQ: http://localhost:15672"
    echo "  - Grafana: http://localhost:3001"
    echo ""
elif [ "$MAVEN_INSTALLED" = true ] && [ "$POSTGRES_INSTALLED" = true ]; then
    echo -e "${YELLOW}⚙️  You can run services locally${NC}"
    echo ""
    echo "1. Start PostgreSQL:"
    echo "   brew services start postgresql@15"
    echo ""
    echo "2. Initialize database:"
    echo "   createdb robinhood"
    echo "   psql -d robinhood -f scripts/seed-data/init-db.sql"
    echo ""
    echo "3. Run Auth Service:"
    echo "   cd backend/services/auth-service"
    echo "   mvn spring-boot:run"
    echo ""
else
    echo -e "${YELLOW}📦 Installation Required${NC}"
    echo ""
    echo "Install missing dependencies with Homebrew:"
    echo ""
    
    if [ "$DOCKER_INSTALLED" = false ]; then
        echo "  brew install --cask docker"
    fi
    
    if [ "$MAVEN_INSTALLED" = false ]; then
        echo "  brew install maven"
    fi
    
    if [ "$POSTGRES_INSTALLED" = false ]; then
        echo "  brew install postgresql@15"
    fi
    
    echo ""
    echo "After installation, run this script again."
    echo ""
    echo "For detailed instructions, see:"
    echo "  docs/SETUP_GUIDE.md"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
