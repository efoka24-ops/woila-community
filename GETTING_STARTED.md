# 🚀 Guide de Démarrage - Woila Community

## Structure du Projet

```
woila-community/
├── src/                  # Frontend React
│   ├── pages/           # Pages du site
│   ├── components/      # Composants React
│   └── config/          # Configuration (API, etc.)
├── backend/             # Backend Node.js/Express
│   ├── controllers/     # Logique métier
│   ├── routes/          # Définition des routes
│   ├── data/            # Base de données JSON
│   └── index.js         # Point d'entrée
├── public/              # Fichiers statiques
└── package.json         # Dépendances frontend
```

## Prérequis

- Node.js 14+ 
- npm ou yarn
- Git

## Installation Complète

### 1. Cloner le projet
```bash
git clone https://github.com/efoka24-ops/woila-community.git
cd woila-community
```

### 2. Installer les dépendances Frontend
```bash
npm install
```

### 3. Installer les dépendances Backend
```bash
cd backend
npm install
cd ..
```

## Lancer le Projet

### Option 1: Lancer frontend et backend séparément

**Terminal 1 - Frontend (React + Vite)**
```bash
npm run dev
# Le site sera accessible sur http://localhost:5173
```

**Terminal 2 - Backend (Express)**
```bash
cd backend
npm run dev
# L'API sera accessible sur http://localhost:5000
```

### Option 2: Lancer tout en un (à partir de la racine)
```bash
# Frontend
npm run dev &

# Backend (dans un nouveau terminal)
cd backend && npm run dev
```

## Configuration

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Woila Community
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=woila-community-secret-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
```

## Vérifier que tout fonctionne

### Frontend
- Allez sur http://localhost:5173
- Vous devez voir le site Woila Community

### Backend
```bash
curl http://localhost:5000/health
# Réponse: {"status":"Backend Woila Community is running!"}
```

## Commandes Utiles

### Frontend
```bash
npm run dev       # Démarrer le serveur de développement
npm run build     # Construire pour la production
npm run preview   # Prévisualiser le build production
```

### Backend
```bash
cd backend
npm run dev       # Démarrer avec nodemon (hot reload)
npm start         # Démarrer sans nodemon
```

## Structure des Données

Les données sont stockées en JSON dans `backend/data/`:
- `users.json` - Utilisateurs et admin
- `members.json` - Adhésions
- `blog.json` - Articles
- `events.json` - Événements
- `gallery.json` - Galerie
- `contact.json` - Messages de contact

## Authentification

### Créer un compte
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Jean",
    "lastName": "Doe"
  }'
```

### Se connecter
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Réponse:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

Utilisez le `token` dans le header `Authorization: Bearer <token>` pour les requêtes protégées.

## Déploiement

### Frontend (Vercel)
```bash
npm run build
# Puis déployer sur Vercel via GitHub
```

### Backend (Heroku)
```bash
cd backend
heroku login
heroku create woila-community-api
git push heroku main
```

## Troubleshooting

### Le frontend ne peut pas atteindre le backend
- Vérifiez que le backend est lancé sur le port 5000
- Vérifiez la variable d'environnement `VITE_API_URL`
- Vérifiez que CORS est correctement configuré dans le backend

### Erreur "Port 5000 already in use"
```bash
# Trouver le processus utilisant le port 5000
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### Réinitialiser les données JSON
Supprimez les fichiers JSON dans `backend/data/` et relancez le serveur pour régénérer les fichiers par défaut.

## Documentation Complète

- Frontend: voir [README.md](./README.md)
- Backend: voir [backend/README.md](./backend/README.md)
- Exemples API: voir [backend/API_EXAMPLES.md](./backend/API_EXAMPLES.md)

## Support

Pour toute question, consultez la documentation ou créez une issue sur GitHub.

---

**Prêt à développer? Lancez le projet et commencez à coder! 🎉**
