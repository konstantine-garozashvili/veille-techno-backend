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

## Démarrage rapide avec Docker Compose (développement)

Si vous souhaitez tout lancer via Docker Compose (PostgreSQL + API NestJS):

1) Prérequis
- Docker Desktop installé et démarré
- Le fichier Dockerfile est présent dans `./nestjs-implementation/` (créé)

2) Lancer les services
- Depuis la racine du repo:
  - `docker compose build nestjs-api`
  - `docker compose up -d db nestjs-api`

3) Points d’accès
- API NestJS: http://localhost:3001/
- Swagger (FR): http://localhost:3001/api
- Base de données Postgres: `localhost:5432` (user: `kanban_user`, db: `kanban_api`)

4) Arrêt et nettoyage
- Arrêter: `docker compose stop`
- Supprimer conteneurs: `docker compose down`

Notes
- Le service `nestjs-api` mappe le port interne 3000 vers 3001 sur l’hôte (cf. docker-compose.yml).
- Dans l’environnement local sans Docker, l’API écoute sur 3000; via Compose, utilisez 3001.
- Le service Nginx est optionnel et peut rester commenté tant que vous n’orchestrer pas plusieurs backends.

## Correction de la note sur la racine API

- Le endpoint racine renvoie bien la chaîne "Hello World!" via GET /. Vérifiez sur:
  - Local (npm start): http://localhost:3000/
  - Docker Compose: http://localhost:3001/

Reportez-vous aussi à docs/SETUP.md pour des notes plus détaillées.

Configuration de l'environnement (.env)
- Créez un fichier .env à la racine avec par exemple:
  PORT=3000
  NODE_ENV=development
  JWT_SECRET=change_me
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=postgres
  DB_NAME=kanban_dev

Installation et lancement
- Installer les dépendances:
  npm install
- Démarrer en développement (watch):
  npm run start:dev
- Build TypeScript → JavaScript:
  npm run build
- Démarrer en production (sur dist/):
  npm run start:prod

Documentation et santé de l'API
- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json
- Health check DB: http://localhost:3000/health/db → { status: "ok" }
- Note: la racine / retourne 404 par conception tant que le contrôleur root n'est pas câblé

Conseil TypeScript
- Le projet utilise "module": "CommonJS" et "moduleResolution": "node" pour éviter les frictions IDE.
- Pour un type-check de build (sans tests): npx tsc -p tsconfig.build.json --noEmit

# API — Endpoints principaux

Auth
- POST /auth/register → crée un utilisateur (public), renvoie l'utilisateur sans passwordHash
- POST /auth/login → renvoie { access_token, user }

Users (protégés par JWT sauf création publique)
- GET /users → liste des utilisateurs (401 si non authentifié)
- GET /users/:id → détail d'un utilisateur
- PATCH /users/:id → mise à jour (ex: rôles, mot de passe)
- DELETE /users/:id → suppression logique ou dure selon implémentation
- POST /users → création publique d'utilisateur

Health
- GET /health/db → état de la base de données

# Sécurité
- Authentification via JWT (Bearer token) avec stratégie Passport JWT.
- Les endpoints Users sont protégés, à l'exception de la création publique si activée.
- Ne jamais committer de secrets: configurez JWT_SECRET et les variables DB via .env.
- synchronize: true doit rester cantonné au développement; préférez les migrations pour les environnements partagés/CI/prod.

# Tests rapides (Smoke tests)
- Voir docs/SETUP.md pour une checklist détaillée et des commandes prêtes à l'emploi (PowerShell/cURL).
- Cas attendus: 401 sans token, 409 sur inscription dupliquée, 404 après suppression.

# Veille technologique (Synthèse)

NestJS — présentation, avantages et inconvénients (~200 mots)
NestJS est un framework Node.js orienté vers l'architecture modulaire et inspiré des bonnes pratiques d'Angular (décorateurs, modules, injection de dépendances). Il s'appuie fortement sur TypeScript, encourage une structure claire en couches (controllers, services, modules) et offre une intégration fluide avec des briques courantes (Swagger, validation, cache, WebSockets, microservices). Ses avantages: productivité élevée grâce aux CLIs, écosystème riche (@nestjs/jwt, @nestjs/passport, TypeORM, etc.), documentation soignée, patterns d'entreprise (SOLID), testabilité et extensibilité naturelles. Il facilite la standardisation au sein d'une équipe pluridisciplinaire JavaScript/TypeScript. Parmi les inconvénients: une courbe d'apprentissage due aux abstractions (métadonnées, pipes, guards, interceptors) et à la configuration parfois verbeuse; le surcoût de l'injection de dépendances peut sembler excessif pour de très petits services. De plus, le coupling aux décorateurs et à la réflexion runtime peut compliquer certains cas avancés de typage. Enfin, les performances brutes d'un service Node.js sous Nest peuvent être légèrement en retrait par rapport à un micro-framework minimaliste, mais suffisantes pour la majorité des cas d'usage.

Symfony — présentation, avantages et inconvénients (~200 mots)
Symfony est un framework PHP mature et modulaire, reconnu pour sa robustesse, sa stabilité et son écosystème professionnel. Il propose une architecture claire (bundles, services, contrôleurs) et un moteur d'injection de dépendances puissant. Ses avantages: conventions éprouvées, excellent support de la communauté et de SensioLabs, nombreux composants réutilisables (HTTP Foundation, Console, Validator), outillage robuste (MakerBundle, Profiler), et intégration facile avec Doctrine ORM. Il brille pour des applications métier complexes, maintenables et sécurisées. Inconvénients: la performance brute en PHP moderne est correcte mais peut nécessiter du tuning (OPcache, cache applicatif) pour des charges élevées; la verbosité de certaines configurations et la courbe d'apprentissage des concepts (événements, autowiring avancé) peuvent ralentir les débuts. Par ailleurs, si l'équipe est principalement orientée JavaScript/TypeScript, le contexte PHP peut introduire une friction outillage/compétences. Malgré cela, Symfony reste un choix premium pour des backends robustes, surtout en contexte européen.

Spring Boot — présentation, avantages et inconvénients (~200 mots)
Spring Boot est l'accélérateur de l'écosystème Spring pour Java/Kotlin, offrant auto-configuration, starters et une opinion forte pour démarrer rapidement. Avantages: performances et scalabilité excellentes sur la JVM, maturité industrielle, observabilité complète (Actuator), écosystème massif (Spring Security, Data JPA, Cloud), support de patterns modernes (Reactive WebFlux), et outillage de qualité (Gradle/Maven). Il excelle pour des systèmes à forte exigence de robustesse, sécurité et scalabilité. Inconvénients: configuration et compréhension de l'écosystème peuvent être intimidantes; le coût mémoire et le temps de démarrage de la JVM, quoique optimisés, restent supérieurs à Node.js pour des microservices très petits; le développement peut être plus verbeux. Pour une équipe majoritairement JS/TS, le changement de langage ajoute un coût de montée en compétences. Spring reste toutefois une référence pour des plateformes d'entreprise à long terme.

Justification du choix — pourquoi NestJS pour ce projet (~200 mots)
Nous choisissons NestJS pour aligner la technologie sur les compétences existantes (TypeScript), accélérer la livraison et maximiser la lisibilité/maintenabilité. Le modèle modulaire (modules/controllers/services) épouse naturellement une API Kanban (domaines: auth, users, boards, lists, cards) et facilite l'évolution incrémentale. L'écosystème officiel couvre l'authentification JWT, la validation, la documentation Swagger et l'intégration TypeORM/PostgreSQL avec un minimum de friction. La productivité de l'équipe est renforcée par le CLI, la cohérence des patterns et la testabilité (Jest + Supertest). En outre, Nest propose des chemins de croissance (microservices, CQRS, cache, WebSockets) si les besoins augmentent. Par rapport à Symfony, Nest évite un changement de langage/outillage et tire parti de notre stack frontend. Par rapport à Spring Boot, il réduit la charge cognitive et permet un time-to-first-feature plus court pour une petite équipe. Enfin, la présence d'une communauté active et d'exemples nombreux accélère le troubleshooting et la veille.

# Contribution
- Respectez la structure du projet et créez une issue GitHub avant toute nouvelle fonctionnalité/correctif.
- Nommez les branches: feature/<feature>, fix/<bug>, etc. Ouvrez une Pull Request; pas de push direct sur main.
- Mettez à jour la documentation (README/SETUP/Swagger) dès que vous ajoutez une fonctionnalité.
- Ne partagez jamais de secrets, ni de données réelles dans les exemples/fixtures/tests.
