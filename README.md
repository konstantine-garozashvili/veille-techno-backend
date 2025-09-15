# Veille Technologique - Backend API Development

## Project Overview

This project involves the development of a Kanban Board API as part of a technology watch assignment. The goal is to evaluate three different backend technologies, implement a functional API with each, and provide a comprehensive comparison of their advantages and disadvantages.

## Project Objectives

- **Technology Evaluation**: Compare three modern backend frameworks/technologies
- **API Development**: Implement a fully functional Kanban Board API
- **Performance Analysis**: Measure and compare implementation efficiency
- **Documentation**: Provide detailed technical analysis and recommendations

## Kanban Board API Requirements

### Core Features
- **Board Management**: Create, read, update, delete boards
- **Column Management**: Manage board columns (To Do, In Progress, Done, etc.)
- **Card Management**: Full CRUD operations for task cards
- **Card Movement**: Move cards between columns
- **User Management**: Basic user authentication and authorization

### Technical Requirements
- RESTful API design
- JSON data format
- Database integration (PostgreSQL/MongoDB)
- Input validation and error handling
- API documentation (OpenAPI/Swagger)
- Unit and integration testing
- Containerization (Docker)

### API Endpoints Structure
```
GET    /api/boards           # List all boards
POST   /api/boards           # Create new board
GET    /api/boards/{id}      # Get specific board
PUT    /api/boards/{id}      # Update board
DELETE /api/boards/{id}      # Delete board

GET    /api/boards/{id}/columns     # Get board columns
POST   /api/boards/{id}/columns     # Create column
PUT    /api/columns/{id}            # Update column
DELETE /api/columns/{id}            # Delete column

GET    /api/columns/{id}/cards      # Get cards in column
POST   /api/columns/{id}/cards      # Create card
GET    /api/cards/{id}              # Get specific card
PUT    /api/cards/{id}              # Update card
DELETE /api/cards/{id}              # Delete card
PUT    /api/cards/{id}/move         # Move card to different column

POST   /api/auth/login              # User authentication
POST   /api/auth/register           # User registration
GET    /api/auth/profile            # Get user profile
```

## Backend Technology Candidates

### 1. NestJS (Node.js + TypeScript)

**Framework Overview**: 
NestJS is a progressive Node.js framework for building efficient and scalable server-side applications, heavily inspired by Angular's architecture.

**Key Features**:
- TypeScript by default
- Decorator-based architecture
- Dependency injection system
- Built-in support for GraphQL, REST APIs
- Modular architecture
- Excellent CLI tooling

**Advantages**: 
*[To be evaluated and filled in during implementation]*
- TypeScript support out of the box
- Strong architectural patterns
- Excellent developer experience
- Rich ecosystem
- Good documentation

**Disadvantages**: 
*[To be evaluated and filled in during implementation]*
- Learning curve for developers new to decorators
- Potential performance overhead
- Memory consumption

**Tech Stack**:
- Runtime: Node.js
- Language: TypeScript
- Database ORM: TypeORM or Prisma
- Testing: Jest
- Validation: class-validator
- Documentation: @nestjs/swagger

---

### 2. Symfony (PHP)

**Framework Overview**: 
Symfony is a mature, high-performance PHP framework known for its reusable components and strong architecture principles.

**Key Features**:
- Component-based architecture
- Doctrine ORM integration
- Powerful console commands
- Flexible configuration
- Strong community support
- Enterprise-ready

**Advantages**: 
*[To be evaluated and filled in during implementation]*
- Mature and stable framework
- Excellent documentation
- Strong component ecosystem
- Good performance
- Enterprise adoption

**Disadvantages**: 
*[To be evaluated and filled in during implementation]*
- PHP language limitations
- Configuration complexity
- Learning curve

**Tech Stack**:
- Language: PHP 8.1+
- Database ORM: Doctrine
- Testing: PHPUnit
- API Platform: API Platform or FOSRestBundle
- Validation: Symfony Validator
- Documentation: NelmioApiDocBundle

---

### 3. Spring Boot (Java)

**Framework Overview**: 
Spring Boot is a Java-based framework that simplifies the development of production-ready applications with minimal configuration.

**Key Features**:
- Auto-configuration
- Embedded server support
- Production-ready features (metrics, health checks)
- Extensive Spring ecosystem
- Strong enterprise adoption
- Excellent tooling support

**Advantages**: 
*[To be evaluated and filled in during implementation]*
- Strong type safety
- Excellent tooling and IDE support
- Enterprise-grade features
- Robust ecosystem
- High performance

**Disadvantages**: 
*[To be evaluated and filled in during implementation]*
- Verbose syntax
- Longer startup time
- Resource consumption
- Steeper learning curve

**Tech Stack**:
- Language: Java 17+
- Database ORM: Spring Data JPA (Hibernate)
- Testing: JUnit 5, Mockito
- Validation: Bean Validation (JSR-303)
- Documentation: SpringDoc OpenAPI
- Build Tool: Maven or Gradle

---

## Initial Architecture Decisions

### Database Design
```sql
-- Basic database schema structure
Tables:
- users (id, username, email, password_hash, created_at)
- boards (id, name, description, owner_id, created_at, updated_at)
- columns (id, board_id, name, position, created_at, updated_at)
- cards (id, column_id, title, description, position, assigned_to, created_at, updated_at)
```

### Development Approach
1. **Phase 1**: Set up development environment for each technology
2. **Phase 2**: Implement basic CRUD operations
3. **Phase 3**: Add authentication and authorization
4. **Phase 4**: Implement advanced features
5. **Phase 5**: Performance testing and optimization
6. **Phase 6**: Documentation and comparison analysis

### Evaluation Criteria
- **Development Speed**: Time to implement features
- **Code Quality**: Maintainability, readability
- **Performance**: Response times, throughput
- **Developer Experience**: Tooling, debugging, documentation
- **Ecosystem**: Available packages, community support
- **Scalability**: Horizontal and vertical scaling capabilities
- **Testing**: Test framework quality and ease of use

## Project Structure

```
veille-techno-backend/
├── nestjs-implementation/
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── symfony-implementation/
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── composer.json
├── springboot-implementation/
│   ├── src/
│   ├── target/
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml
├── docs/
│   ├── api-specification.md
│   ├── performance-analysis.md
│   └── comparison-report.md
└── README.md
```

## Next Steps

1. **Environment Setup**: Configure development environments for all three technologies
2. **Database Setup**: Create PostgreSQL database schema
3. **API Implementation**: Start with basic CRUD operations
4. **Testing Strategy**: Implement comprehensive test suites
5. **Performance Monitoring**: Set up benchmarking tools
6. **Documentation**: Maintain detailed implementation notes

## Timeline

- **Week 1**: Project setup and initial research
- **Week 2-3**: NestJS implementation
- **Week 4-5**: Symfony implementation  
- **Week 6-7**: Spring Boot implementation
- **Week 8**: Testing, performance analysis, and comparison
- **Week 9**: Documentation and final report

---

*This README will be updated throughout the project with detailed findings, implementation notes, and comparative analysis.*
