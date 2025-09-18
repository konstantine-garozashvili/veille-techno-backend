# Documentation d'Architecture - API Kanban Board NestJS

## Vue d'ensemble du projet

Cette API Kanban Board est développée avec NestJS et fait partie d'un projet de veille technologique comparant NestJS, Symfony et Spring Boot. L'application fournit une API REST et GraphQL complète pour gérer des tableaux Kanban avec authentification JWT et contrôle d'accès basé sur les rôles.

## Architecture générale

### Stack technologique
- **Framework**: NestJS (Node.js/TypeScript)
- **Base de données**: PostgreSQL
- **ORM**: TypeORM
- **Authentification**: JWT avec Passport.js
- **API**: REST + GraphQL (Apollo Server)
- **Documentation**: Swagger/OpenAPI
- **Conteneurisation**: Docker & Docker Compose

### Structure du projet
```
nestjs-implementation/
├── src/
│   ├── app.module.ts          # Module principal
│   ├── main.ts                # Point d'entrée
│   ├── auth/                  # Module d'authentification
│   ├── users/                 # Module utilisateurs
│   ├── lists/                 # Module listes Kanban
│   ├── cards/                 # Module cartes Kanban
│   ├── health/                # Module health check
│   └── schema.gql             # Schéma GraphQL généré
├── test/                      # Tests e2e
├── Dockerfile                 # Configuration Docker
└── package.json               # Dépendances
```

## Endpoints API

### 1. Authentification (`/auth`)

#### REST Endpoints
- **POST /auth/register**
  - Description: Inscription d'un nouvel utilisateur
  - Body: `{ email: string, password: string }`
  - Response: `{ access_token: string, user: UserResponseDto }`
  - Auth: Aucune

- **POST /auth/login**
  - Description: Connexion utilisateur
  - Body: `{ email: string, password: string }`
  - Response: `{ access_token: string, user: UserResponseDto }`
  - Auth: Aucune

- **POST /auth/logout**
  - Description: Déconnexion utilisateur (invalidation du token)
  - Body: Aucun
  - Response: `{ message: "Successfully logged out" }`
  - Auth: JWT Bearer Token

#### GraphQL Mutations
- **register(input: CreateUserDto): String**
- **login(email: String!, password: String!): String**
- **logout: String** (Auth: JWT Bearer Token)

### 2. Utilisateurs (`/users`)

#### REST Endpoints
- **POST /users**
  - Description: Créer un utilisateur (admin uniquement)
  - Body: `CreateUserDto`
  - Response: `UserResponseDto`
  - Auth: JWT + Role admin

- **GET /users**
  - Description: Lister tous les utilisateurs
  - Response: `UserResponseDto[]`
  - Auth: JWT

- **GET /users/:id**
  - Description: Obtenir un utilisateur par ID
  - Response: `UserResponseDto`
  - Auth: JWT

- **PATCH /users/:id**
  - Description: Modifier un utilisateur (admin uniquement)
  - Body: `UpdateUserDto`
  - Response: `UserResponseDto`
  - Auth: JWT + Role admin

- **DELETE /users/:id**
  - Description: Supprimer un utilisateur (admin uniquement)
  - Response: `{}`
  - Auth: JWT + Role admin

#### GraphQL Queries/Mutations
- **Query users: [User!]!**
- **Query user(id: String!): User!**
- **Mutation createUser(input: CreateUserDto!): User!** (admin)
- **Mutation updateUser(id: String!, input: UpdateUserDto!): User!** (admin)
- **Mutation removeUser(id: String!): Boolean!** (admin)

### 3. Listes (`/lists`)

#### REST Endpoints
- **POST /lists**
  - Description: Créer une nouvelle liste
  - Body: `CreateListDto`
  - Response: `List`
  - Auth: JWT

- **GET /lists**
  - Description: Obtenir toutes les listes
  - Response: `List[]`
  - Auth: JWT

- **GET /lists/:id**
  - Description: Obtenir une liste par ID
  - Response: `List`
  - Auth: JWT

- **PATCH /lists/:id**
  - Description: Modifier une liste
  - Body: `UpdateListDto`
  - Response: `List`
  - Auth: JWT

- **DELETE /lists/:id**
  - Description: Supprimer une liste
  - Response: `{}`
  - Auth: JWT

#### GraphQL Queries/Mutations
- **Query list(id: String!): List!**
- **Mutation createList(input: CreateListDto!): List!**
- **Mutation updateList(id: String!, input: UpdateListDto!): List!**
- **Mutation removeList(id: String!): Boolean!**

### 4. Cartes (`/cards`)

#### REST Endpoints
- **POST /lists/:listId/cards**
  - Description: Créer une carte dans une liste
  - Body: `CreateCardDto`
  - Response: `Card`
  - Auth: JWT

- **GET /lists/:listId/cards**
  - Description: Obtenir toutes les cartes d'une liste
  - Response: `Card[]`
  - Auth: JWT

- **GET /lists/:listId/cards/:cardId**
  - Description: Obtenir une carte spécifique
  - Response: `Card`
  - Auth: JWT

- **PATCH /lists/:listId/cards/:cardId**
  - Description: Modifier une carte
  - Body: `UpdateCardDto`
  - Response: `Card`
  - Auth: JWT

- **DELETE /lists/:listId/cards/:cardId**
  - Description: Supprimer une carte
  - Response: `{}`
  - Auth: JWT

#### GraphQL Queries/Mutations
- **Query cards(listId: String!): [Card!]!**
- **Query card(listId: String!, cardId: String!): Card!**
- **Mutation createCard(listId: String!, input: CreateCardDto!): Card!**
- **Mutation updateCard(listId: String!, cardId: String!, input: UpdateCardDto!): Card!**
- **Mutation removeCard(listId: String!, cardId: String!): Boolean!**

### 5. Health Check (`/health`)

#### REST Endpoints
- **GET /health/db**
  - Description: Vérifier la connexion à la base de données
  - Response: `{ status: string, database: string }`
  - Auth: Aucune

### 6. Application (`/`)

#### REST Endpoints
- **GET /**
  - Description: Message de bienvenue
  - Response: `"Hello World!"`
  - Auth: Aucune

## Modèles de données

### User Entity
```typescript
{
  id: string (UUID)
  email: string (unique)
  passwordHash: string (non exposé)
  roles: string[] (default: ["user"])
  createdAt: Date
  updatedAt: Date
}
```

### List Entity
```typescript
{
  id: string (UUID)
  title: string
  createdAt: Date
  updatedAt: Date
}
```

### Card Entity
```typescript
{
  id: string (UUID)
  title: string
  description?: string
  position: number (default: 0)
  list: List (relation ManyToOne)
  createdAt: Date
  updatedAt: Date
}
```

## Système d'authentification

### JWT Configuration
- **Secret**: Variable d'environnement `JWT_SECRET`
- **Expiration**: Variable d'environnement `JWT_EXPIRES_IN` (default: 1h)
- **Extraction**: Bearer token dans l'en-tête Authorization
- **Payload**: `{ sub: userId, email: string, roles: string[] }`

### Guards et stratégies
- **JwtStrategy**: Validation des tokens JWT
- **JwtAuthGuard**: Protection des endpoints REST
- **GqlAuthGuard**: Protection des resolvers GraphQL
- **RolesGuard**: Contrôle d'accès basé sur les rôles

### Rôles disponibles
- **user**: Rôle par défaut, accès aux fonctionnalités de base
- **admin**: Accès complet, peut gérer les utilisateurs

### Règles d'accès
- **Endpoints publics**: `/auth/register`, `/auth/login`, `/health/db`, `/`
- **Endpoints authentifiés**: Tous les autres endpoints nécessitent un JWT valide
- **Endpoints admin**: Gestion des utilisateurs (`POST/PATCH/DELETE /users`)

## Configuration Docker

### Services définis

#### 1. PostgreSQL Database
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: kanban_api
    POSTGRES_USER: kanban_user
    POSTGRES_PASSWORD: kanban_password
  ports: ["5432:5432"]
  volumes: ["postgres_data:/var/lib/postgresql/data"]
```

#### 2. NestJS API
```yaml
nestjs-api:
  build: ./nestjs-implementation
  environment:
    DATABASE_HOST: postgres
    DATABASE_PORT: 5432
    DATABASE_USER: kanban_user
    DATABASE_PASSWORD: kanban_password
    DATABASE_NAME: kanban_api
    JWT_SECRET: your_super_secret_jwt_key_change_in_production
    NODE_ENV: development
  ports: ["3000:3000"]
  depends_on: [postgres]
```

#### 3. Symfony API (comparaison)
```yaml
symfony-api:
  build: ./symfony-implementation
  ports: ["8000:8000"]
  depends_on: [postgres]
```

#### 4. Spring Boot API (comparaison)
```yaml
spring-boot-api:
  build: ./spring-boot-implementation
  ports: ["8080:8080"]
  depends_on: [postgres]
```

#### 5. pgAdmin
```yaml
pgadmin:
  image: dpage/pgadmin4:latest
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@kanban.local
    PGADMIN_DEFAULT_PASSWORD: admin123
  ports: ["5050:80"]
```

#### 6. Nginx Reverse Proxy
```yaml
nginx:
  image: nginx:alpine
  ports: ["80:80"]
  volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
  depends_on: [nestjs-api, symfony-api, spring-boot-api]
```

### Dockerfile NestJS
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
```

## Variables d'environnement

### Variables requises
- **JWT_SECRET**: Clé secrète pour signer les tokens JWT
- **DATABASE_HOST**: Hôte de la base de données (default: localhost)
- **DATABASE_PORT**: Port de la base de données (default: 5432)
- **DATABASE_USER**: Utilisateur de la base de données (default: kanban_user)
- **DATABASE_PASSWORD**: Mot de passe de la base de données (default: kanban_password)
- **DATABASE_NAME**: Nom de la base de données (default: kanban_api)

### Variables optionnelles
- **JWT_EXPIRES_IN**: Durée de validité des tokens (default: 1h)
- **PORT**: Port d'écoute de l'application (default: 3000)
- **NODE_ENV**: Environnement d'exécution (development/production)
- **SEED_ADMIN_EMAIL**: Email de l'admin par défaut (default: admin@example.com)
- **SEED_ADMIN_PASSWORD**: Mot de passe de l'admin par défaut (default: Password123!)

## Fonctionnalités avancées

### Documentation API
- **Swagger UI**: Disponible sur `/api`
- **GraphQL Playground**: Disponible sur `/graphql` (dev uniquement)
- **Authentification Swagger**: Support Bearer token avec persistance

### Validation des données
- **class-validator**: Validation automatique des DTOs
- **class-transformer**: Transformation des données
- **Pipes de validation**: Whitelist et forbidNonWhitelisted activés

### Sécurité
- **Hachage des mots de passe**: bcrypt avec salt rounds = 10
- **Protection CSRF**: Activée en production
- **Validation des rôles**: Contrôle d'accès granulaire
- **Sanitisation des réponses**: Exclusion des mots de passe
- **Gestion des tokens JWT**:
  - Blacklist en mémoire pour les tokens invalidés
  - Vérification automatique de la blacklist dans les guards JWT
  - Invalidation des tokens lors du logout
  - Service TokenBlacklistService pour la gestion centralisée

### Base de données
- **Synchronisation automatique**: TypeORM sync activé (dev uniquement)
- **UUID**: Identifiants uniques pour toutes les entités
- **Timestamps**: createdAt/updatedAt automatiques
- **Relations**: Cascade delete pour les cartes

### Tests
- **Tests e2e**: Configuration Jest avec base de données de test
- **Helpers de test**: Utilitaires pour l'authentification et les données
- **Coverage**: Configuration pour les rapports de couverture

## Accès aux services

### URLs de développement
- **API NestJS**: http://localhost:3000
- **Documentation Swagger**: http://localhost:3000/api
- **GraphQL Playground**: http://localhost:3000/graphql
- **API Symfony**: http://localhost:8000
- **API Spring Boot**: http://localhost:8080
- **pgAdmin**: http://localhost:5050
- **Nginx (reverse proxy)**: http://localhost:80

### Comptes par défaut
- **Admin**: admin@example.com / Password123!
- **pgAdmin**: admin@kanban.local / admin123

## Commandes utiles

### Développement
```bash
# Démarrer tous les services
docker compose up -d

# Redémarrer uniquement NestJS
docker compose restart nestjs-api

# Voir les logs
docker compose logs -f nestjs-api

# Accéder au conteneur
docker compose exec nestjs-api sh
```

### Tests
```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

### Build
```bash
# Build de production
npm run build

# Démarrer en production
npm run start:prod
```