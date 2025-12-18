# 🤝 Guide de Contribution - Woila Community

Merci d'être intéressé par la contribution au projet Woila Community! Ce document explique comment contribuer.

## Code de Conduite

- Respecter tous les contributeurs
- Être constructif et bienveillant
- Signaler les problèmes de manière professionnelle

## Processus de Contribution

### 1. Fork et Clone

```bash
# Forker le repository sur GitHub
# Puis cloner votre fork
git clone https://github.com/votre-username/woila-community.git
cd woila-community
```

### 2. Créer une Branche

```bash
# Créer une branche descriptive
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/description-du-bug
```

### 3. Développer

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Vérifier la qualité du code
npm run lint
```

### 4. Commit

```bash
# Faire des commits clairs et descriptifs
git add .
git commit -m "Ajout: description claire de la modification"

# Exemples:
# git commit -m "Ajout: nouvelle page Services"
# git commit -m "Fix: correction du formulaire de contact"
# git commit -m "Chore: mise à jour des dépendances"
```

### 5. Push et Pull Request

```bash
# Pusher votre branche
git push origin feature/nom-de-la-fonctionnalite

# Créer une Pull Request sur GitHub
```

## Standards de Code

### Structure des Fichiers

- **Composants**: `src/components/NomComposant.jsx`
- **Pages**: `src/pages/NomPage.jsx`
- **Données**: `src/data/nomdonnees.js`

### Conventions de Nommage

```javascript
// Composants React - PascalCase
export function MyComponent() { }

// Fonctions - camelCase
function myFunction() { }

// Constantes - UPPER_SNAKE_CASE
const MY_CONSTANT = 'value';

// CSS Classes - kebab-case (via Tailwind)
className="my-class-name"
```

### Exemple de Composant

```jsx
/**
 * Composant MyComponent
 * @param {string} title - Le titre
 * @param {ReactNode} children - Le contenu
 */
export function MyComponent({ title, children }) {
  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

## Ajouter une Nouvelle Page

### 1. Créer le Fichier de Page

```jsx
// src/pages/MonPage.jsx
export function MonPage() {
  return (
    <div>
      {/* Contenu */}
    </div>
  );
}
```

### 2. Ajouter la Route

```jsx
// src/App.jsx
import { MonPage } from './pages/MonPage';

// Dans le composant Routes:
<Route path="/ma-page" element={<MonPage />} />
```

### 3. Ajouter au Navigateur

```jsx
// src/components/Header.jsx
<a href="/ma-page" className="...">Ma Page</a>
```

## Ajouter du Contenu Statique

### 1. Modifier `src/data/content.js`

```javascript
export const monContenu = [
  {
    id: 1,
    titre: "Élément 1",
    description: "Description"
  }
];
```

### 2. Utiliser dans une Page

```jsx
import { monContenu } from '../data/content';

export function MaPage() {
  return (
    <div>
      {monContenu.map(item => (
        <div key={item.id}>{item.titre}</div>
      ))}
    </div>
  );
}
```

## Styles Tailwind CSS

### Utiliser Tailwind

```jsx
// Utiliser les classes Tailwind
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Contenu
</div>

// Responsive
<div className="text-sm md:text-lg lg:text-2xl">
  Responsive text
</div>

// Hover states
<button className="bg-blue-600 hover:bg-blue-700 transition">
  Button
</button>
```

## Testing

Avant de soumettre une PR:

```bash
# Vérifier le lint
npm run lint

# Vérifier la build
npm run build

# Tester en développement
npm run dev
# Ouvrir http://localhost:5173
```

## Types de Contributions Bienvenues

- 🐛 **Bug fixes**: Corriger les bugs existants
- ✨ **Nouvelles features**: Ajouter nouvelles fonctionnalités
- 📚 **Documentation**: Améliorer la documentation
- 🎨 **Design**: Améliorer l'interface utilisateur
- ⚡ **Performance**: Optimiser les performances
- 🧹 **Refactor**: Améliorer la qualité du code
- 📝 **Content**: Mettre à jour le contenu

## Process de Review

1. Un mainteneur révisera votre PR
2. Des commentaires ou demandes de changements peuvent être faits
3. Une fois approuvée, votre PR sera mergée
4. Votre contribution sera mentionnée dans les releases

## Questions?

- Ouvrir une **Issue** pour des questions
- Discuter dans les **Discussions** GitHub
- Contacter: info@woila-community.cm

---

**Merci de contribuer à Woila Community! 🙌**
