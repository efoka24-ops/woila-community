# 🌐 Woila Community - Site Web

Site officiel de **Woila Community** - Réseau d'entrepreneurs du Septentrion du Cameroun.

## 📋 À Propos

**Woila Community** est une association dédiée à l'accompagnement, au développement et au soutien des jeunes entrepreneurs, créateurs d'entreprise et porteurs de projets dans les régions de Maroua, Garoua et N'Gaoundéré (Septentrion du Cameroun).

**Tagline:** Accompagner • Développer • Soutenir

## 🚀 Caractéristiques

- ✅ **Pages Principales**: Accueil, À Propos, Statuts, Gouvernance, Contact
- ✅ **Responsive Design**: Optimisé pour tous les appareils
- ✅ **Framework Moderne**: React 18 + Vite pour performance optimale
- ✅ **Styling**: Tailwind CSS 3 pour un design moderne et cohérent
- ✅ **Routage**: React Router v6 pour navigation fluide
- ✅ **Formulaire Contact**: Formulaire fonctionnel avec validation

## ⚙️ Installation et Setup

### Prérequis
- Node.js 18.x ou supérieur
- npm 9.x ou supérieur

### Installation

```bash
# Installer les dépendances
npm install
```

## 🚀 Commandes de Développement

```bash
# Démarrer le serveur de développement (http://localhost:5173)
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

## 📄 Pages et Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Accueil avec présentation générale |
| `/about` | About | Informations sur l'association |
| `/statutes` | Statutes | Statuts légaux de l'association |
| `/governance` | Governance | Structure organisationnelle |
| `/contact` | Contact | Formulaire de contact |

## 🛠️ Stack Technologique

- **React 18.x** - Framework UI
- **Vite 5.x** - Build tool rapide
- **React Router 6.x** - Routage
- **Tailwind CSS 3.x** - Framework CSS
- **PostCSS** - Processing CSS
- **ESLint** - Code linting

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.jsx      
│   ├── Footer.jsx      
│   └── Layout.jsx      
├── pages/              # Pages principales
│   ├── Home.jsx        
│   ├── About.jsx       
│   ├── Statutes.jsx    
│   ├── Governance.jsx  
│   └── Contact.jsx     
├── data/
│   └── content.js      # Contenu statique
├── App.jsx             # Component principal avec Router
├── main.jsx            # Point d'entrée
└── index.css           # Styles Tailwind
```

## 💾 Déploiement

### Vercel
```bash
npm i -g vercel
vercel
```

### Autres hébergements
```bash
npm run build
# Uploader le contenu du dossier `dist/`
```

## 📧 Contact

- **Email**: info@woila-community.cm
- **Siège Social**: Garoua, Cameroun
- **Régions**: Maroua, Garoua, N'Gaoundéré

---

© 2025 Woila Community. Tous droits réservés.
