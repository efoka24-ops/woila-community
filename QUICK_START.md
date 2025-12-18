# 🚀 Quick Start Guide - Woila Community

## En 3 Minutes ⏱️

### 1. Cloner et Installer
```bash
cd woila-community
npm install
```

### 2. Démarrer le Serveur
```bash
npm run dev
```

### 3. Ouvrir le Navigateur
```
http://localhost:5173
```

**C'est tout!** 🎉 Le site est maintenant actif en mode développement.

---

## 📋 Contenu de la Version Initiale

### Pages Principales ✅
- **Home** (`/`) - Accueil avec présentation et objectifs
- **About** (`/about`) - Informations sur l'association
- **Statutes** (`/statutes`) - Statuts légaux de l'association
- **Governance** (`/governance`) - Structure organisationnelle
- **Contact** (`/contact`) - Formulaire de contact

### Fonctionnalités ✅
- Navigation responsive
- Footer avec informations
- Formulaire de contact fonctionnel
- Design moderne avec Tailwind CSS
- Routage fluide avec React Router

---

## 📁 Où Trouver Quoi

| Besoin | Fichier |
|--------|---------|
| Ajouter une page | `src/pages/NomPage.jsx` |
| Modifier le contenu | `src/data/content.js` |
| Éditer le header | `src/components/Header.jsx` |
| Éditer le footer | `src/components/Footer.jsx` |
| Ajouter une route | `src/App.jsx` |
| Configurer Tailwind | `tailwind.config.js` |

---

## 🎨 Changer les Couleurs

Dans `tailwind.config.js`:

```javascript
colors: {
  primary: '#VOTRE_COULEUR',   // Bleu principal
  secondary: '#VOTRE_COULEUR',  // Gris foncé
}
```

---

## 📝 Modification du Contenu Statique

**Fichier**: `src/data/content.js`

```javascript
export const organization = {
  name: "Woila Community",
  tagline: "Accompagner - Développer - Soutenir",
  // ... modifier ces valeurs
};
```

---

## 📦 Commandes Utiles

```bash
# Développement
npm run dev          # Démarrer le serveur (http://localhost:5173)
npm run lint         # Vérifier la qualité du code

# Production
npm run build        # Construire pour production
npm run preview      # Tester la build production
```

---

## 🚀 Déployer sur Vercel

### Méthode 1: Automatique (Recommandé)
1. Push le code sur GitHub
2. Aller sur https://vercel.com
3. Cliquer "Import Project"
4. Sélectionner le repository
5. **C'est fait!** 🎉 Le site est en live

### Méthode 2: CLI
```bash
npm i -g vercel
vercel
```

---

## 🐛 Troubleshooting Rapide

**Le port 5173 est occupé?**
```bash
npm run dev -- --port 3000
```

**Les styles Tailwind ne s'appliquent pas?**
```bash
# Supprimer le cache et réinstaller
rm -rf node_modules/.cache
npm run dev
```

**Build échoue?**
```bash
npm install
npm run build
```

---

## 📚 Documentation Complète

- **README.md** - Guide complet
- **DEPLOYMENT.md** - Guide de déploiement
- **CONTRIBUTING.md** - Comment contribuer
- **PROJECT_SUMMARY.md** - Résumé du projet

---

## 💡 Conseils

1. **Modifier d'abord le contenu**: Allez dans `src/data/content.js`
2. **Tester en dev**: Toujours faire `npm run dev` pendant le développement
3. **Commit souvent**: `git add . && git commit -m "description"`
4. **Builder avant de pousser**: `npm run build` pour vérifier
5. **Vérifier le lint**: `npm run lint` avant de commiter

---

## 🎯 Prochaines Étapes Suggérées

1. ✅ **Tester le site en local** - Faire `npm run dev`
2. ✅ **Personnaliser les couleurs** - Éditer `tailwind.config.js`
3. ✅ **Ajouter votre contenu** - Modifier `src/data/content.js`
4. ✅ **Ajouter des images** - Placer dans `public/` et utiliser
5. ✅ **Connecter à Vercel** - Pour déploiement automatique

---

## 📞 Besoin d'Aide?

- Consulter la **documentation Vite**: https://vitejs.dev/
- Consulter la **documentation React**: https://react.dev/
- Consulter la **documentation Tailwind**: https://tailwindcss.com/
- Consulter la **documentation Vercel**: https://vercel.com/docs

---

**Bon développement! 🚀**

Woila Community - Accompagner • Développer • Soutenir
