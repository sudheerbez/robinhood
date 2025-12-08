# User Profiling Service - Java/Spring Boot

## ✅ Complete Migration from Python to Java!

### Overview
User profiling service for Robo-Advisor built with Java 17 and Spring Boot 3.2.0.

### Features
- **Quick Risk Assessment** - Fast onboarding with 6-field assessment
- **Risk Scoring Algorithm** - Calculates risk score (1-100) based on multiple factors
- **Strategy Recommendations** - Personalized investment strategy suggestions
- **RESTful API** - Complete REST API with CORS support

### Technology Stack
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Redis (caching)
- Lombok
- Maven

### API Endpoints

#### Health Check
```http
GET /api/v1/profiling/health
```

#### Quick Risk Assessment
```http
POST /api/v1/profiling/quick-assessment
Content-Type: application/json

{
  "age": 35,
  "investmentAmount": 50000,
  "investmentGoal": "RETIREMENT",
  "timeHorizonYears": 30,
  "lossTolerance": 7,
  "investmentKnowledge": 6
}
```

**Response:**
```json
{
  "riskScore": 68,
  "riskTolerance": "AGGRESSIVE",
  "recommendedStrategy": "Growth Portfolio",
  "assessment": { ... }
}
```

#### Get Recommendations
```http
GET /api/v1/profiling/recommendations?riskScore=68
```

**Response:**
```json
[
  {
    "strategyName": "Aggressive Growth",
    "strategyType": "aggressive",
    "expectedReturn": 12.0,
    "volatility": 18.0,
    "stockAllocation": 85.0,
    "bondAllocation": 10.0,
    "alternativeAllocation": 5.0,
    "cashAllocation": 0.0,
    "reasoning": "High growth potential...",
    "riskMatchScore": 92
  }
]
```

#### Get Enum Options
```http
GET /api/v1/profiling/enums/risk-tolerance
GET /api/v1/profiling/enums/investment-goals
```

### Risk Scoring Algorithm

```java
riskScore = (ageScore * 0.2) +
            (horizonScore * 0.3) +
            (toleranceScore * 0.3) +
            (knowledgeScore * 0.2)
```

**Factors:**
- **Age Score**: `max(0, 100 - age)` - Younger = higher capacity
- **Horizon Score**: `min(100, years * 5)` - Longer = higher capacity
- **Tolerance Score**: `lossTolerance * 10` - User's comfort with losses
- **Knowledge Score**: `investmentKnowledge * 10` - Experience level

**Score Mapping:**
- 1-29: Conservative
- 30-59: Moderate
- 60-79: Aggressive
- 80-100: Very Aggressive

### Project Structure

```
user-profiling-service/
├── src/main/java/com/sudheer/robinhood/profiling/
│   ├── UserProfilingServiceApplication.java
│   ├── controller/
│   │   └── ProfilingController.java
│   ├── service/
│   │   └── ProfilingService.java
│   ├── dto/
│   │   ├── QuickRiskAssessmentRequest.java
│   │   ├── QuickRiskAssessmentResponse.java
│   │   └── StrategyRecommendation.java
│   └── enums/
│       ├── RiskTolerance.java
│       ├── InvestmentGoal.java
│       ├── InvestmentHorizon.java
│       └── EmploymentStatus.java
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

### Running the Service

#### Build
```bash
cd backend/services/user-profiling-service
mvn clean package
```

#### Run Locally
```bash
mvn spring-boot:run
```

#### Run with Docker
```bash
docker compose up -d user-profiling-service
```

**Service URL**: http://localhost:8082

### Configuration

**Port**: 8082
**Database**: PostgreSQL (schema: profiling)
**Cache**: Redis
**Profiles**: default, docker

### Testing

```bash
# Quick assessment
curl -X POST http://localhost:8082/api/v1/profiling/quick-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "investmentAmount": 10000,
    "investmentGoal": "RETIREMENT",
    "timeHorizonYears": 30,
    "lossTolerance": 7,
    "investmentKnowledge": 5
  }'

# Get recommendations
curl http://localhost:8082/api/v1/profiling/recommendations?riskScore=65

# Get enum options
curl http://localhost:8082/api/v1/profiling/enums/risk-tolerance
```

### Integration with Frontend

The React frontend connects to this service at `http://localhost:8082`.

**TypeScript types** are already created in:
```
frontend/src/types/userProfile.ts
frontend/src/services/profilingService.ts
```

**Onboarding wizard** at:
```
frontend/src/pages/Onboarding.tsx
```

### Migration Notes

**From Python/Pydantic to Java/Spring Boot:**
- ✅ Pydantic models → Java DTOs with validation
- ✅ FastAPI endpoints → Spring REST controllers
- ✅ Python enums → Java enums
- ✅ Pydantic validators → Jakarta Bean Validation
- ✅ Risk calculation logic → Java methods
- ✅ CORS configuration → @CrossOrigin
- ✅ Response models → Lombok @Data classes

### Next Steps

1. Add full user profile entity (PersonalInformation, FinancialSituation, etc.)
2. Implement profile persistence with JPA
3. Add profile analysis service
4. Create comprehensive recommendations engine
5. Add unit and integration tests

### License
MIT
