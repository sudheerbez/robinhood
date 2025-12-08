# Robinhood Strategies Platform Clone

A comprehensive full-stack investment platform clone built with microservices architecture, demonstrating modern software engineering practices.

## 🎯 Project Overview

This project replicates the core functionality of Robinhood's automated investment strategies platform, featuring:

- **Microservices Architecture**: 4 Java/Spring Boot services + Node.js API Gateway
- **Event-Driven Design**: RabbitMQ for asynchronous communication
- **Modern Frontend**: React + TypeScript + Material-UI
- **Security**: OAuth 2.0 + JWT + RBAC
- **Monitoring**: Prometheus + Grafana dashboards
- **100% Local**: No cloud costs, runs entirely on Docker Compose

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │
┌────────▼────────┐
│  API Gateway    │ (Node.js/Express)
│  (Port 8080)    │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼──┐ ┌─────▼────┐ ┌──▼──┐
│ Auth  │ │Order│ │Strategy  │ │Port-│
│Service│ │Exec │ │Service   │ │folio│
└───┬───┘ └──┬──┘ └─────┬────┘ └──┬──┘
    │        │           │          │
    └────────┴───────────┴──────────┘
                   │
            ┌──────▼──────┐
            │  RabbitMQ   │
            └──────┬──────┘
                   │
         ┌─────────┴─────────┐
    ┌────▼────┐         ┌────▼────┐
    │PostgreSQL│         │  Redis  │
    └─────────┘         └─────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (or Docker + Docker Compose)
- Java 17+ (for local development)
- Node.js 18+ (for local development)
- Maven 3.8+

### Start All Services

```bash
# Clone the repository
git clone <your-repo-url>
cd robinhood-strategies-clone

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Grafana Dashboards**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

## 📦 Services

### Backend Microservices (Java/Spring Boot)

| Service | Port | Description |
|---------|------|-------------|
| Auth Service | 8081 | OAuth 2.0 authentication, user management, RBAC |
| Order Execution Service | 8082 | Order placement, execution, lifecycle management |
| Strategy Service | 8083 | Strategy evaluation, backtesting, recommendations |
| Portfolio Service | 8084 | Portfolio tracking, rebalancing, performance analytics |

### API Gateway (Node.js/Express)

| Port | Description |
|------|-------------|
| 8080 | Unified API endpoint, routing, rate limiting, JWT validation |

### Frontend (React + TypeScript)

| Port | Description |
|------|-------------|
| 3000 | Investor dashboard, strategy marketplace, portfolio management |

### Infrastructure Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Primary database for all services |
| Redis | 6379 | Caching layer for performance optimization |
| RabbitMQ | 5672, 15672 | Message broker + management UI |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Metrics visualization |

## 🔧 Development

### Build Individual Services

```bash
# Java services
cd backend/services/order-execution-service
./mvnw clean package
./mvnw spring-boot:run

# API Gateway
cd backend/services/api-gateway
npm install
npm run dev

# Frontend
cd frontend/investor-dashboard
npm install
npm start
```

### Run Tests

```bash
# Java services
./mvnw test

# Node.js services
npm test

# Frontend
npm test
```

## 📊 Key Features

### Authentication & Authorization
- OAuth 2.0 authorization server
- JWT token-based authentication
- Role-Based Access Control (Admin, Trader, Viewer)
- Secure password hashing with BCrypt

### Order Management
- Market, limit, and stop orders
- Real-time order execution simulation
- Order history and tracking
- Event-driven order lifecycle

### Investment Strategies
- Pre-built strategy templates
- Custom strategy creation
- Backtesting engine
- Performance analytics
- AI-powered recommendations

### Portfolio Management
- Real-time portfolio tracking
- Automatic rebalancing
- Risk assessment
- Performance metrics (ROI, Sharpe ratio, volatility)
- Holdings visualization

### Event-Driven Architecture
- RabbitMQ message broker
- Asynchronous service communication
- Event sourcing patterns
- Reliable message delivery

### Monitoring & Observability
- Prometheus metrics collection
- Grafana dashboards
- Service health checks
- Custom business metrics
- Log aggregation

## 🔐 Security

- OAuth 2.0 + JWT authentication
- Role-Based Access Control (RBAC)
- API rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection

## 📈 Performance Optimizations

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Connection pooling
- Lazy loading in frontend
- Code splitting
- Docker multi-stage builds

## 🧪 Testing

- Unit tests with JUnit 5 (Java)
- Integration tests with TestContainers
- API tests with REST Assured
- Frontend tests with Jest + React Testing Library
- E2E tests with Cypress

## 📚 Technology Stack

**Backend:**
- Java 17, Spring Boot 3.x
- Spring Data JPA, Spring Security
- PostgreSQL, Redis
- RabbitMQ
- Maven

**Frontend:**
- React 18, TypeScript
- Material-UI (MUI) v5
- React Query, Axios
- Recharts

**API Gateway:**
- Node.js 18, Express
- JWT validation
- Rate limiting

**Infrastructure:**
- Docker, Docker Compose
- Prometheus, Grafana
- GitHub Actions

## 🗂️ Project Structure

```
robinhood-strategies-clone/
├── backend/
│   ├── services/
│   │   ├── order-execution-service/
│   │   ├── strategy-service/
│   │   ├── portfolio-service/
│   │   ├── auth-service/
│   │   └── api-gateway/
│   ├── shared/
│   │   └── common-models/
│   └── rabbitmq/
│       └── event-schemas/
├── frontend/
│   └── investor-dashboard/
├── infrastructure/
│   ├── docker/
│   ├── docker-compose.yml
│   └── monitoring/
├── ci-cd/
│   └── .github/workflows/
├── docs/
│   └── architecture/
└── scripts/
    ├── setup/
    └── seed-data/
```

## 🎓 Learning Outcomes

This project demonstrates:

1. **Microservices Architecture** - Service decomposition, inter-service communication
2. **Event-Driven Systems** - RabbitMQ messaging patterns
3. **API Design** - RESTful and GraphQL APIs
4. **Security** - OAuth 2.0, JWT, RBAC
5. **Frontend Development** - Modern React with TypeScript
6. **Performance Optimization** - Caching, query optimization
7. **Containerization** - Docker, Docker Compose
8. **DevOps** - CI/CD, monitoring, logging
9. **Database Design** - Schema design, relationships
10. **Message Brokers** - RabbitMQ exchanges and queues

## 🚀 Deployment

While this project runs locally, the architecture is cloud-ready and can be deployed to:

- **AWS**: ECS, RDS, ElastiCache, Amazon MQ
- **Google Cloud**: GKE, Cloud SQL, Memorystore, Pub/Sub
- **Azure**: AKS, Azure Database, Azure Cache, Service Bus

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🤝 Contributing

This is a learning project, but contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Contact

Built as a comprehensive learning project to understand modern full-stack development practices.

---

**Note**: This is a mock trading platform for educational purposes only. It does not connect to real brokerage accounts or execute real trades.
