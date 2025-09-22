# Script PowerShell pour afficher les informations des ports et services
Write-Host "🚀 Démarrage des services Kanban Board..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Yellow

# Démarrer les services
docker-compose up -d

# Attendre que les services soient prêts
Write-Host ""
Write-Host "⏳ Attente du démarrage des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Afficher les informations des ports
Write-Host ""
Write-Host "🌐 SERVICES DISPONIBLES" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 NestJS Kanban API" -ForegroundColor Cyan
Write-Host "   🔗 URL: http://localhost:3001" -ForegroundColor White
Write-Host "   📖 Swagger: http://localhost:3001/api" -ForegroundColor White
Write-Host "   📋 GraphQL Playground: http://localhost:3001/graphql" -ForegroundColor White
Write-Host ""
Write-Host "🗄️  PostgreSQL Database" -ForegroundColor Cyan
Write-Host "   🔗 Host: localhost:5432" -ForegroundColor White
Write-Host "   📊 Database: kanban_api" -ForegroundColor White
Write-Host "   👤 User: kanban_user" -ForegroundColor White
Write-Host ""
Write-Host "🔧 pgAdmin (Database Management)" -ForegroundColor Cyan
Write-Host "   🔗 URL: http://localhost:5050" -ForegroundColor White
Write-Host "   📧 Email: admin@example.com" -ForegroundColor White
Write-Host "   🔑 Password: admin" -ForegroundColor White
Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow

# Vérifier l'état des conteneurs
Write-Host ""
Write-Host "📋 ÉTAT DES CONTENEURS" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ Tous les services sont démarrés !" -ForegroundColor Green
Write-Host "💡 Utilisez 'docker-compose logs -f' pour voir les logs en temps réel" -ForegroundColor Yellow
Write-Host "🛑 Utilisez 'docker-compose down' pour arrêter tous les services" -ForegroundColor Yellow