# API Kanban Board — Documentation des Endpoints

Cette documentation décrit l’intégralité des endpoints exposés par l’API Kanban Board (NestJS). Le code est en anglais, mais cette documentation et les textes côté interface sont en français. L’UI Swagger est disponible sur /api.

Notes générales
- Format: JSON
- Authentification: JWT Bearer (Authorization: Bearer <token>) pour tous les endpoints protégés
- Statuts d’erreur communs:
  - 400 Bad Request: Validation des données échouée
  - 401 Unauthorized: Jeton manquant ou invalide
  - 404 Not Found: Ressource introuvable
  - 409 Conflict: Conflit (ex: email déjà utilisé)

Sommaire
1. Authentification (Auth)
2. Utilisateurs (Users)
3. Listes (Lists)
4. Cartes (Cards)
5. Santé (Health)

1) Authentification (Auth)
- POST /auth/register
  - Description: Inscription d’un nouvel utilisateur
  - Auth: Aucune
  - Corps (JSON requis): { email: string (email), password: string (min 8), roles?: string[] }
  - Réponses:
    - 201 Created: { id, email, roles, createdAt, updatedAt }
    - 400 Bad Request: erreurs de validation
    - 409 Conflict: email déjà utilisé
  - Exemple requête:
    POST /auth/register
    { "email": "user@example.com", "password": "Password123!" }
  - Exemple réponse 201:
    { "id": "...", "email": "user@example.com", "roles": ["user"], "createdAt": "...", "updatedAt": "..." }

- POST /auth/login
  - Description: Connexion et obtention d’un JWT
  - Auth: Aucune
  - Corps (JSON requis): { email: string (email), password: string (min 8) }
  - Réponses:
    - 200 OK: { access_token: string, user: { id, email, roles, createdAt, updatedAt } }
    - 400 Bad Request: erreurs de validation
    - 401 Unauthorized: identifiants invalides
  - Exemple requête:
    POST /auth/login
    { "email": "user@example.com", "password": "Password123!" }
  - Exemple réponse 200:
    { "access_token": "<jwt>", "user": { "id": "...", "email": "user@example.com", "roles": ["user"] } }

2) Utilisateurs (Users)
- POST /users
  - Description: Créer un utilisateur (endpoint public)
  - Auth: Aucune
  - Corps (JSON requis): { email: string, password: string (min 8), roles?: string[] }
  - Réponses:
    - 201 Created: { id, email, roles, createdAt, updatedAt }
    - 400 Bad Request: validation
    - 409 Conflict: email déjà utilisé
  - Exemple requête:
    POST /users
    { "email": "new@example.com", "password": "Password123!" }

- GET /users
  - Description: Lister les utilisateurs
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: Array<{ id, email, roles, createdAt, updatedAt }>
    - 401 Unauthorized

- GET /users/:id
  - Description: Récupérer un utilisateur par id
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: { id, email, roles, createdAt, updatedAt }
    - 401 Unauthorized
    - 404 Not Found

- PATCH /users/:id
  - Description: Mettre à jour un utilisateur
  - Auth: Bearer JWT
  - Corps (JSON): { email?: string, password?: string (min 8), roles?: string[] }
  - Réponses:
    - 200 OK: utilisateur mis à jour
    - 400 Bad Request: validation
    - 401 Unauthorized
    - 404 Not Found

- DELETE /users/:id
  - Description: Supprimer un utilisateur
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: corps vide
    - 401 Unauthorized
    - 404 Not Found

3) Listes (Lists)
Tous les endpoints Lists nécessitent un JWT valide.

- POST /lists
  - Description: Créer une liste
  - Auth: Bearer JWT
  - Corps (JSON requis): { title: string (min 1) }
  - Réponses:
    - 201 Created: { id, title, createdAt, updatedAt }
    - 400 Bad Request: validation
    - 401 Unauthorized

- GET /lists
  - Description: Lister toutes les listes
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: Array<{ id, title, createdAt, updatedAt }>
    - 401 Unauthorized

- GET /lists/:id
  - Description: Récupérer une liste par id
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: { id, title, createdAt, updatedAt }
    - 401 Unauthorized
    - 404 Not Found

- PATCH /lists/:id
  - Description: Mettre à jour une liste (titre)
  - Auth: Bearer JWT
  - Corps (JSON): { title?: string (min 1) }
  - Réponses:
    - 200 OK: liste mise à jour
    - 400 Bad Request
    - 401 Unauthorized
    - 404 Not Found

- DELETE /lists/:id
  - Description: Supprimer une liste
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK
    - 401 Unauthorized
    - 404 Not Found

4) Cartes (Cards)
Endpoints imbriqués sous une liste. Tous nécessitent un JWT valide.

- POST /lists/:listId/cards
  - Description: Créer une carte dans une liste
  - Auth: Bearer JWT
  - Corps (JSON requis): { title: string (min 1), description?: string, position?: number (>= 0) }
  - Réponses:
    - 201 Created: { id, title, description?, position, listId?, createdAt, updatedAt }
    - 400 Bad Request: validation
    - 401 Unauthorized
    - 404 Not Found: liste introuvable

- GET /lists/:listId/cards
  - Description: Lister les cartes d’une liste
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: Array<{ id, title, description?, position, createdAt, updatedAt }>
    - 401 Unauthorized
    - Remarque: si la liste est inexistante, le tableau peut être vide

- GET /lists/:listId/cards/:cardId
  - Description: Récupérer une carte par id dans une liste
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK: { id, title, description?, position, createdAt, updatedAt }
    - 401 Unauthorized
    - 404 Not Found: carte introuvable

- PATCH /lists/:listId/cards/:cardId
  - Description: Mettre à jour une carte
  - Auth: Bearer JWT
  - Corps (JSON): { title?: string (min 1), description?: string, position?: number (>= 0) }
  - Réponses:
    - 200 OK: carte mise à jour
    - 400 Bad Request
    - 401 Unauthorized
    - 404 Not Found

- DELETE /lists/:listId/cards/:cardId
  - Description: Supprimer une carte
  - Auth: Bearer JWT
  - Réponses:
    - 200 OK
    - 401 Unauthorized
    - 404 Not Found

5) Santé (Health)
- GET /health/db
  - Description: Vérifie la connexion à la base de données
  - Auth: Aucune
  - Réponses:
    - 200 OK: état de la connexion

Exemples d’erreurs
- 400 Validation (ex: titre vide):
  {
    "statusCode": 400,
    "message": ["title should not be empty"],
    "error": "Bad Request"
  }
- 401 Unauthorized (manque de token):
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
- 404 Not Found:
  {
    "statusCode": 404,
    "message": "User not found"
  }
- 409 Conflict (email):
  {
    "statusCode": 409,
    "message": "Email already in use"
  }

Swagger
- L’interface Swagger est exposée à /api et documente automatiquement les schémas, paramètres et codes de réponse pour chaque endpoint.