# ⚡ Quick Start - Membership System (5 Minutes)

## 🚀 Démarrer Immédiatement

### **Terminal 1: Backend**
```bash
cd backend
node index.js
```
✅ Vous verrez: `🚀 Backend Woila Community running on http://localhost:5000`

### **Terminal 2: Frontend**
```bash
npm run dev
```
✅ Vous verrez: `Local: http://localhost:5173`

---

## 🧪 Test Rapide (2 minutes)

### **1. Utilisateur - Soumettre une Demande**
1. Ouvrez `http://localhost:5173/membership/register`
2. Remplissez:
   - Nom: `Foka`
   - Prénom: `Emmanuel`
   - Email: `efoka24@gmail.com`
   - Téléphone: `+237678758976`
   - Ville: `N'Gaoundéré`
3. Cliquez "Soumettre ma demande"
4. ✅ Message de succès

### **2. Admin - Approuver la Demande**
1. Ouvrez `http://localhost:5173/admin/login`
2. Entrez:
   - Email: `admin@woila.com`
   - Password: `Admin@123`
3. Cliquez "Connexion"
4. Allez à `http://localhost:5173/admin/membership`
5. Voyez la demande "Emmanuel Foka"
6. Cliquez sur ✅ (Check button)
7. Cliquez "Approuver"
8. ✅ Message de succès, statut = "Approuvée"

### **3. Vérifier les Données**
1. Ouvrez `backend/data/membership_requests.json`
2. Voyez la demande avec `status: "approved"`
3. Ouvrez `backend/data/notifications.json`
4. Voyez l'email de confirmation queued

---

## 📍 URLs Principales

```
Frontend (Public):
  http://localhost:5173/                    - Accueil
  http://localhost:5173/membership          - Page d'adhésion
  http://localhost:5173/membership/register - Formulaire d'inscription

Admin:
  http://localhost:5173/admin/login         - Connexion
  http://localhost:5173/admin/dashboard     - Dashboard
  http://localhost:5173/admin/membership    - Gestion demandes

Backend (API):
  http://localhost:5000/health              - Vérifier API
  http://localhost:5000/api/membership-requests - Voir les demandes
```

---

## 📊 Fichiers de Données

```
backend/data/
  ├── membership_requests.json     ← Les demandes d'inscription
  └── notifications.json           ← Les emails à envoyer
```

---

## 🔑 Credentials par Défaut

```
Admin:
  Email: admin@woila.com
  Password: Admin@123
```

---

## ✨ Fonctionnalités Clés

✅ **Formulaire public** - `/membership/register`
✅ **Panel admin** - `/admin/membership`
✅ **Recherche** - Par nom, email, ville
✅ **Filtres** - Par statut (pending, approved, rejected)
✅ **Actions** - Approuver (✅), Rejeter (❌), Supprimer (🗑️)
✅ **Notifications** - Email queued dans notifications.json
✅ **Authentification** - JWT token

---

## 🐛 Troubleshooting

### **Backend ne démarre pas**
```bash
# Vérifier le port
lsof -i :5000

# Tuer les processus Node
pkill -f node

# Relancer
cd backend && node index.js
```

### **Frontend ne démarre pas**
```bash
# Vérifier les dépendances
npm install

# Relancer
npm run dev
```

### **Erreur "Email déjà enregistré"**
- Utilisez un email différent dans le formulaire
- Ou supprimez la demande existante dans l'admin

### **Admin ne charge pas**
- Vérifiez que le token JWT est en localStorage
- Essayez de vous reconnecter
- Vérifiez le backend répond

---

## 📝 Tester via cURL

```bash
# Créer une demande
curl -X POST http://localhost:5000/api/membership-requests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "phone":"+237600000000",
    "city":"Yaoundé"
  }'

# Voir les demandes (besoin d'un token)
# D'abord login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@woila.com","password":"Admin@123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Puis voir les demandes
curl -X GET http://localhost:5000/api/membership-requests \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Prochaines Étapes

1. **Intégrer un service email** (SendGrid/Mailgun)
   - Voir: `EMAIL_INTEGRATION_GUIDE.md`

2. **Ajouter une validation captcha**
   - Protéger contre le spam

3. **Créer un dashboard statistiques**
   - Voir les demandes par statut
   - Taux d'approbation

4. **Exporter les données**
   - CSV/PDF des demandes

---

## 📚 Documentation Complète

- `MEMBERSHIP_REQUESTS_GUIDE.md` - Guide technique
- `MEMBERSHIP_SYSTEM_COMPLETE.md` - Architecture complète
- `MEMBERSHIP_EXAMPLES.md` - Exemples avec cURL
- `EMAIL_INTEGRATION_GUIDE.md` - Intégration email
- `IMPLEMENTATION_SUMMARY.md` - Résumé complet

---

## ✅ Checklist Rapide

- [ ] Backend démarre
- [ ] Frontend démarre
- [ ] Formulaire accessible
- [ ] Admin accessible
- [ ] Créer une demande
- [ ] Approuver une demande
- [ ] Voir les données sauvegardées

**Une fois cochées = système fonctionnel! 🚀**

---

**Bon test! 🎉**
