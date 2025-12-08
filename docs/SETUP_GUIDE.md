# Local Setup Guide - Robinhood Strategies Platform

## 🚨 Current System Status

**Installed:**
- ✅ Java (JDK 22) - `/Library/Java/JavaVirtualMachines/jdk-22.jdk/Contents/Home/bin/java`
- ✅ Node.js - `/usr/local/bin/node`

**Missing:**
- ❌ Docker / Docker Desktop
- ❌ Maven (mvn)
- ❌ PostgreSQL (psql)

## 📦 Installation Instructions

### Option 1: Full Docker Setup (Recommended)

This is the easiest way to run the entire platform with all services.

#### 1. Install Docker Desktop

```bash
# Download Docker Desktop for Mac
# Visit: https://www.docker.com/products/docker-desktop

# Or install via Homebrew
brew install --cask docker

# After installation, start Docker Desktop from Applications
# Wait for Docker to fully start (you'll see the whale icon in menu bar)
```

#### 2. Verify Docker Installation

```bash
docker --version
docker compose version
```

#### 3. Start All Services

```bash
cd /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f auth-service
```

#### 4. Access the Application

- **Auth Service API**: http://localhost:8081
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

---

### Option 2: Local Development Setup (Without Docker)

If you prefer to run services locally without Docker:

#### 1. Install Required Tools

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Maven
brew install maven

# Install PostgreSQL
brew install postgresql@15

# Install Redis
brew install redis

# Verify installations
mvn --version
psql --version
redis-cli --version
```

#### 2. Start PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb robinhood

# Initialize schema
psql -d robinhood -f /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone/scripts/seed-data/init-db.sql
```

#### 3. Start Redis

```bash
# Start Redis service
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

#### 4. Build and Run Auth Service

```bash
cd /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone/backend/services/auth-service

# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Or run the JAR directly
java -jar target/auth-service-1.0.0.jar
```

#### 5. Test the Auth Service

```bash
# Register a new user
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login with demo user
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "demo123"
  }'
```

---

### Option 3: Quick Demo (Simplified)

For a quick demonstration without full setup:

#### 1. Install Only Essential Tools

```bash
# Install Maven and PostgreSQL
brew install maven postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create and initialize database
createdb robinhood
psql -d robinhood -f /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone/scripts/seed-data/init-db.sql
```

#### 2. Update Auth Service Configuration

Edit `backend/services/auth-service/src/main/resources/application.yml`:

```yaml
spring:
  data:
    redis:
      # Comment out Redis for now (optional dependency)
      # host: localhost
      # port: 6379
```

#### 3. Run Auth Service

```bash
cd /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone/backend/services/auth-service

# Build and run
mvn spring-boot:run
```

---

## 🎯 Recommended Approach

**For Learning & Development:**
→ **Option 1 (Docker)** - Easiest, most complete experience

**For Production-Like Setup:**
→ **Option 2 (Local)** - Full control, better for debugging

**For Quick Testing:**
→ **Option 3 (Simplified)** - Minimal setup, Auth Service only

---

## 🔧 Troubleshooting

### Docker Issues

**Problem:** Docker daemon not running
```bash
# Start Docker Desktop application
open -a Docker

# Wait for Docker to start (check menu bar icon)
```

**Problem:** Port already in use
```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>
```

### PostgreSQL Issues

**Problem:** Connection refused
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql@15
```

**Problem:** Database doesn't exist
```bash
# Create database
createdb robinhood

# Run initialization script
psql -d robinhood -f scripts/seed-data/init-db.sql
```

### Maven Issues

**Problem:** Build fails
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Check Java version (needs Java 17+)
java -version
```

---

## 📝 Next Steps After Setup

1. **Test Auth Service** with the demo user (username: `demo`, password: `demo123`)
2. **Explore the API** using curl or Postman
3. **Check the database** to see the schema and seed data
4. **Build remaining services** (Order, Strategy, Portfolio)
5. **Create the frontend** to interact with the APIs

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs: `docker compose logs -f` or `mvn spring-boot:run`
2. Verify all services are running: `docker compose ps`
3. Check database connection: `psql -d robinhood -U postgres`
4. Test endpoints with curl commands above

---

## 🚀 Quick Start Commands

```bash
# Option 1: Docker (after installing Docker Desktop)
cd /Users/sudheer/.gemini/antigravity/scratch/robinhood-strategies-clone
docker compose up -d postgres redis
docker compose up -d auth-service

# Option 2: Local
brew install maven postgresql@15 redis
brew services start postgresql@15 redis
createdb robinhood
psql -d robinhood -f scripts/seed-data/init-db.sql
cd backend/services/auth-service
mvn spring-boot:run
```

Choose the option that works best for your setup!
