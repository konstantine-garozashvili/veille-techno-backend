# Kanban Board API — README (Projet et Documentation)

Projet d’API Kanban pour une équipe produit. Le code est en anglais, la documentation en français. L’objectif: livrer une API robuste, documentée (Swagger), testée (e2e), et prête à l’usage via Docker.

Sommaire
- Présentation rapide
- Démarrage rapide (Docker / Local)
- Variables d’environnement (.env)
- Documentation API (Swagger + GraphQL)
- Base de données & pgAdmin
- Tests
- Architecture & Structure
- Veille technologique et choix
- Contribution & Sécurité

Présentation rapide
- API Kanban (authentification, utilisateurs, listes, cartes)
- Stack choisie: NestJS + TypeORM + PostgreSQL
- Swagger exposé en /api (FR)

Démarrage rapide
1) Prérequis
- Docker Desktop
- Node 20+ si exécution locale

2) Docker Compose (recommandé)
- Depuis la racine: 
  - docker compose up -d postgres nestjs-api pgadmin
- Accès:
  - API NestJS: http://localhost:3001/
  - Swagger: http://localhost:3001/api
  - pgAdmin: http://localhost:5050 (email: admin@example.com, mdp: admin)
- Arrêt: docker compose stop
- Nettoyage: docker compose down

3) Exécution locale (sans Docker)
- cd nestjs-implementation
- npm ci
- Copier .env.example vers .env (ou créer .env) et adapter (voir section .env)
- npm run start:dev
- API: http://localhost:3000 — Swagger: http://localhost:3000/api

Variables d’environnement (.env)
Dans nestjs-implementation/.env (exemple):
- PORT=3000
- NODE_ENV=development
- JWT_SECRET=change_me
- DATABASE_HOST=localhost (ou postgres en Docker)
- DATABASE_PORT=5432
- DATABASE_NAME=kanban_api
- DATABASE_USER=kanban_user
- DATABASE_PASSWORD=kanban_password
- SEED_ADMIN_EMAIL=admin@example.com
- SEED_ADMIN_PASSWORD=Admin123!

Documentation API
- Swagger UI: /api (local: http://localhost:3000/api, Docker: http://localhost:3001/api)
- OpenAPI JSON: /api-json
- Détails des endpoints REST: voir docs/API.md
- GraphQL: /graphql (local: 3000, Docker: 3001). Ajouter Authorization: Bearer <token>.

Base de données & pgAdmin
- PostgreSQL: localhost:5432 (user: kanban_user, db: kanban_api)
- pgAdmin: http://localhost:5050 (provisionné automatiquement). Le serveur Postgres “Kanban Postgres” est préconfiguré.

Tests
- e2e: cd nestjs-implementation && npm run test:e2e

Architecture & Structure
- NestJS (modules/controllers/services) par domaines: auth, users, lists, cards
- TypeORM pour PostgreSQL, validations via class-validator
- Dossier docs/ pour API, setup et veille

Veille technologique et choix
- Comparatif NestJS / Symfony / Spring Boot et justification détaillée: voir docs/veille_technologique_backend.md

Contribution & Sécurité
- Créez une issue pour toute feature/bugfix; branche: feature/<nom> ou fix/<nom>; ouvrez une PR; merge uniquement si tests/CI OK.
- Ne commitez aucun secret. N’utilisez jamais de données réelles en tests/fixtures.
