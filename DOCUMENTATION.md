# Documentation AfriSpot - Restaurant Website

## Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Documentation Développeur](#documentation-développeur)
3. [Documentation Administrateur](#documentation-administrateur)
4. [Maintenance et Évolution](#maintenance-et-évolution)
5. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble du projet

**AfriSpot** est un site web moderne pour un restaurant, développé avec React et TypeScript. Il propose une interface publique élégante pour présenter le restaurant et ses services, ainsi qu'un panneau d'administration sécurisé pour gérer les contenus.

### Fonctionnalités principales
- **Site public** : Présentation du restaurant, menu interactif, système de réservation, témoignages
- **Panneau d'administration** : Gestion des réservations, du menu, et des avis clients
- **Design responsive** : Adapté à tous les écrans (mobile, tablette, desktop)
- **Animations fluides** : Transitions et effets visuels modernes

---

## Documentation Développeur

### 🛠 Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.3.1 | Framework frontend principal |
| **TypeScript** | Dernière | Typage statique et sécurité du code |
| **Vite** | Dernière | Build tool et serveur de développement |
| **Tailwind CSS** | Dernière | Framework CSS utilitaire |
| **React Router DOM** | 6.26.2 | Routing côté client |
| **shadcn/ui** | Dernière | Composants UI modernes |
| **Radix UI** | Dernière | Composants accessibles headless |
| **Lucide React** | 0.462.0 | Icônes SVG |
| **Sonner** | 1.5.0 | Système de notifications toast |

### 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base (shadcn)
│   ├── admin/           # Composants spécifiques à l'admin
│   ├── Header.tsx       # En-tête du site
│   ├── Hero.tsx         # Section héro
│   ├── Menu.tsx         # Affichage du menu
│   ├── About.tsx        # Section à propos
│   ├── Reservation.tsx  # Formulaire de réservation
│   ├── Testimonials.tsx # Témoignages clients
│   └── Footer.tsx       # Pied de page
├── pages/               # Pages principales
│   ├── Index.tsx        # Page d'accueil
│   ├── Admin.tsx        # Interface d'administration
│   └── NotFound.tsx     # Page 404
├── hooks/               # Hooks React personnalisés
├── lib/                 # Utilitaires et helpers
├── utils/               # Fonctions utilitaires
├── assets/              # Images et ressources statiques
├── App.tsx              # Composant racine
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux et variables CSS
```

### 🎨 Système de Design

#### Variables CSS (index.css)
```css
:root {
  --primary: 24 88% 58%;           # Orange principal (#F97316)
  --secondary: 210 40% 98%;        # Gris clair
  --background: 0 0% 100%;         # Blanc
  --foreground: 222.2 84% 4.9%;    # Noir texte
  /* ... autres variables */
}
```

#### Composants UI principaux
- **Button** : Variants primary, secondary, ghost, outline
- **Card** : Conteneurs avec ombre et bordures
- **Dialog** : Modales et overlays
- **Toast** : Notifications système
- **Form** : Formulaires avec validation

### 🔄 Gestion des Données

#### LocalStorage Structure
```javascript
// Menu items
localStorage.getItem('afrispot_menu')
[{
  id: string,
  name: string,
  description: string,
  price: number,
  category: 'entrées' | 'plats' | 'desserts' | 'boissons',
  image: string,
  available: boolean,
  createdAt: string
}]

// Reviews
localStorage.getItem('afrispot_reviews')
[{
  id: string,
  name: string,
  rating: number,
  comment: string,
  approved: boolean,
  featured: boolean,
  createdAt: string,
  email?: string
}]

// Reservations (mock data)
[{
  id: string,
  name: string,
  phone: string,
  datetime: string,
  guests: number,
  requests?: string,
  status: 'pending' | 'confirmed' | 'cancelled',
  createdAt: string
}]
```

### 🚀 Commandes de Développement

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting du code
npm run lint
```

### 🔧 Configuration

#### Vite (vite.config.ts)
```typescript
export default defineConfig({
  server: { host: "::", port: 8080 },
  plugins: [react(), componentTagger()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
});
```

#### Tailwind (tailwind.config.ts)
```typescript
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { /* Variables HSL depuis index.css */ },
      animations: { /* Animations personnalisées */ }
    }
  }
}
```

### 📱 Routing

```typescript
// App.tsx routes
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/gestion-restaurant-dakar-admin-2024" element={<Admin />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 🎬 Système d'Animations

#### Classes disponibles
- `animate-fade-in` : Apparition en fondu
- `animate-scale-in` : Apparition avec zoom
- `hover-scale` : Effet hover avec zoom
- `scroll-reveal` : Animation au scroll

#### Scroll Reveal (utils/scrollReveal.ts)
```typescript
// Auto-activation sur les éléments .scroll-reveal
const observer = initScrollReveal();
// Nettoyage automatique
cleanupScrollReveal(observer);
```

---

## Documentation Administrateur

### 🔐 Accès au Panneau d'Administration

#### URL d'accès
```
https://votre-site.com/gestion-restaurant-dakar-admin-2024
```

#### Identifiants de connexion
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `afrispot2024`

> ⚠️ **Sécurité** : Changez ces identifiants en production !

### 📊 Tableau de Bord

Une fois connecté, vous accédez à un tableau de bord avec 3 onglets principaux :

#### 1. 📋 Gestion des Réservations

**Vue d'ensemble :**
- Statistiques en temps réel (Total, Confirmées, En attente, Avec demandes spéciales)
- Liste des réservations récentes

**Actions disponibles :**
- ✅ **Confirmer** une réservation en attente
- ❌ **Annuler** une réservation
- 👁️ **Visualiser** les détails complets (nom, téléphone, nombre de convives, demandes spéciales)

**Informations affichées :**
- Date et heure de la réservation
- Coordonnées du client
- Nombre de convives
- Demandes spéciales éventuelles
- Statut actuel

#### 2. 🍽️ Gestion du Menu

**Vue d'ensemble :**
- Menu organisé par catégories (Entrées, Plats, Desserts, Boissons)
- Statut de disponibilité en temps réel

**Actions disponibles :**
- ➕ **Ajouter** un nouveau plat
- ✏️ **Modifier** un plat existant (nom, description, prix, image)
- 🗑️ **Supprimer** un plat
- 👁️ **Activer/Désactiver** la disponibilité d'un plat

**Formulaire d'ajout/modification :**
- Nom du plat (obligatoire)
- Description détaillée
- Prix en FCFA
- Catégorie (sélection dans liste déroulante)
- URL de l'image
- Statut de disponibilité

#### 3. ⭐ Gestion des Avis

**Vue d'ensemble :**
- Statistiques des avis (Total, Approuvés, En attente, Mis en avant)
- Filtres par statut

**Actions disponibles :**
- ✅ **Approuver/Désapprouver** un avis
- ⭐ **Mettre en avant** un avis (affichage prioritaire sur le site)
- 🗑️ **Supprimer** un avis inapproprié

**Filtres disponibles :**
- Tous les avis
- Avis approuvés seulement
- Avis en attente de modération
- Avis mis en avant

**Informations affichées :**
- Nom du client
- Note sur 5 étoiles
- Commentaire complet
- Date de publication
- Statut (approuvé/en attente)

### 💾 Sauvegarde Automatique

Toutes les modifications sont automatiquement sauvegardées dans le navigateur (localStorage). Les données persistent entre les sessions.

### 📱 Interface Responsive

Le panneau d'administration s'adapte automatiquement à tous les écrans :
- **Desktop** : Vue complète avec toutes les fonctionnalités
- **Tablette** : Interface optimisée avec menus adaptatifs
- **Mobile** : Navigation simplifiée et actions tactiles

---

## Maintenance et Évolution

### 🔄 Comment Ajouter une Nouvelle Page

1. **Créer le composant de page :**
```typescript
// src/pages/NouvellePage.tsx
const NouvellePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Contenu de votre page */}
      </main>
      <Footer />
    </div>
  );
};
export default NouvellePage;
```

2. **Ajouter la route :**
```typescript
// Dans App.tsx
<Route path="/nouvelle-page" element={<NouvellePage />} />
```

3. **Ajouter la navigation :**
```typescript
// Dans Header.tsx
<Link to="/nouvelle-page">Nouvelle Page</Link>
```

### 🎨 Comment Modifier le Design

#### Changer les couleurs principales
```css
/* Dans index.css */
:root {
  --primary: 24 88% 58%;  /* Nouvelle couleur HSL */
  --secondary: 210 40% 98%;
}
```

#### Ajouter de nouvelles animations
```css
/* Dans index.css */
@keyframes nouvelle-animation {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.animate-nouvelle {
  animation: nouvelle-animation 0.3s ease-out;
}
```

### 📝 Comment Modifier les Textes

#### Contenu statique
- **Titre principal** : `src/components/Hero.tsx`
- **Description restaurant** : `src/components/About.tsx`
- **Informations contact** : `src/components/Footer.tsx`

#### Contenu dynamique
- **Menu** : Via le panneau d'administration
- **Avis** : Via le panneau d'administration
- **Réservations** : Via le formulaire public

### 🔧 Comment Ajouter des Fonctionnalités

#### Nouveau composant UI
```typescript
// src/components/NouveauComposant.tsx
import { Button } from '@/components/ui/button';

const NouveauComposant = () => {
  return (
    <div className="p-4">
      <Button className="btn-primary">
        Nouvelle fonctionnalité
      </Button>
    </div>
  );
};
```

#### Nouveau hook personnalisé
```typescript
// src/hooks/useNouveauHook.ts
import { useState, useEffect } from 'react';

export const useNouveauHook = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Logique du hook
  }, []);
  
  return { data, setData };
};
```

### 📦 Comment Ajouter des Dépendances

```bash
# Ajouter une nouvelle librairie
npm install nom-de-la-librairie

# Ajouter les types TypeScript si nécessaire
npm install @types/nom-de-la-librairie --save-dev
```

### 🚀 Déploiement

#### Via Lovable (Recommandé)
1. Cliquez sur **"Publish"** dans l'interface Lovable
2. Votre site sera automatiquement déployé
3. URL fournie automatiquement

#### Déploiement manuel
```bash
# Build de production
npm run build

# Le dossier dist/ contient les fichiers à déployer
# Uploadez le contenu sur votre serveur web
```

### 🔒 Migration vers une Base de Données

Pour passer du localStorage à une vraie base de données :

1. **Connecter Supabase** via le bouton vert dans Lovable
2. **Créer les tables** selon le schéma de données
3. **Modifier les composants** pour utiliser les APIs Supabase
4. **Implémenter l'authentification** robuste
5. **Ajouter l'upload d'images** pour le menu

---

## Troubleshooting

### 🐛 Problèmes Courants

#### Le site ne se charge pas
1. Vérifiez que Node.js est installé (`node --version`)
2. Installez les dépendances (`npm install`)
3. Démarrez le serveur (`npm run dev`)

#### Erreurs de build
1. Vérifiez les erreurs TypeScript (`npm run type-check`)
2. Vérifiez le linting (`npm run lint`)
3. Nettoyez le cache (`rm -rf node_modules && npm install`)

#### Problèmes d'authentification admin
1. Vérifiez les identifiants (`admin` / `afrispot2024`)
2. Vérifiez l'URL (`/gestion-restaurant-dakar-admin-2024`)
3. Nettoyez le localStorage du navigateur

#### Données perdues
1. Vérifiez le localStorage du navigateur
2. Les clés utilisées : `afrispot_menu`, `afrispot_reviews`
3. Sauvegardez régulièrement les données importantes

### 📞 Support

Pour toute question technique ou modification, référez-vous à :
- Cette documentation
- Les commentaires dans le code source
- La documentation officielle des technologies utilisées

### 🔄 Mises à Jour

#### Mettre à jour les dépendances
```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm install package-name@latest
```

#### Sauvegarder avant mise à jour
1. Exportez les données du localStorage
2. Commitez votre code avec Git
3. Testez en local avant déploiement

---

## 📋 Checklist de Maintenance

### Quotidienne
- [ ] Vérifier les nouvelles réservations
- [ ] Modérer les nouveaux avis
- [ ] Mettre à jour la disponibilité du menu

### Hebdomadaire  
- [ ] Sauvegarder les données importantes
- [ ] Vérifier les performances du site
- [ ] Analyser les statistiques de fréquentation

### Mensuelle
- [ ] Mettre à jour les dépendances
- [ ] Vérifier la sécurité
- [ ] Optimiser les images et contenus
- [ ] Planifier les nouvelles fonctionnalités

---

*Documentation créée pour AfriSpot v1.0 - Dernière mise à jour : 2024*