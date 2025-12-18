# Woila Community Backend API

Backend API pour le site internet Woila Community - Réseau d'entrepreneurs du Septentrion.

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- MongoDB Atlas account (gratuit)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/efoka24-ops/woila-community.git
cd woila-community/backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations:
- MongoDB URI
- JWT Secret
- Frontend URL
- Stripe keys (optionnel)

4. **Démarrer le serveur**

Pour développement (avec nodemon):
```bash
npm run dev
```

Pour production:
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Récupérer le profil (authentifié)
- `PUT /api/auth/profile` - Mettre à jour le profil (authentifié)

### Blog
- `GET /api/blog` - Lister tous les articles
- `GET /api/blog/:slug` - Récupérer un article
- `POST /api/blog` - Créer un article (authentifié)
- `PUT /api/blog/:id` - Mettre à jour un article (authentifié)
- `DELETE /api/blog/:id` - Supprimer un article (authentifié)

### Events
- `GET /api/events` - Lister tous les événements
- `GET /api/events/:id` - Récupérer un événement
- `POST /api/events` - Créer un événement (authentifié)
- `PUT /api/events/:id` - Mettre à jour un événement (authentifié)
- `DELETE /api/events/:id` - Supprimer un événement (authentifié)

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Récupérer tous les messages (admin)
- `PUT /api/contact/:id/reply` - Répondre à un message (admin)

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans le header:

```
Authorization: Bearer <token>
```

## 📦 Structure du projet

```
backend/
├── src/
│   ├── config/          # Configuration DB, JWT
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Middleware Express
│   ├── models/          # Schémas Mongoose
│   ├── routes/          # Routes API
│   ├── utils/           # Utilitaires
│   └── index.js         # Point d'entrée
├── .env.example         # Variables d'environnement
└── package.json         # Dépendances
```

## 🗄️ Modèles de données

### User
- first_name, last_name
- email, phone
- password (hashé)
- activity_sector, city
- is_member, membership_date
- role (user, admin)

### BlogPost
- title, slug
- summary, content
- category, author
- published, views
- tags

### Event
- title, description
- date, time, location, city
- category, organizer
- image_url, capacity
- published, is_featured

### ContactMessage
- first_name, last_name, email, phone
- subject, message
- status (new, read, replied)
- reply, replied_at

## 🚀 Déploiement

Le backend peut être déployé sur:
- Heroku
- Vercel
- Railway
- AWS
- DigitalOcean

## 📝 License

MIT
