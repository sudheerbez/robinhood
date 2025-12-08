# Simplified Auth Service

## ✅ What Was Removed

❌ OAuth 2.0 Authorization Server
❌ JWT Tokens (access & refresh)
❌ Role-Based Access Control (RBAC)
❌ Roles & Permissions tables
❌ Spring Security filters
❌ Token management
❌ Complex security configuration

## ✅ What Remains (Simple & Clean)

✅ **User Registration** - Create account with username/password
✅ **User Login** - Authenticate with username/password
✅ **Password Hashing** - BCrypt for security
✅ **User Lookup** - Get user by ID

## 📊 Simplified Structure

```
auth-service/
├── model/
│   └── User.java                    # Just username, email, password
├── repository/
│   └── UserRepository.java          # Basic CRUD
├── service/
│   └── AuthService.java             # Register & Login logic
├── controller/
│   └── AuthController.java          # 3 simple endpoints
└── dto/
    ├── RegisterRequest.java
    ├── LoginRequest.java
    └── AuthResponse.java            # No tokens, just user info
```

## 🔧 API Endpoints

### 1. Register
```bash
POST /api/v1/auth/register
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "userId": 1,
  "username": "john",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "Registration successful"
}
```

### 2. Login
```bash
POST /api/v1/auth/login
{
  "username": "john",
  "password": "password123"
}

Response:
{
  "userId": 1,
  "username": "john",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "Login successful"
}
```

### 3. Get User
```bash
GET /api/v1/auth/users/{userId}

Response:
{
  "userId": 1,
  "username": "john",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## 🎯 Focus: Strategy Service

Now the focus is on **Robinhood Strategies features**:
- Creating investment strategies
- Backtesting
- Portfolio management
- AI recommendations

The auth is just simple login/register to identify users!
