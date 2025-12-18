# 🚀 Guide de Déploiement - Woila Community

Ce document explique comment déployer le site Woila Community sur différentes plateformes.

## Vercel (Recommandé)

Vercel est la solution recommandée pour déployer les applications Vite/React.

### Déploiement Automatique (Recommandé)

1. **Créer un compte Vercel**
   - Aller sur https://vercel.com
   - S'inscrire avec GitHub

2. **Connecter le Repository**
   - Cliquer sur "New Project"
   - Sélectionner le repository GitHub
   - Vite sera détecté automatiquement

3. **Configurer les Variables d'Environnement**
   - Dans les paramètres du projet Vercel
   - Ajouter les variables du fichier `.env.production`

4. **Déployer**
   - Le déploiement se fera automatiquement à chaque push sur `main`

### Déploiement Manual (CLI)

```bash
# Installer Vercel CLI
npm i -g vercel

# Authentifier
vercel login

# Déployer
vercel
```

## Netlify

Alternative à Vercel.

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod
```

## GitHub Pages

Pour un déploiement gratuit sur GitHub Pages.

### Configuration

1. **Mettre à jour vite.config.js**
   ```javascript
   export default {
     base: '/woila-community/', // Si le repo est woila-community
     // ou base: '/' si c'est un user/org site
   }
   ```

2. **Créer un workflow GitHub Actions**
   - Fichier: `.github/workflows/deploy.yml`
   - Le workflow construit et déploie automatiquement

### Script Déploiement

```bash
npm run build
# Uploader le contenu du dossier `dist/`
```

## Autres Hébergements

### Services Cloud Génériques

**AWS S3 + CloudFront**
```bash
npm run build
# Uploader `dist/` sur S3
# Configurer CloudFront comme CDN
```

**Azure Static Web Apps**
```bash
# Connecter avec Azure DevOps
# Le déploiement se fera automatiquement
```

**Google Firebase Hosting**
```bash
# Installer Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

## Checklist de Déploiement

- [ ] Node.js version >= 20.19.0 (ou 22.12+)
- [ ] Toutes les dépendances installées (`npm install`)
- [ ] Build réussi (`npm run build`)
- [ ] Pas d'erreurs de lint (`npm run lint`)
- [ ] Variables d'environnement configurées
- [ ] .env.production présent
- [ ] vercel.json configuré
- [ ] GitHub Actions workflow en place
- [ ] Tests passants (si applicable)
- [ ] Build production testée (`npm run preview`)

## Variables d'Environnement

À configurer sur la plateforme de déploiement:

```
VITE_APP_NAME=Woila Community
VITE_APP_DESCRIPTION=Réseau d'entrepreneurs du Septentrion du Cameroun
VITE_APP_TAGLINE=Accompagner - Développer - Soutenir
```

## Troubleshooting

### Build échoue avec erreur Node.js
```bash
# Vérifier la version
node --version

# Mettre à jour si nécessaire (via nvm ou directement)
nvm use 20.19.0
```

### Port 5173 déjà utilisé en développement
```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### Erreurs de compilation React Router
- Vérifier que react-router-dom est installé: `npm list react-router-dom`
- Réinstaller si nécessaire: `npm install react-router-dom`

### Tailwind CSS non appliqué
- Vérifier que `tailwind.config.js` et `postcss.config.js` existent
- Vérifier que `@tailwind` directives sont dans `index.css`
- Clearer le cache: `rm -rf node_modules/.cache`

## Performance en Production

- **Code Splitting**: Vite le fait automatiquement
- **Image Optimization**: À implémenter selon les besoins
- **Minification**: Vite minifie automatiquement la build
- **CDN**: Vercel/Netlify fournissent automatiquement un CDN global

## Monitoring en Production

Sur Vercel:
- Aller à https://vercel.com/dashboard
- Sélectionner le projet
- Vérifier les logs et performances
- Analyser les Core Web Vitals

---

**Besoin d'aide?** Consulter la [documentation Vite](https://vitejs.dev/) ou la [documentation Vercel](https://vercel.com/docs)
