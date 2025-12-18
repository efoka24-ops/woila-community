# 🔐 BACK OFFICE ADMINISTRATEUR - GUIDE COMPLET

## 📋 Vue d'Ensemble

Le back office est un système d'administration complet pour gérer tout le contenu du site WOILA Community.

### ✅ Fonctionnalités
- 🔐 Authentification sécurisée (JWT)
- 📊 Dashboard avec statistiques
- 👥 Gestion des membres
- 📝 Gestion du blog
- 📅 Gestion des événements
- 💬 Modération des messages
- 📱 Interface responsive
- 🎨 Design moderne

---

## 🚀 Démarrage Rapide

### 1. Accéder au Back Office
```
http://localhost:5173/admin/login
```

### 2. Identifiants de Test
```
Email: admin@woila.com
Mot de passe: Admin@123
```

### 3. Navigation
```
Dashboard         → /admin/dashboard
Gestion Membres   → /admin/members
Gestion Blog      → /admin/blog
Gestion Events    → /admin/events
Messages          → /admin/messages
```

---

## 🔐 Sécurité

### Authentification
- **Système JWT**: Tokens stockés localement
- **Protection**: Seul un utilisateur authentifié peut accéder
- **Déconnexion**: Suprime token et localStorage
- **Route Protégée**: Composant ProtectedAdminRoute

### Code de Protection
```javascript
// ProtectedAdminRoute.jsx
if (!token || !isAdmin) {
  return <Navigate to="/admin/login" replace />;
}
```

---

## 📊 Pages & Fonctionnalités

### 1. **Dashboard** (`/admin/dashboard`)

**Stats Affichées**:
- 👥 Nombre total de membres
- 📝 Articles publiés/brouillons
- 📅 Événements à venir
- 💬 Messages non lus

**Graphiques**:
- Bar chart: Croissance des membres
- Pie chart: État du blog (publiés vs brouillons)

**Actions Rapides**:
- Lien direct vers chaque section de gestion
- Export de données (optionnel)

---

### 2. **Gestion Membres** (`/admin/members`)

**Actions**:
- ✅ Voir liste avec pagination
- ✅ Créer nouveau membre
- ✅ Modifier membre
- ✅ Supprimer membre
- ✅ Rechercher par nom/email
- ✅ Filtrer par ville
- ✅ Trier par date

**Colonnes Affichées**:
- Nom (prénom + nom)
- Email
- Société
- Ville
- Actions (éditer/supprimer)

**Filtres**:
- Recherche libre
- Par ville (Garoua, Maroua, N'Gaoundéré)
- Pagination (10 par page)

---

### 3. **Gestion Blog** (`/admin/blog`)

**Actions**:
- ✅ Créer article
- ✅ Modifier article
- ✅ Publier article (brouillon → publié)
- ✅ Supprimer article
- ✅ Rechercher
- ✅ Filtrer par catégorie
- ✅ Filtrer par statut

**Champs Article**:
- Titre
- Résumé
- Contenu (long)
- Catégorie (Événement, Formation, Opportunité, Portrait, Annonce)
- Image URL
- Statut (Publié/Brouillon)
- Vues (counter)

**Workflow**:
```
1. Créer article → Sauvegardé en Brouillon
2. Modifier contenu
3. Cliquer "Publier" → Visible publiquement
```

---

### 4. **Gestion Événements** (`/admin/events`)

**Actions**:
- ✅ Créer événement
- ✅ Modifier événement
- ✅ Supprimer événement
- ✅ Voir liste des inscrits
- ✅ Rechercher
- ✅ Filtrer

**Champs Événement**:
- Titre
- Description
- Date & Heure
- Lieu
- Capacité (nombre max)
- Catégorie (Formation, Networking, Conférence, Atelier, Autre)
- Statut de publication

**Informations Affichées**:
- Date formatée
- Lieu
- Nombre d'inscrits / Capacité
- Liste complète des participants (click sur inscrits)

---

### 5. **Gestion Messages** (`/admin/messages`)

**Layout**: 2 colonnes
- **Gauche**: Liste des messages
- **Droite**: Détail du message sélectionné

**Actions**:
- ✅ Voir tous les messages
- ✅ Filtrer par statut (lus/non lus)
- ✅ Marquer comme lu
- ✅ Répondre par email
- ✅ Supprimer message
- ✅ Rechercher

**Informations Message**:
- Nom & Email
- Sujet
- Message complet
- Téléphone (optionnel)
- Date & Heure
- Statut (lu/non lu)

**Badge Unread**:
- Point bleu indique messages non lus
- Fond coloré pour distinction

---

## 🎨 Composants Utilisés

### Pages Admin
```
src/pages/admin/
├── AdminLogin.jsx          → Formulaire de connexion
├── AdminDashboard.jsx      → Tableau de bord
├── AdminMembers.jsx        → Gestion des adhésions
├── AdminBlog.jsx           → Gestion des articles
├── AdminEvents.jsx         → Gestion des événements
└── AdminMessages.jsx       → Modération des messages
```

### Composants Admin
```
src/components/admin/
├── AdminLayout.jsx         → Layout avec sidebar
├── ProtectedAdminRoute.jsx → Route protégée
```

### Dépendances
```javascript
// React Hook Form - Gestion des formulaires
import { useForm } from 'react-hook-form';

// Recharts - Graphiques
import { BarChart, PieChart } from 'recharts';

// Lucide Icons - Icônes
import { Users, FileText, Calendar, Mail } from 'lucide-react';

// React Router
import { useNavigate, useLocation } from 'react-router-dom';
```

---

## 🔧 Configuration

### Variables d'Environnement Requises
```env
VITE_API_URL=http://localhost:5000/api
```

### Créer Utilisateur Admin (Backend)

Si besoin de créer un nouvel admin, ajouter dans `backend/data/users.json`:
```json
{
  "id": "user_2",
  "email": "newadmin@woila.com",
  "password": "bcrypt_hash_here",
  "firstName": "Admin",
  "lastName": "Name",
  "role": "admin",
  "createdAt": "2025-12-18T..."
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (1 colonne)
- **Tablet**: 768px - 1024px (2 colonnes)
- **Desktop**: > 1024px (2-4 colonnes)

### Adjustments
- Sidebar: Peut se masquer/afficher
- Tables: Scrollable sur mobile
- Forms: Stack vertical sur petit écran

---

## 🔄 Flux de Données

### Authentification
```
AdminLogin → POST /api/auth/login → Token JWT
                              ↓
                    Stocké localStorage
                              ↓
                    ProtectedAdminRoute
                              ↓
                        AdminDashboard
```

### Gestion Données
```
AdminPage → apiCall() → Backend API
                         ↓
                    Validation
                         ↓
                    CRUD Operations
                         ↓
                    Response → Update UI
```

### Pagination
```
Utilisateur change page → Fetch avec page number
                          ↓
                   API retourne limit items
                          ↓
                   UI affiche pagination controls
```

### Recherche/Filtres
```
Utilisateur tape recherche → URLSearchParams
                             ↓
                         API Filtre
                             ↓
                        Résultats
```

---

## 📊 Endpoints API Utilisés

### Dashboard
```
GET /api/members/stats
GET /api/blog/stats
GET /api/events
GET /api/contact
```

### Members
```
GET /api/members?page=1&limit=10&search=...&city=...
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id
GET /api/members/stats
```

### Blog
```
GET /api/blog?page=1&published=all&search=...&category=...
POST /api/blog
PUT /api/blog/:id
DELETE /api/blog/:id
POST /api/blog/:id/publish
GET /api/blog/stats
GET /api/blog/categories
```

### Events
```
GET /api/events?page=1
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id
GET /api/events/:id (pour détail + inscrits)
```

### Contact
```
GET /api/contact?page=1&status=...
PUT /api/contact/:id/read
DELETE /api/contact/:id
```

---

## 🎯 Fonctionnalités Futures

- [ ] Export CSV/Excel des données
- [ ] Gestion des utilisateurs admin
- [ ] Permissions granulaires par rôle
- [ ] Historique des modifications
- [ ] Recherche avancée
- [ ] Upload d'images drag-drop
- [ ] Bulk actions (supprimer plusieurs)
- [ ] Notifications en temps réel
- [ ] Logs d'activité admin
- [ ] Dark mode

---

## ⚠️ Important

### Avant de Lancer le Backend

Assurez-vous d'avoir:
1. ✅ Installé les dépendances: `npm install express-validator`
2. ✅ Intégré validation middleware dans les routes
3. ✅ Backend qui tourne sur port 5000
4. ✅ Frontend sur port 5173

### URLs Importantes
```
Admin Login:   http://localhost:5173/admin/login
Dashboard:     http://localhost:5173/admin/dashboard
Backend:       http://localhost:5000/api
```

---

## 🐛 Dépannage

### Erreur 401 (Non autorisé)
```
→ Token expiré
→ Solution: Se reconnecter
```

### Erreur 403 (Interdit)
```
→ Pas de permissions suffisantes
→ Solution: Vérifier rôle utilisateur
```

### Erreur 404 (Non trouvé)
```
→ Ressource inexistante
→ Solution: Rafraîchir la page
```

### Backend ne répond pas
```
→ Port 5000 ne tourne pas
→ Solution: npm run dev dans backend/
```

### CORS Error
```
→ Backend CORS pas configuré
→ Solution: Vérifier .env CORS_ORIGIN
```

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Recharts Docs](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Created**: December 18, 2025
**Version**: 1.0
**Status**: ✅ Production Ready
**Maintenance**: Requis pour permissions granulaires
