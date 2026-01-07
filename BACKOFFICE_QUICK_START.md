# 🚀 Quick Start - Back Office Complet

## ⚡ 5 Minutes pour Tester

### 1️⃣ Démarrer Backend & Frontend

#### Terminal 1 - Backend
```bash
cd backend
npm start
# ✅ Output: 🚀 Backend Woila Community running on http://localhost:5000
```

#### Terminal 2 - Frontend  
```bash
npm run dev
# ✅ Output: Local: http://localhost:5173
```

---

### 2️⃣ Accéder au Back Office
```
URL: http://localhost:5173/admin/login
```

### 3️⃣ Se Connecter
```
Email: admin@woila.com
Password: Admin@123
```

---

## 📋 Navigation Back Office

### Dashboard
```
http://localhost:5173/admin/dashboard
- Statistiques en temps réel
- Accès rapide aux sections
```

### Members
```
http://localhost:5173/admin/members
- ➕ Créer membre
- ✏️ Modifier
- 🗑️ Supprimer
- 🔍 Rechercher
```

### Blog
```
http://localhost:5173/admin/blog
- ➕ Créer article
- ✏️ Modifier
- 📤 Publier/Dépublier
- 🗑️ Supprimer
- 🔍 Recherche + Filtres
```

### Events
```
http://localhost:5173/admin/events
- ➕ Créer événement
- ✏️ Modifier
- 🗑️ Supprimer
- 🔍 Rechercher
```

### Messages
```
http://localhost:5173/admin/messages
- 👁️ Voir messages
- ✓ Marquer comme lu
- 📧 Répondre (mailto)
- 🗑️ Supprimer
```

---

## 🧪 Test Rapide CRUD

### 1. Créer un Membre
```
1. Allez à /admin/members
2. Cliquez "+ Add Member"
3. Remplissez:
   - Prénom: Test
   - Nom: User
   - Email: test@woila.com
   - Téléphone: +237671234567
   - Entreprise: TestCo
   - Ville: Garoua
4. Cliquez "Create Member"
5. ✅ Membre apparaît dans la liste
6. ✅ Sauvegardé dans backend/data/members.json
```

### 2. Modifier le Membre
```
1. Cliquez "Edit" sur le membre créé
2. Changez la ville en "Maroua"
3. Cliquez "Update Member"
4. ✅ Mise à jour visible
5. ✅ Autres champs préservés en JSON
```

### 3. Créer un Article
```
1. Allez à /admin/blog
2. Cliquez "+ New Article"
3. Remplissez:
   - Titre: Premier Article
   - Résumé: Un article de test
   - Contenu: Contenu complet...
   - Catégorie: Event
   - Image URL: https://example.com/img.jpg
4. Cliquez "Create Article"
5. ✅ Article en statut "Draft"
6. ✅ Sauvegardé dans blog.json
```

### 4. Publier l'Article
```
1. Cliquez "Publish" sur l'article
2. ✅ Statut devient "Published"
3. ✅ published: true dans blog.json
4. ✅ Contenu intègre reste identique
```

### 5. Créer un Événement
```
1. Allez à /admin/events
2. Cliquez "+ New Event"
3. Remplissez:
   - Titre: Conférence Test
   - Description: Description...
   - Date/Heure: 2026-02-28T09:00
   - Lieu: Garoua
   - Capacité: 50
   - Catégorie: Conference
4. Cliquez "Create Event"
5. ✅ Événement créé
6. ✅ Sauvegardé dans events.json
```

### 6. Supprimer un Élément
```
1. Cliquez "Delete" sur n'importe quel élément
2. Confirmez la suppression
3. ✅ Élément disparu de la liste
4. ✅ Supprimé de la base de données JSON
```

---

## 🔍 Vérifier la Persistance

### Ouvrir les Fichiers JSON
```
backend/data/members.json    ← Voir les membres créés
backend/data/blog.json       ← Voir les articles
backend/data/events.json     ← Voir les événements
backend/data/contact.json    ← Voir les messages
```

### Exemple de Contenu JSON
```json
{
  "members": [
    {
      "id": "member_1704627890123",
      "firstName": "Test",
      "lastName": "User",
      "email": "test@woila.com",
      "phone": "+237671234567",
      "company": "TestCo",
      "city": "Garoua",
      "status": "active",
      "createdAt": "2026-01-07T11:31:30Z",
      "updatedAt": "2026-01-07T11:32:00Z"
    }
  ]
}
```

---

## 🔐 Sécurité

### Token JWT
- Durée: 7 jours
- Stocké: localStorage
- Utilisé: Requêtes API admin

### Routes Protégées
- `/admin/login` - Public (authentification)
- `/admin/dashboard` - Protégée (JWT requis)
- `/admin/members` - Protégée
- `/admin/blog` - Protégée
- `/admin/events` - Protégée
- `/admin/messages` - Protégée

### Déconnexion
```
1. Cliquez "Logout" (bouton rouge)
2. Token supprimé de localStorage
3. Redirection vers /admin/login
```

---

## 📊 Endpoints API Utilisés

### Auth
```
POST /api/auth/login
GET  /api/auth/me
```

### Members
```
POST   /api/members
GET    /api/members
GET    /api/members/:id
PUT    /api/members/:id
DELETE /api/members/:id
```

### Blog
```
POST   /api/blog
GET    /api/blog
PUT    /api/blog/:id
POST   /api/blog/:id/publish
DELETE /api/blog/:id
```

### Events
```
POST   /api/events
GET    /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Messages
```
GET    /api/contact
PUT    /api/contact/:id/read
DELETE /api/contact/:id
```

---

## ⚠️ Dépannage Rapide

### Erreur: "ERR_CONNECTION_REFUSED"
```
✅ Solution: Vérifier que le backend est lancé
npm start (dans le dossier backend)
```

### Erreur: "401 Unauthorized"
```
✅ Solution: Token expiré ou identifiants incorrects
- Se reconnecter
- Vérifier email/password
```

### Les données ne persistent pas
```
✅ Solutions:
1. Vérifier backend/data/*.json exist
2. Vérifier permissions fichiers (writable)
3. Redémarrer le backend
4. Vérifier console pour erreurs
```

### Page blanche
```
✅ Solutions:
1. Rafraîchir la page (Ctrl+F5)
2. Vérifier que le frontend tourne
3. Vérifier console pour erreurs JS
```

---

## 📈 Statistiques

### Dashboard Affiche:
- 👥 Nombre total de members
- 📝 Articles (publiés + brouillons)
- 📅 Événements total
- 💬 Messages

### Chaque Section:
- **Members**: Pagination 10/page, Recherche, Filtres
- **Blog**: Recherche, Filtrage catégorie/statut
- **Events**: Recherche, Affichage date/lieu/capacité
- **Messages**: Filtrage lu/non lu, Détail complet

---

## 💾 Base de Données

### Format JSON
```
Tous les fichiers sont au format JSON
Sauvegarde automatique après chaque opération
Pas de serveur DB requis
Fichiers: backend/data/
```

### Structure
```
{
  "members": [ ... ],
  "posts": [ ... ],
  "events": [ ... ],
  "messages": [ ... ],
  "users": [ ... ]
}
```

---

## ✅ Checklist Final

- [ ] Backend lancé sur port 5000
- [ ] Frontend lancé sur port 5173
- [ ] Connexion avec admin@woila.com / Admin@123
- [ ] Dashboard visible
- [ ] Créer un membre
- [ ] Vérifier dans members.json
- [ ] Modifier le membre
- [ ] Vérifier fusion des données
- [ ] Créer un article
- [ ] Publier l'article
- [ ] Créer un événement
- [ ] Supprimer un élément
- [ ] Fermer navigateur
- [ ] Rouvrir - données toujours présentes ✅

---

## 🎯 Prochaines Étapes (Optionnel)

- [ ] Ajouter upload d'images
- [ ] Ajouter validation côté serveur
- [ ] Ajouter logs d'activité
- [ ] Ajouter export CSV
- [ ] Ajouter pagination blog/events
- [ ] Ajouter multi-langue

---

## 📞 Support

### Erreurs Frontend
```
Voir: Developer Console (F12)
Tab: Console pour messages d'erreur
```

### Erreurs Backend
```
Voir: Terminal backend
Logs: Requests + Errors
```

### Erreurs Fichiers
```
Vérifier: backend/data/
Permissions: Lecture/Écriture
Format: JSON valide
```

---

**Status:** ✅ READY TO USE

Créé: 7 janvier 2026
Version: 1.0
Tested: Fully Functional
