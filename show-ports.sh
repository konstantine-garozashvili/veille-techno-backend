#!/bin/bash

# Script pour afficher les informations des ports et services
echo "🚀 Démarrage des services Kanban Board..."
echo "=================================================="

# Démarrer les services
docker-compose up -d

# Attendre que les services soient prêts
echo ""
echo "⏳ Attente du démarrage des services..."
sleep 5

# Afficher les informations des ports
echo ""
echo "🌐 SERVICES DISPONIBLES"
echo "=================================================="
echo ""
echo "📊 NestJS Kanban API"
echo "   🔗 URL: http://localhost:3001"
echo "   📖 Swagger: http://localhost:3001/api"
echo "   📋 GraphQL Playground: http://localhost:3001/graphql"
echo ""
echo "🗄️  PostgreSQL Database"
echo "   🔗 Host: localhost:5432"
echo "   📊 Database: kanban_api"
echo "   👤 User: kanban_user"
echo ""
echo "🔧 pgAdmin (Database Management)"
echo "   🔗 URL: http://localhost:5050"
echo "   📧 Email: admin@example.com"
echo "   🔑 Password: admin"
echo ""
echo "=================================================="

# Vérifier l'état des conteneurs
echo ""
echo "📋 ÉTAT DES CONTENEURS"
echo "=================================================="
docker-compose ps

echo ""
echo "✅ Tous les services sont démarrés !"
echo "💡 Utilisez 'docker-compose logs -f' pour voir les logs en temps réel"
echo "🛑 Utilisez 'docker-compose down' pour arrêter tous les services"