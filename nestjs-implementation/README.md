# API Kanban Board - NestJS Implementation

## Description

Cette API Kanban Board est développée avec NestJS dans le cadre d'un projet de veille technologique comparant NestJS, Symfony et Spring Boot. L'application fournit une API REST et GraphQL complète pour gérer des tableaux Kanban avec authentification JWT et contrôle d'accès basé sur les rôles.

## Fonctionnalités

- ✅ **Authentification JWT** avec inscription, connexion et déconnexion
- ✅ **Gestion des utilisateurs** avec contrôle d'accès basé sur les rôles
- ✅ **Gestion des listes** Kanban (CRUD complet)
- ✅ **Gestion des cartes** avec titre, description et statut
- ✅ **API REST** avec documentation Swagger
- ✅ **API GraphQL** avec playground intégré
- ✅ **Blacklist des tokens** pour une déconnexion sécurisée
- ✅ **Tests e2e** complets
- ✅ **Conteneurisation Docker**

## Installation

### Prérequis
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optionnel)

### Installation locale

```bash
# Cloner le repository
git clone <repository-url>
cd nestjs-implementation

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Démarrer la base de données (avec Docker)
docker compose up -d postgres

# Lancer l'application
npm run start:dev
```

### Installation avec Docker

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f nestjs-api
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=kanban_user
DATABASE_PASSWORD=kanban_password
DATABASE_NAME=kanban_api

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h

# Application
PORT=3000
NODE_ENV=development

# Données de test
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Password123!
```

## Utilisation

### Accès aux services

- **API REST**: http://localhost:3000
- **Documentation Swagger**: http://localhost:3000/api
- **GraphQL Playground**: http://localhost:3000/graphql

### Authentification

#### Inscription
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Connexion
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Déconnexion
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Exemples d'utilisation

#### Créer une liste
```bash
curl -X POST http://localhost:3000/lists \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Ma première liste"}'
```

#### Créer une carte
```bash
curl -X POST http://localhost:3000/lists/LIST_ID/cards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Ma première carte", "description": "Description de la carte"}'
```

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov

# Tests avec Docker
docker compose exec nestjs-api npm run test:e2e
```

## Architecture

### Structure du projet
```
src/
├── app.module.ts          # Module principal
├── main.ts                # Point d'entrée
├── auth/                  # Module d'authentification
│   ├── auth.controller.ts # Endpoints REST auth
│   ├── auth.resolver.ts   # Mutations GraphQL auth
│   ├── auth.service.ts    # Logique métier auth
│   ├── token-blacklist.service.ts # Gestion blacklist tokens
│   └── guards/            # Guards JWT
├── users/                 # Module utilisateurs
├── lists/                 # Module listes Kanban
├── cards/                 # Module cartes Kanban
└── health/                # Health checks
```

### Sécurité

- **Hachage des mots de passe** avec bcrypt
- **Tokens JWT** avec expiration configurable
- **Blacklist des tokens** pour la déconnexion sécurisée
- **Contrôle d'accès** basé sur les rôles (user/admin)
- **Validation des données** avec class-validator

## API Endpoints

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion (JWT requis)

### Utilisateurs
- `GET /users` - Lister les utilisateurs (JWT requis)
- `GET /users/:id` - Obtenir un utilisateur (JWT requis)
- `POST /users` - Créer un utilisateur (Admin requis)
- `PATCH /users/:id` - Modifier un utilisateur (Admin requis)
- `DELETE /users/:id` - Supprimer un utilisateur (Admin requis)

### Listes
- `GET /lists` - Lister les listes (JWT requis)
- `POST /lists` - Créer une liste (JWT requis)
- `GET /lists/:id` - Obtenir une liste (JWT requis)
- `PATCH /lists/:id` - Modifier une liste (JWT requis)
- `DELETE /lists/:id` - Supprimer une liste (JWT requis)

### Cartes
- `GET /lists/:listId/cards` - Lister les cartes (JWT requis)
- `POST /lists/:listId/cards` - Créer une carte (JWT requis)
- `GET /lists/:listId/cards/:cardId` - Obtenir une carte (JWT requis)
- `PATCH /lists/:listId/cards/:cardId` - Modifier une carte (JWT requis)
- `DELETE /lists/:listId/cards/:cardId` - Supprimer une carte (JWT requis)

## Développement

### Scripts disponibles

```bash
# Développement
npm run start:dev          # Mode watch
npm run start:debug        # Mode debug

# Build
npm run build              # Build production
npm run start:prod         # Démarrer en production

# Tests
npm run test               # Tests unitaires
npm run test:watch         # Tests en mode watch
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Coverage

# Linting
npm run lint               # ESLint
npm run format             # Prettier
```

### Commandes Docker

```bash
# Démarrer tous les services
docker compose up -d

# Redémarrer l'API NestJS
docker compose restart nestjs-api

# Voir les logs
docker compose logs -f nestjs-api

# Accéder au conteneur
docker compose exec nestjs-api sh

# Arrêter tous les services
docker compose down
```

## Documentation

- **Documentation d'architecture**: Voir `../ARCHITECTURE_DOCUMENTATION.md`
- **Documentation de veille**: Voir `../VEILLE_TECHNIQUE.md`
- **Swagger UI**: http://localhost:3000/api
- **GraphQL Playground**: http://localhost:3000/graphql

## Support

Pour toute question ou problème :
1. Vérifiez la documentation d'architecture
2. Consultez les logs avec `docker compose logs -f nestjs-api`
3. Vérifiez que tous les services sont démarrés avec `docker compose ps`

## Licence

Ce projet est développé dans un cadre éducatif pour la veille technologique.
