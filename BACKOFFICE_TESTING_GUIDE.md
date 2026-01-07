# 🧪 Guide de Test - Back Office CRUD Operations

## ✅ Vérification de la Persistance des Données

Suivez ce guide pour tester que les opérations CRUD sont bien sauvegardées en base de données (fichiers JSON) et que les mises à jour ne sont pas écrasées.

---

## 📋 Architecture de Persistance

### Structure des Données
```
backend/data/
├── users.json      → Authentification admin
├── members.json    → Liste des adhésions
├── blog.json       → Articles de blog
├── events.json     → Événements
├── contact.json    → Messages de contact
└── gallery.json    → Galerie d'images
```

### Logique de Sauvegarde
```javascript
// ✅ Spread operator conserve les données existantes
data.items[index] = {
  ...data.items[index],  // Garde les champs existants
  ...req.body,           // Applique les mises à jour
  updatedAt: new Date()  // Ajoute timestamp
}
```

---

## 🔐 Étape 1: Authentification

### URL
```
http://localhost:5173/admin/login
```

### Identifiants
```
Email: admin@woila.com
Mot de passe: Admin@123
```

### ✅ Test Réussi
- Token JWT sauvegardé en localStorage
- Redirection vers `/admin/dashboard`
- Sidebar visible avec navigation

---

## 👥 Étape 2: Test Members CRUD

### 2.1 CREATE (Ajouter Membre)
1. Accédez à `/admin/members`
2. Cliquez sur **"+ Add Member"**
3. Remplissez le formulaire:
   ```
   Prénom: Test
   Nom: Member
   Email: test@woila.com
   Téléphone: +237671234567
   Entreprise: TechStart
   Ville: Garoua
   ```
4. Cliquez **"Create Member"**

**✅ Vérification:**
- Message de succès affiché
- Nouveau membre apparaît dans la liste
- Vérifie `backend/data/members.json` - la nouvelle entrée est sauvegardée

### 2.2 UPDATE (Modifier Membre)
1. Cliquez sur bouton **"Edit"** d'un membre existant
2. Modifiez un champ (ex: ville)
3. Cliquez **"Update Member"**

**✅ Vérification:**
- Modification visible immédiatement
- Autres champs conservés (test dans JSON)
- updatedAt timestamp créé

### 2.3 DELETE (Supprimer Membre)
1. Cliquez **"Delete"** sur un membre
2. Confirmez la suppression

**✅ Vérification:**
- Membre disparu de la liste
- Vérifiez JSON - entrée complètement supprimée

### 2.4 SEARCH (Recherche)
1. Tapez dans le champ de recherche
2. La liste se filtre en temps réel

---

## 📝 Étape 3: Test Blog CRUD

### 3.1 CREATE (Créer Article)
1. Allez à `/admin/blog`
2. Cliquez **"+ New Article"**
3. Remplissez:
   ```
   Titre: Test Article
   Résumé: Résumé du test
   Contenu: Contenu complet de l'article...
   Catégorie: Event
   Image URL: https://example.com/image.jpg
   ```
4. Cliquez **"Create Article"**

**✅ Vérification:**
- Article créé avec statut **Draft**
- Vérifie dans `blog.json` - published: false

### 3.2 UPDATE (Modifier Article)
1. Cliquez **"Edit"** sur un article
2. Modifiez le titre
3. Cliquez **"Update Article"**

**✅ Vérification:**
- Titre mis à jour
- updatedAt changé mais createdAt préservé
- Autres champs intacts

### 3.3 PUBLISH (Publier Article)
1. Cliquez **"Publish"** sur un article Draft
2. Badge passe de "Draft" à "Published"

**✅ Vérification:**
- published: true dans JSON
- Bouton devient "Unpublish"

### 3.4 FILTER (Filtrage)
1. **Filtre par catégorie**: Sélectionnez une catégorie
2. **Filtre par statut**: Tous, Published, Draft
3. **Recherche**: Tapez un mot du titre

**✅ Vérification:**
- Résultats filtrés correctement
- Combinaison de filtres fonctionne

### 3.5 DELETE (Supprimer Article)
1. Cliquez **"Delete"**
2. Confirmez

---

## 📅 Étape 4: Test Events CRUD

### 4.1 CREATE (Créer Événement)
1. Allez à `/admin/events`
2. Cliquez **"+ New Event"**
3. Remplissez:
   ```
   Titre: Formation Test
   Description: Description détaillée...
   Date/Heure: 2026-02-15T09:00
   Lieu: Garoua
   Capacité: 50
   Catégorie: Training
   ```

**✅ Vérification:**
- Événement sauvegardé dans `events.json`
- ID unique généré

### 4.2 UPDATE (Modifier Événement)
1. Cliquez **"Edit"**
2. Changez la capacité (ex: 100)
3. Confirmez

**✅ Vérification:**
- Capacité mise à jour
- Date/lieu préservés

### 4.3 DELETE (Supprimer)
1. Cliquez **"Delete"**
2. Confirmez

---

## 💬 Étape 5: Test Messages

### 5.1 VIEW Messages
1. Allez à `/admin/messages`
2. Voir la liste des messages (si présents du formulaire Contact)

**✅ Vérification:**
- Messages affichés avec statut
- Non lus en jaune

### 5.2 MARK READ
1. Sélectionnez un message
2. Cliquez **"Mark Read"**

**✅ Vérification:**
- Status changé de "unread" à "read"
- Couleur d'arrière-plan change
- JSON mis à jour: status: "read"

### 5.3 DELETE Message
1. Cliquez **"Delete"**
2. Confirmez

---

## 🔄 Étape 6: Persistance Multi-Session

### Test Critique!
1. Créez plusieurs éléments (members, articles, events)
2. **Fermer le navigateur complètement**
3. **Redémarrer le navigateur**
4. Allez à `http://localhost:5173/admin/login`
5. Connectez-vous à nouveau

**✅ Vérification:**
- **Tous les éléments créés sont toujours là**
- Aucune donnée perdue
- Les modifications persistent

---

## 🔍 Vérification JSON (Côté Backend)

### Vérifier dans les fichiers JSON
```bash
# Ouvrir un terminal et vérifier les fichiers
cd backend/data

# Vérifier members.json
type members.json

# Vérifier blog.json
type blog.json

# Vérifier events.json
type events.json
```

### Structure Attendue
```json
{
  "items": [
    {
      "id": "item_1234567890",
      "title": "...",
      "createdAt": "2026-01-07T...",
      "updatedAt": "2026-01-07T...",
      "status": "active"
    }
  ]
}
```

---

## ⚠️ Dépannage

### Problème: Les données ne persistent pas
**Solutions:**
- Vérifier que le backend est en cours d'exécution
- Vérifier le fichier JSON a les permissions en écriture
- Vérifier la console du navigateur pour les erreurs API
- Vérifier la console backend pour les erreurs de sauvegarde

### Problème: Erreur 401 lors de CREATE/UPDATE/DELETE
**Solutions:**
- Vous devez être authentifié
- Le token JWT peut être expiré (7 jours)
- Se reconnecter

### Problème: Doublons dans la base
**Solutions:**
- Les IDs sont uniques (générés avec `Date.now()`)
- Chaque opération crée une nouvelle entrée
- Les UPDATE modifient l'entrée existante sans doublon

---

## ✨ Checklist de Succès

- [ ] Login avec identifiants fonctionne
- [ ] Créer membre → sauvegardé en JSON
- [ ] Modifier membre → mise à jour sans perte
- [ ] Créer article → saved en draft
- [ ] Publier article → toggle status
- [ ] Créer événement → capacité conservée
- [ ] Marquer message comme lu → status change
- [ ] Fermer/rouvrir navigateur → tout persiste
- [ ] Filtres/recherches fonctionnent
- [ ] Delete supprime complètement

---

## 📡 Endpoints Backend Utilisés

### Admin Auth
```
POST   /api/auth/login
```

### Members
```
POST   /api/members           → Create
GET    /api/members           → List all
GET    /api/members/:id       → Get one
PUT    /api/members/:id       → Update
DELETE /api/members/:id       → Delete
```

### Blog
```
POST   /api/blog              → Create
GET    /api/blog?search=...   → List with filters
PUT    /api/blog/:id          → Update
POST   /api/blog/:id/publish  → Toggle publish
DELETE /api/blog/:id          → Delete
```

### Events
```
POST   /api/events            → Create
GET    /api/events?search=... → List all
PUT    /api/events/:id        → Update
DELETE /api/events/:id        → Delete
```

### Messages
```
GET    /api/contact           → List all
PUT    /api/contact/:id/read  → Mark as read
DELETE /api/contact/:id       → Delete
```

---

## 🎯 Résultat Attendu

Après les tests:
- ✅ **Aucune perte de données**
- ✅ **Mises à jour intelligentes** (fusion, pas écrasement)
- ✅ **Persistance entre sessions**
- ✅ **IDs uniques pour chaque élément**
- ✅ **Timestamps pour créé/modifié**
- ✅ **Filtrage/recherche fonctionnels**

---

**Créé:** 7 janvier 2026
**Version:** 1.0
**Status:** 🚀 Ready to Test
