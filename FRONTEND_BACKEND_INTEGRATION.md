# 🔗 GUIDE: Connexion Frontend ↔ Backend

## 📌 Architecture Actuelle

```
Frontend (Vite + React)          Backend (Express)
   Port 5173         ←→           Port 5000
   src/config/api.js
   - Gère les appels API
   - Stockage JWT tokens
   - Auto-injection Authorization
```

---

## 📁 Fichier de Configuration

**Localisation**: `src/config/api.js`

```javascript
// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Constantes endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me'
  },
  MEMBERS: {
    CREATE: '/members',
    LIST: '/members',
    GET: (id) => `/members/${id}`,
    UPDATE: (id) => `/members/${id}`,
    DELETE: (id) => `/members/${id}`,
    STATS: '/members/stats'
  },
  BLOG: {
    CREATE: '/blog',
    LIST: '/blog',
    GET: (id) => `/blog/${id}`,
    UPDATE: (id) => `/blog/${id}`,
    PUBLISH: (id) => `/blog/${id}/publish`,
    DELETE: (id) => `/blog/${id}`,
    STATS: '/blog/stats',
    CATEGORIES: '/blog/categories'
  },
  EVENTS: {
    CREATE: '/events',
    LIST: '/events',
    GET: (id) => `/events/${id}`,
    REGISTER: (id) => `/events/${id}/register`,
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`
  },
  CONTACT: {
    CREATE: '/contact',
    LIST: '/contact',
    MARK_READ: (id) => `/contact/${id}/read`,
    DELETE: (id) => `/contact/${id}`
  }
};

// Fonction helper pour appels API
export const apiCall = async (
  endpoint,
  options = {}
) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    ...rest
  } = options;

  // Ajouter le token JWT s'il existe
  const token = localStorage.getItem('token');
  const allHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (token) {
    allHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: allHeaders,
    body: body ? body : null,
    ...rest
  });

  // Gestion des erreurs
  if (response.status === 401) {
    // Token expiré
    localStorage.removeItem('token');
    // Rediriger vers login si nécessaire
    window.location.href = '/login';
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return data;
};
```

---

## 🔐 Authentification

### 1. **Enregistrement**

**Frontend** (src/pages/LoginRegister.jsx):
```javascript
import { apiCall, API_ENDPOINTS } from '../config/api.js';

const handleRegister = async (formData) => {
  try {
    const response = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(formData)
      // {
      //   email: 'user@example.com',
      //   password: 'SecurePass123',
      //   firstName: 'Jean',
      //   lastName: 'Dupont'
      // }
    });

    // Sauvegarder le token
    localStorage.setItem('token', response.data.token);
    
    // Rediriger
    navigate('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 2. **Connexion**

```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    // Sauvegarder le token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Rediriger
    navigate('/dashboard');
  } catch (error) {
    setError(error.message);
  }
};
```

### 3. **Récupérer utilisateur courant**

```javascript
import { useEffect, useState } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api.js';

function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiCall(API_ENDPOINTS.AUTH.ME);
        setUser(response.data);
      } catch (error) {
        // Non authentifié
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
```

---

## 📝 Exemples: Membre (Adhésion)

### Créer une adhésion

**Frontend** (src/pages/Membership.jsx):
```javascript
const handleMembershipSubmit = async (formData) => {
  try {
    const response = await apiCall(API_ENDPOINTS.MEMBERS.CREATE, {
      method: 'POST',
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        activitySector: formData.sector,
        city: formData.city
      })
    });

    if (response.success) {
      setSuccess('Adhésion créée avec succès!');
      resetForm();
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### Récupérer la liste des membres

```javascript
import { useQuery } from '@tanstack/react-query';
import { apiCall, API_ENDPOINTS } from '../config/api.js';

export function useMembers(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: ['members', page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await apiCall(
        `${API_ENDPOINTS.MEMBERS.LIST}?${params}`
      );
      
      return response;
    }
  });
}

// Utilisation dans un composant
function MembersList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMembers(page);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      {data.data.map(member => (
        <div key={member.id}>
          {member.firstName} {member.lastName} - {member.city}
        </div>
      ))}
      
      {/* Pagination */}
      <button 
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      >
        Précédent
      </button>
      <span>Page {page} sur {data.pagination.pages}</span>
      <button 
        onClick={() => setPage(p => p + 1)}
        disabled={page === data.pagination.pages}
      >
        Suivant
      </button>
    </div>
  );
}
```

---

## 📰 Exemples: Blog

### Créer un article

```javascript
const handleCreateArticle = async (articleData) => {
  try {
    const response = await apiCall(API_ENDPOINTS.BLOG.CREATE, {
      method: 'POST',
      body: JSON.stringify({
        title: articleData.title,
        summary: articleData.summary,
        content: articleData.content,
        category: articleData.category,
        imageUrl: articleData.imageUrl
      })
    });

    setSuccess('Article créé en brouillon!');
  } catch (error) {
    setError(error.message);
  }
};
```

### Publier un article

```javascript
const publishArticle = async (articleId) => {
  try {
    const response = await apiCall(
      API_ENDPOINTS.BLOG.PUBLISH(articleId),
      { method: 'POST' }
    );
    
    setSuccess('Article publié!');
  } catch (error) {
    setError(error.message);
  }
};
```

### Récupérer articles publiés avec recherche

```javascript
export function useBlogPosts(
  page = 1,
  category = null,
  search = null
) {
  return useQuery({
    queryKey: ['blog', page, category, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 10,
        published: 'true'
      });

      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await apiCall(
        `${API_ENDPOINTS.BLOG.LIST}?${params}`
      );

      return response;
    }
  });
}
```

---

## 🎪 Exemples: Events

### S'inscrire à un événement

```javascript
const registerEvent = async (eventId, attendeeInfo) => {
  try {
    const response = await apiCall(
      API_ENDPOINTS.EVENTS.REGISTER(eventId),
      {
        method: 'POST',
        body: JSON.stringify({
          name: attendeeInfo.name,
          email: attendeeInfo.email,
          phone: attendeeInfo.phone
        })
      }
    );

    setSuccess('Inscription confirmée!');
  } catch (error) {
    setError(error.message);
  }
};
```

### Récupérer événements filtrés

```javascript
export function useEvents(page = 1, city = null, category = null) {
  return useQuery({
    queryKey: ['events', page, city, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 10
      });

      if (city) params.append('city', city);
      if (category) params.append('category', category);

      const response = await apiCall(
        `${API_ENDPOINTS.EVENTS.LIST}?${params}`
      );

      return response;
    }
  });
}
```

---

## 📧 Exemples: Contact

### Envoyer un message

```javascript
const handleContactSubmit = async (formData) => {
  try {
    const response = await apiCall(API_ENDPOINTS.CONTACT.CREATE, {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      })
    });

    setSuccess('Message envoyé! Nous vous répondrons bientôt.');
    resetForm();
  } catch (error) {
    setError(error.message);
  }
};
```

---

## 🎨 Exemple: Hook personnalisé réutilisable

```javascript
// src/hooks/useApi.js
import { useCallback, useState } from 'react';
import { apiCall } from '../config/api.js';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(endpoint, options);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { execute, loading, error };
}

// Utilisation
function MyComponent() {
  const { execute, loading, error } = useApi();

  const handleSubmit = async (data) => {
    try {
      const result = await execute('/api/members', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      // Traiter le résultat
    } catch (err) {
      // Erreur déjà dans le state
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## ✅ Checklist d'Intégration

- [ ] Authentification (Register/Login/Me)
- [ ] Adhésions (Create, List avec pagination)
- [ ] Blog (Create, List, Publish)
- [ ] Événements (Create, Register)
- [ ] Contact (Create)
- [ ] Gestion des erreurs 401 (token expiré)
- [ ] Loading states
- [ ] Validation côté client
- [ ] Tokens JWT stockés et envoyés
- [ ] CORS configuré correctement

---

**Status**: Guide créé avec exemples complets
**Prochaine étape**: Implémenter une par une dans les pages React
