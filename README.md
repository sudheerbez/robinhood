# Robinhood Strategies Platform Clone

A comprehensive full-stack investment platform clone built with microservices architecture, deploying to AWS Free Tier.

## 🎯 Project Overview

This project replicates the core functionality of Robinhood's automated investment strategies platform, featuring:

- **Microservices Architecture**: Java/Spring Boot services
- **Event-Driven Design**: RabbitMQ for asynchronous communication
- **Modern Frontend**: React + TypeScript + Material-UI + Vite
- **Security**: OAuth 2.0 + JWT + RBAC
- **Cloud Native**: Designed for AWS Deployment (EC2, RDS, S3)
- **Cost Efficient**: Optimized for AWS Free Tier ($0/month)

## 🏗️ Architecture

```
┌─────────────────────────┐
│     AWS Cloud / Local   │
│                         │
│  ┌───────────────────┐  │
│  │ React Frontend    │  │ (S3 / Localhost:5173)
│  └────────┬──────────┘  │
│           │             │
│  ┌────────▼──────────┐  │
│  │ Backend API (EC2) │  │ (Localhost:8081, 8082)
│  └────────┬──────────┘  │
│           │             │
│     ┌─────┴──────┐      │
│     │            │      │
│  ┌──▼───┐    ┌───▼───┐  │
│  │ RDS  │    │ Redis │  │
│  │ (PG) │    │Native │  │
│  └──────┘    └───────┘  │
└─────────────────────────┘
```

## 🚀 Quick Start (Local Development)

### Prerequisites

- Java 21+ (Amazon Corretto recommended)
- Node.js 18+
- Maven 3.8+
- PostgreSQL 15+ (Running locally)
- Redis 6+ (Running locally)

### 1. Setup Infrastructure
Ensure PostgreSQL and Redis are running.
```bash
# MacOS (Homebrew)
brew install postgresql redis
brew services start postgresql
brew services start redis

# Initial DB Setup
createdb robinhood
```

### 2. Start Backend Services
```bash
# Auth Service (Terminal 1)
cd backend/services/auth-service
mvn spring-boot:run

# User Profiling Service (Terminal 2)
cd backend/services/user-profiling-service
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Auth API**: http://localhost:8081
- **Profiling API**: http://localhost:8082

---

## ☁️ AWS Deployment

The project is configured for automated deployment to AWS Free Tier.

### Components
- **Frontend**: Hosted on S3 (Static Website)
- **Backend**: EC2 Instance (t2.micro / t3.micro) running Java JARs
- **Database**: RDS PostgreSQL (db.t3.micro)
- **Cache**: Native Redis on EC2

### Scripts
- `infrastructure/aws/ec2-setup.sh`: Provisions the EC2 instance with Java, Maven, Redis.
- `infrastructure/aws/deploy.sh`: Builds and deploys backend services, supports connection to RDS.
- `infrastructure/aws/deploy-frontend.sh`: Builds and syncs frontend to S3.

### Manual Deployment
```bash
# Connect to EC2
ssh -i key.pem ec2-user@<IP>

# Pull latest code
cd tradewise
git pull

# Run deployment script
./infrastructure/aws/deploy.sh
```

---

## 📦 Services

### Backend Microservices (Java/Spring Boot)

| Service | Port | Description |
|---------|------|-------------|
| Auth Service | 8081 | OAuth 2.0 authentication, user management |
| User Profiling Service | 8082 | Risk assessment, investment profiling |
| Strategy Service | 8083 | Strategy evaluation (Coming Soon) |

### Frontend

| Port | Description |
|------|-------------|
| 5173 | Investor dashboard, strategy marketplace |

---

## 🔧 Development

### Build Services
```bash
# Backend
mvn clean package -DskipTests

# Frontend
cd frontend
npm run build
```

### Run Tests
```bash
# Backend
mvn test

# Frontend
npm test
```

## 📚 Technology Stack

**Backend:**
- Java 21, Spring Boot 3.x
- Spring Data JPA, Spring Security
- PostgreSQL, Redis
- RabbitMQ
- Maven

**Frontend:**
- React 18, TypeScript
- Material-UI (MUI) v5
- Vite
- Axios

**Infrastructure:**
- AWS (EC2, RDS, S3)
- GitHub Actions (CI/CD)
- Shell Scripting

---

## 📝 License
MIT License

## 📧 Contact
Built as a comprehensive learning project to understand modern full-stack development and cloud deployment.
