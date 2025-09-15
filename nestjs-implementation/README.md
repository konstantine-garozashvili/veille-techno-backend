# NestJS Implementation - Kanban Board API

## Overview
This directory contains the NestJS implementation of the Kanban Board API. NestJS is a progressive Node.js framework for building efficient and scalable server-side applications, heavily inspired by Angular's architecture.

## Technology Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.0+
- **Framework**: NestJS 10+
- **Database ORM**: Prisma or TypeORM
- **Database**: PostgreSQL 15+
- **Testing**: Jest
- **Validation**: class-validator & class-transformer
- **Documentation**: @nestjs/swagger
- **Authentication**: JWT with @nestjs/jwt
- **Configuration**: @nestjs/config

## Prerequisites
Before starting, ensure you have the following installed:
- Node.js (v18 or later)
- npm or yarn package manager
- PostgreSQL database
- Docker (optional, for containerized development)

## Setup Instructions

### 1. Install Dependencies
```bash
# Navigate to the NestJS implementation directory
cd nestjs-implementation

# Install dependencies using npm
npm install

# Or using yarn
yarn install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_nestjs"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Application Configuration
PORT=3001
NODE_ENV=development

# API Configuration
API_PREFIX="api/v1"
SWAGGER_TITLE="Kanban Board API - NestJS"
SWAGGER_DESCRIPTION="RESTful API for Kanban Board management built with NestJS"
SWAGGER_VERSION="1.0.0"
```

### 3. Database Setup
```bash
# Generate Prisma client (if using Prisma)
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with initial data (optional)
npx prisma db seed
```

### 4. Development Server
```bash
# Start development server with hot reload
npm run start:dev

# Or with yarn
yarn start:dev
```

The API will be available at `http://localhost:3001`

### 5. API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api/docs`
- **OpenAPI JSON**: `http://localhost:3001/api/docs-json`

## Project Structure
```
nestjs-implementation/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── boards/
│   │   ├── boards.controller.ts
│   │   ├── boards.module.ts
│   │   ├── boards.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── columns/
│   │   ├── columns.controller.ts
│   │   ├── columns.module.ts
│   │   ├── columns.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── cards/
│   │   ├── cards.controller.ts
│   │   ├── cards.module.ts
│   │   ├── cards.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   └── database/
│       ├── database.module.ts
│       ├── migrations/
│       └── seeds/
├── test/
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── __mocks__/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts
```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start in debug mode

# Production
npm run build          # Build the application
npm run start:prod     # Start production server

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
```

## Docker Support
```bash
# Build Docker image
docker build -t kanban-nestjs .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## Testing Strategy
- **Unit Tests**: Test individual components, services, and controllers
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Coverage**: Maintain >90% test coverage

## Key Features to Implement
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - Password hashing with bcrypt

2. **Board Management**
   - CRUD operations for boards
   - User ownership and permissions
   - Board sharing capabilities

3. **Column Management**
   - Dynamic column creation
   - Column ordering and positioning
   - Column-specific configurations

4. **Card Management**
   - Full CRUD operations
   - Card assignment to users
   - Card movement between columns
   - Rich card descriptions

5. **Real-time Updates** (Optional)
   - WebSocket integration
   - Real-time board synchronization

## Performance Considerations
- Database query optimization
- Proper indexing strategy
- Caching with Redis (if needed)
- Request rate limiting
- Input validation and sanitization

## Security Measures
- Input validation using class-validator
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet.js for security headers
- Rate limiting

## Monitoring & Logging
- Structured logging with Winston
- Application metrics
- Error tracking
- Health checks endpoint

## Development Notes
- Use TypeScript strict mode
- Follow NestJS best practices
- Implement proper error handling
- Use DTOs for request/response validation
- Implement proper logging
- Write comprehensive tests

## Next Steps
1. Set up the basic NestJS project structure
2. Configure database connection and ORM
3. Implement authentication module
4. Create entity models and DTOs
5. Develop API endpoints
6. Add comprehensive testing
7. Set up Docker containerization
8. Implement API documentation

This implementation will serve as one of the three technology comparisons in the veille technologique project.
