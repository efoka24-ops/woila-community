# Exemples de Requêtes API - Woila Community Backend

## Variables
```
BASE_URL=http://localhost:5000/api
```

## 1. AUTHENTIFICATION

### Enregistrement
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Doe"
}
```

### Connexion
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Réponse:
{
  "message": "Connexion réussie",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Récupérer le profil
```bash
GET /auth/me
Authorization: Bearer <token>
```

---

## 2. MEMBRES/ADHÉSION

### Créer une adhésion
```bash
POST /members
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+237123456789",
  "company": "Tech Company",
  "activitySector": "Technology",
  "city": "Garoua"
}
```

### Récupérer tous les membres
```bash
GET /members
```

### Récupérer un membre
```bash
GET /members/{id}
```

### Mettre à jour un membre
```bash
PUT /members/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "+237987654321"
}
```

### Supprimer un membre
```bash
DELETE /members/{id}
Authorization: Bearer <token>
```

---

## 3. BLOG/ACTUALITÉS

### Créer un article
```bash
POST /blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mon Article",
  "summary": "Résumé de l'article",
  "content": "Contenu complet de l'article...",
  "category": "Annonce",
  "image_url": "/images/blog/post.jpg"
}
```

### Récupérer les articles publiés
```bash
GET /blog
```

### Récupérer un article
```bash
GET /blog/{id}
```

### Mettre à jour un article
```bash
PUT /blog/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Titre Modifié",
  "content": "Contenu modifié..."
}
```

### Publier un article
```bash
POST /blog/{id}/publish
Authorization: Bearer <token>
```

### Supprimer un article
```bash
DELETE /blog/{id}
Authorization: Bearer <token>
```

---

## 4. ÉVÉNEMENTS

### Créer un événement
```bash
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Formation Digital",
  "description": "Description de la formation",
  "date": "2025-12-28T09:00:00Z",
  "location": "Garoua",
  "city": "Garoua",
  "category": "Formation",
  "capacity": 50,
  "image_url": "/images/events/digital.jpg"
}
```

### Récupérer les événements
```bash
GET /events
```

### Récupérer un événement
```bash
GET /events/{id}
```

### S'inscrire à un événement
```bash
POST /events/{id}/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "Jean",
  "lastName": "Doe"
}
```

### Mettre à jour un événement
```bash
PUT /events/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Formation Digital 2026",
  "capacity": 100
}
```

### Supprimer un événement
```bash
DELETE /events/{id}
Authorization: Bearer <token>
```

---

## 5. CONTACT

### Envoyer un message
```bash
POST /contact
Content-Type: application/json

{
  "name": "Jean Doe",
  "email": "jean@example.com",
  "phone": "+237123456789",
  "subject": "Question",
  "message": "Contenu du message..."
}
```

### Récupérer tous les messages (admin)
```bash
GET /contact
Authorization: Bearer <token>
```

### Marquer comme lu
```bash
PUT /contact/{id}/read
Authorization: Bearer <token>
```

### Supprimer un message
```bash
DELETE /contact/{id}
Authorization: Bearer <token>
```

---

## NOTES

- Remplacez `<token>` par le token JWT reçu lors de la connexion
- Remplacez `{id}` par l'ID réel de la ressource
- Le serveur retourne des erreurs avec les codes HTTP appropriés (400, 401, 404, 500)
- Tous les timestamps sont au format ISO 8601
