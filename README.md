# Kanban Board API — README (Projet et Documentation)

Projet réalisé par konstantine garozashvili.
Portfolio: https://konstantine.fr — LinkedIn: https://fr.linkedin.com/in/konstantine-garozashvili

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
  - **Méthode simple**: `docker compose up -d`
  - **Méthode avec affichage des ports**: `./show-ports.sh` (Linux/Git Bash) ou `powershell -File show-ports.ps1` (Windows)
  
- **Services disponibles** :
  - 🌐 **API NestJS**: http://localhost:3001
  - 📖 **Swagger**: http://localhost:3001/api  
  - 🎮 **GraphQL Playground**: http://localhost:3001/graphql
  - 🗄️ **PostgreSQL**: localhost:5432 (kanban_user/kanban_password)
  - 🔧 **pgAdmin**: http://localhost:5050 (admin@example.com/admin)

- **Commandes utiles**:
  - Arrêt: `docker compose stop`
  - Nettoyage: `docker compose down`
  - Logs: `docker compose logs -f`

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
- GraphQL: /graphql (local: http://localhost:3000/graphql, Docker: http://localhost:3001/graphql). Ajouter l’en-tête Authorization: Bearer <token>.

  Détails GraphQL
  - Authentification: récupérer un token via POST /auth/login, puis l’ajouter en Authorization: Bearer <token>.
  - Explorateur: l’Apollo Sandbox est activé en développement et accessible directement sur l’URL /graphql.
  - Exemples de requêtes (schéma réel dans l’explorateur):

    Exemple – Lister les listes
    ```graphql
    query {
      lists { id title }
    }
    ```

    Exemple – Créer une liste
    ```graphql
    mutation {
      createList(input: { title: "Backlog" }) { id title }
    }
    ```

    Exemple – Créer une carte dans une liste
    ```graphql
    mutation CreateCard($listId: String!) {
      createCard(listId: $listId, input: { title: "Setup CI", description: "Configurer la CI", position: 1 }) {
        id title position
      }
    }
    ```

    Exemple – Lister les cartes d’une liste
    ```graphql
    query Cards($listId: String!) {
      cards(listId: $listId) { id title position }
    }
    ```

    Exemple – Supprimer une liste ou une carte
    ```graphql
    mutation Remove($listId: String!, $cardId: String!) {
      removeList(id: $listId)
      removeCard(listId: $listId, cardId: $cardId)
    }
    ```

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
