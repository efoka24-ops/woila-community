# 🧪 Exemples Pratiques - Gestion des Demandes d'Inscription

## 📍 URLs de Démarrage Rapide

### **Utilisateur Public**
- Page d'adhésion: `http://localhost:5173/membership`
- Formulaire d'inscription: `http://localhost:5173/membership/register`

### **Admin**
- Connexion: `http://localhost:5173/admin/login`
- Gestion demandes: `http://localhost:5173/admin/membership`
- Credentials: `admin@woila.com` / `Admin@123`

---

## 🔥 Scénarios de Test Rapide

### **Scénario 1: Utilisateur Complet**

**Étape 1 - Utilisateur remplit le formulaire**
1. Accédez à `http://localhost:5173/membership/register`
2. Remplissez avec:
   - Nom: `Foka`
   - Prénom: `Emmanuel`
   - Email: `efoka24@gmail.com`
   - Téléphone: `+237678758976`
   - Structure: `Emmanuel Foka SARL`
   - Secteur: `Technologie`
   - Ville: `N'Gaoundéré`
3. Cliquez "Soumettre ma demande"
4. ✅ Message de succès, redirection accueil

**Étape 2 - Admin approuve**
1. Accédez à `http://localhost:5173/admin/membership`
2. Voyez la demande en statut "En attente"
3. Cliquez sur ✅ (bouton vert Check)
4. Modal s'ouvre avec message par défaut
5. (Optionnel) Modifiez le message
6. Cliquez "Approuver"
7. ✅ Demande marquée "Approuvée"
8. 📧 Notification sauvegardée dans `notifications.json`

**Étape 3 - Vérifiez les données**
1. Ouvrez `backend/data/membership_requests.json`
2. Voyez la demande avec status "approved" et approvalDate
3. Ouvrez `backend/data/notifications.json`
4. Voyez le message d'email queued (type: "membership_approval")

---

### **Scénario 2: Rejet avec Raison**

**Étape 1 - Utilisateur remplit le formulaire**
```
Remplissez avec des données différentes:
- Nom: Test
- Prénom: Rejet
- Email: test.rejet@example.com
- ...
```

**Étape 2 - Admin rejette**
1. Accédez à `http://localhost:5173/admin/membership`
2. Cherchez "test.rejet" dans la barre de recherche
3. Cliquez sur ❌ (bouton rouge X)
4. Sélectionnez la raison: `Documents incomplets`
5. Modal affiche le message par défaut
6. (Optionnel) Modifiez le message
7. Cliquez "Rejeter"
8. ✅ Demande marquée "Rejetée"
9. 📧 Notification d'email créée

**Vérification**
- Status = "rejected"
- rejectionReason = "Documents incomplets"
- rejectionDate = timestamp actuel

---

### **Scénario 3: Recherche et Filtrage**

**Test 1 - Recherche par Email**
1. Allez à `/admin/membership`
2. Dans la barre "Rechercher...", tapez `efoka`
3. ✅ Seule la demande contenant cet email s'affiche
4. Effacez la recherche (x)

**Test 2 - Filtrer par Statut**
1. Dans le dropdown "Tous les statuts", sélectionnez `En attente`
2. ✅ Seules les demandes pending s'affichent
3. Sélectionnez `Approuvées`
4. ✅ Seules les approved s'affichent
5. Sélectionnez `Rejetées`
6. ✅ Seules les rejected s'affichent
7. Remettez `Tous les statuts`

**Test 3 - Recherche par Ville**
1. Tapez `Yaoundé` dans la recherche
2. ✅ Seules les demandes de Yaoundé s'affichent

---

### **Scénario 4: Suppression**

**Danger Zone!**
1. Allez à `/admin/membership`
2. Trouvez une demande à supprimer
3. Cliquez sur 🗑️ (bouton trash gris)
4. Une confirmation s'affiche: "Êtes-vous sûr?"
5. Cliquez "OK"
6. ✅ Demande supprimée du tableau
7. Message de succès: "Demande supprimée"
8. Vérifiez dans `membership_requests.json` - elle n'y est plus

---

## 🔌 Exemples cURL pour API

### **1. Créer une Demande (Public)**

```bash
curl -X POST http://localhost:5000/api/membership-requests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+237600123456",
    "structure": "Dupont Business",
    "activitySector": "Commerce",
    "city": "Douala",
    "paymentProofUrl": "blob:test123"
  }'
```

**Réponse (201)**
```json
{
  "message": "Demande d'inscription créée avec succès",
  "request": {
    "id": "mem_1767788500000",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+237600123456",
    "structure": "Dupont Business",
    "activitySector": "Commerce",
    "city": "Douala",
    "paymentProofUrl": "blob:test123",
    "status": "pending",
    "rejectionReason": "",
    "approvalDate": null,
    "rejectionDate": null,
    "createdAt": "2026-01-07T12:30:00.000Z",
    "updatedAt": "2026-01-07T12:30:00.000Z"
  }
}
```

---

### **2. Récupérer Toutes les Demandes (Admin)**

```bash
# Récupérer un token d'abord
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@woila.com","password":"Admin@123"}' \
  | jq -r '.token')

# Puis récupérer les demandes
curl -X GET "http://localhost:5000/api/membership-requests?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200)**
```json
[
  {
    "id": "mem_1767788500000",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+237600123456",
    "structure": "Dupont Business",
    "activitySector": "Commerce",
    "city": "Douala",
    "paymentProofUrl": "blob:test123",
    "status": "pending",
    "createdAt": "2026-01-07T12:30:00.000Z",
    "updatedAt": "2026-01-07T12:30:00.000Z"
  }
]
```

---

### **3. Récupérer une Demande Spécifique (Admin)**

```bash
curl -X GET http://localhost:5000/api/membership-requests/mem_1767788500000 \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200)**
```json
{
  "id": "mem_1767788500000",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+237600123456",
  "structure": "Dupont Business",
  "activitySector": "Commerce",
  "city": "Douala",
  "paymentProofUrl": "blob:test123",
  "status": "pending",
  "createdAt": "2026-01-07T12:30:00.000Z",
  "updatedAt": "2026-01-07T12:30:00.000Z"
}
```

---

### **4. Approuver une Demande (Admin)**

```bash
curl -X POST http://localhost:5000/api/membership-requests/mem_1767788500000/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmationMessage": "Bienvenue Jean! Nous sommes ravi de vous compter parmi nos membres."
  }'
```

**Réponse (200)**
```json
{
  "message": "Demande approuvée et confirmation envoyée",
  "request": {
    "id": "mem_1767788500000",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "status": "approved",
    "approvalDate": "2026-01-07T12:35:00.000Z",
    "updatedAt": "2026-01-07T12:35:00.000Z"
  }
}
```

---

### **5. Rejeter une Demande (Admin)**

```bash
curl -X POST http://localhost:5000/api/membership-requests/mem_1767788500000/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejectionReason": "Paiement non confirmé",
    "rejectionMessage": "Malheureusement, nous ne pouvons pas confirmer votre paiement. Veuillez réessayer."
  }'
```

**Réponse (200)**
```json
{
  "message": "Demande rejetée et notification envoyée",
  "request": {
    "id": "mem_1767788500000",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "status": "rejected",
    "rejectionReason": "Paiement non confirmé",
    "rejectionDate": "2026-01-07T12:36:00.000Z",
    "updatedAt": "2026-01-07T12:36:00.000Z"
  }
}
```

---

### **6. Supprimer une Demande (Admin)**

```bash
curl -X DELETE http://localhost:5000/api/membership-requests/mem_1767788500000 \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (200)**
```json
{
  "message": "Demande supprimée"
}
```

---

## 📊 Paramètres de Requête

### **GET /api/membership-requests**

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `status` | string | Filtrer par statut | `pending`, `approved`, `rejected` |
| `search` | string | Rechercher par nom/email/ville | `efoka`, `jean@example.com` |

**Exemples:**
```bash
# Tous les pending
?status=pending

# Tous les approved
?status=approved

# Recherche "efoka"
?search=efoka

# Combinaison
?status=pending&search=dupont
```

---

## 🧩 Points de Vérification Après Test

### **Frontend Fonctionne**
- ✅ Formulaire accessible sur `/membership/register`
- ✅ Validation des champs
- ✅ Errors affichées correctement
- ✅ Message de succès après soumission
- ✅ Redirection vers accueil

### **Admin Fonctionne**
- ✅ Liste visible sur `/admin/membership`
- ✅ Recherche filtre les demandes
- ✅ Dropdown statuts fonctionne
- ✅ Boutons ✅/❌/🗑️ visibles
- ✅ Modals s'ouvrent
- ✅ Messages de succès s'affichent

### **Backend Fonctionne**
- ✅ Demandes sauvegardées dans JSON
- ✅ Notifications créées
- ✅ IDs uniques générés
- ✅ Timestamps corrects
- ✅ Statuts mis à jour

---

## 🔒 Erreurs Attendues

### **Erreur 400 - Email Déjà Enregistré**
```json
{"error": "Cet email est déjà enregistré"}
```
**Solution**: Utilisez un email différent

### **Erreur 400 - Champs Obligatoires Manquants**
```json
{"error": "Les champs obligatoires sont requis"}
```
**Solution**: Remplissez firstName, lastName, email, phone, city

### **Erreur 404 - Demande Non Trouvée**
```json
{"error": "Demande non trouvée"}
```
**Solution**: Vérifiez que l'ID est correct

### **Erreur 401 - Non Authentifié**
```json
{"error": "Authentification requise"}
```
**Solution**: Passez un token JWT valide en header Authorization

---

## 💾 Fichiers de Données

### **Après une Demande**
**File**: `backend/data/membership_requests.json`
```json
{
  "requests": [
    {
      "id": "mem_1767788491483",
      "firstName": "Emmanuel",
      "lastName": "Foka",
      "email": "efoka24@gmail.com",
      "status": "pending",
      "createdAt": "2026-01-07T12:21:31.483Z"
    }
  ]
}
```

### **Après une Approbation**
**File**: `backend/data/notifications.json`
```json
{
  "notifications": [
    {
      "id": "notif_1767788491500",
      "type": "membership_approval",
      "email": "efoka24@gmail.com",
      "firstName": "Emmanuel",
      "lastName": "Foka",
      "subject": "Bienvenue à Woila Community!",
      "message": "...",
      "status": "pending",
      "createdAt": "2026-01-07T12:21:35.000Z"
    }
  ]
}
```

---

## 🎯 Checklist de Fonctionnement

- [ ] ✅ Formulaire public accessible
- [ ] ✅ Demandes sauvegardées en JSON
- [ ] ✅ Admin voit la liste
- [ ] ✅ Recherche fonctionne
- [ ] ✅ Filtres fonctionnent
- [ ] ✅ Approbation change le status
- [ ] ✅ Notifications créées
- [ ] ✅ Rejet change le status
- [ ] ✅ Suppression retire la demande
- [ ] ✅ Emails queued dans notifications.json

---

**À vous de jouer! Testez tous les scénarios ci-dessus! 🚀**
