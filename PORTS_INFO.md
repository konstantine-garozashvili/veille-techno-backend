# 🚀 Guide de Démarrage - Ports et Services

## 📋 Méthodes de Démarrage

### 🎯 Méthode Recommandée (avec affichage des ports)

#### Pour Windows (PowerShell) :
```powershell
.\show-ports.ps1
```

#### Pour Linux/Mac (Bash) :
```bash
./show-ports.sh
```

### 🔧 Méthode Standard Docker Compose :
```bash
docker-compose up -d
```

## 🌐 Services et Ports Disponibles

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **NestJS API** | 3001 | http://localhost:3001 | API principale Kanban |
| **Swagger UI** | 3001 | http://localhost:3001/api | Documentation API interactive |
| **GraphQL Playground** | 3001 | http://localhost:3001/graphql | Interface GraphQL |
| **PostgreSQL** | 5432 | localhost:5432 | Base de données |
| **pgAdmin** | 5050 | http://localhost:5050 | Interface de gestion DB |

## 🔑 Informations de Connexion

### pgAdmin
- **Email :** admin@example.com
- **Mot de passe :** admin

### PostgreSQL
- **Host :** localhost
- **Port :** 5432
- **Database :** kanban_api
- **User :** kanban_user
- **Password :** kanban_password

## 🛠️ Commandes Utiles

### Voir les logs en temps réel :
```bash
docker-compose logs -f
```

### Voir les logs d'un service spécifique :
```bash
docker-compose logs -f nestjs-api
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### Arrêter tous les services :
```bash
docker-compose down
```

### Redémarrer un service spécifique :
```bash
docker-compose restart nestjs-api
```

### Voir l'état des conteneurs :
```bash
docker-compose ps
```

## 🔍 Vérification des Services

### Tester l'API NestJS :
```bash
curl http://localhost:3001/
```

### Tester la santé de l'API :
```bash
curl http://localhost:3001/health
```

### Accéder à Swagger :
Ouvrez http://localhost:3001/api dans votre navigateur

### Accéder à GraphQL Playground :
Ouvrez http://localhost:3001/graphql dans votre navigateur

## 🚨 Dépannage

### Si un port est déjà utilisé :
1. Vérifiez les processus utilisant le port :
   ```bash
   netstat -ano | findstr :3001
   ```

2. Arrêtez le processus ou changez le port dans docker-compose.yml

### Si les conteneurs ne démarrent pas :
1. Vérifiez les logs :
   ```bash
   docker-compose logs
   ```

2. Redémarrez Docker Desktop

3. Nettoyez les conteneurs :
   ```bash
   docker-compose down --volumes
   docker-compose up -d
   ```