# Quai Antique — Frontend

[![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?logo=html5&logoColor=white)]()
[![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?logo=sass&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)]()
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)]()
[![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-1.13.1-7952B3?logo=bootstrap&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Completed-success)]()

---

## Description

**Quai Antique** est une application web de restauration gastronomique réalisée dans le cadre de ma formation **Développeur Web et Web Mobile**.

Le projet répond à un sujet d'ECF autour du restaurant fictif Quai Antique, situé à Chambéry et dirigé par le chef Arnaud Michant.

Ce dépôt contient la partie **frontend** de l'application. Elle repose sur HTML, Sass, Bootstrap et JavaScript et communique avec une API Symfony développée dans un dépôt séparé.

L'application permet aux visiteurs de découvrir le restaurant, sa galerie, sa carte, ses menus et ses horaires, de créer un compte et de réserver une table.

Une interface adaptée aux rôles permet également à l'administrateur de gérer les principaux contenus du restaurant.

---

## Fonctionnalités

### Frontend

- Navigation dynamique avec routeur JavaScript personnalisé
- Interface responsive desktop, tablette et mobile
- Authentification utilisateur
- Gestion de l'affichage selon le rôle utilisateur
- Création et gestion d'un compte client
- Galerie dynamique de photographies sur la page d'accueil
- Affichage du titre des photographies au survol
- Galerie complète administrable
- Affichage de la carte par catégories
- Présentation des menus et de leurs formules
- Affichage dynamique des horaires d'ouverture
- Réservation accessible aux visiteurs et aux clients
- Vérification dynamique des disponibilités sans rechargement
- Créneaux de réservation par intervalles de 15 minutes
- Gestion du nombre maximal de convives
- Préremplissage des préférences de réservation des clients connectés
- Gestion des allergies
- Interface d'administration pour les contenus du restaurant

### Backend associé

Le frontend communique avec une API Symfony permettant notamment :

- Authentification et gestion des utilisateurs
- Gestion des rôles et autorisations
- CRUD des photographies
- CRUD des plats
- CRUD des menus et formules
- Gestion des horaires d'ouverture
- Gestion des réservations
- Calcul des disponibilités
- Gestion de la capacité maximale du restaurant

---

## Conformité au sujet ECF

Le projet couvre les principales user stories demandées dans le sujet **Restaurant — Quai Antique** :

- **US1 — Connexion** : authentification client et administrateur depuis un formulaire commun
- **US2 — Galerie** : photographies affichées sur l'accueil, titres au survol et gestion administrateur
- **US3 — Carte** : plats classés par catégories avec titre, description et prix
- **US4 — Menus** : menus composés d'une ou plusieurs formules avec description et prix
- **US5 — Horaires** : horaires affichés dans le pied de page et modifiables par l'administrateur
- **US6 — Réservation** : réservation visiteur/client, disponibilités dynamiques, créneaux de 15 minutes et capacité maximale
- **US7 — Allergies** : préférences client enregistrées et préremplies lors d'une réservation

---

## Stack technique

- HTML5
- SCSS / Sass
- JavaScript ES6+
- Bootstrap 5.3.8
- Bootstrap Icons 1.13.1
- Fetch API
- Node.js
- NPM
- Git
- GitHub

---

## Installation

### Prérequis

- Git
- Node.js
- NPM
- Un navigateur web moderne
- Le backend Quai Antique en fonctionnement

### Étapes

#### 1. Cloner le projet

```bash
git clone https://github.com/DdLgc/Quai-antique.git
```

#### 2. Accéder au projet

```bash
cd Quai-antique
```

#### 3. Installer les dépendances

```bash
npm install
```

#### 4. Lancer le frontend

```bash
npm start
```

Le frontend est alors accessible par défaut à l'adresse :

```text
http://localhost:3000
```

#### 5. Compiler le Sass en développement

Si des modifications sont apportées aux fichiers Sass :

```bash
npm run sass
```

Le CSS généré est ensuite utilisé par l'application.

---

## Configuration de l'API

Le frontend communique avec l'API Symfony locale via :

```text
https://127.0.0.1:8000/api/
```

---

## Utilisation

### Visiteur

Un visiteur peut :

- Consulter l'accueil
- Découvrir la galerie
- Consulter la carte
- Consulter les menus
- Voir les horaires d'ouverture
- Vérifier les disponibilités
- Réserver une table
- Mentionner des allergies
- Créer un compte
- Se connecter

### Client connecté

Un client connecté peut également :

- Retrouver ses préférences de réservation
- Préremplir automatiquement son nombre habituel de convives
- Préremplir ses allergies
- Consulter ses réservations
- Supprimer une réservation
- Modifier son compte
- Modifier son mot de passe
- Supprimer son compte

### Administrateur

L'administrateur dispose des fonctionnalités nécessaires pour gérer :

- La galerie
- Les plats
- Les menus
- Les formules
- Les horaires d'ouverture
- La capacité maximale du restaurant

---

## Architecture frontend

Le projet utilise une architecture de type **Single Page Application légère** reposant sur un routeur JavaScript personnalisé.

Les principales routes sont définies dans :

```text
Router/allRoutes.js
```

Le chargement dynamique des pages est géré par :

```text
Router/router.js
```

Chaque route peut également définir les droits nécessaires à son accès.

---

## Gestion des rôles

L'interface adapte les éléments visibles selon l'état et le rôle de l'utilisateur.

Les principaux profils sont :

```text
Visiteur
ROLE_USER
ROLE_ADMIN
```

Des attributs `data-show` permettent d'afficher ou masquer certains éléments de l'interface selon les autorisations.

Les contrôles frontend améliorent l'expérience utilisateur, mais les autorisations sensibles sont également contrôlées côté backend.

---

## Charte graphique

### Couleurs principales

| Élément | Valeur |
| --- | --- |
| Primaire | `#28afb0` |
| Secondaire | `#f4d35e` |
| Noir | `#3e4640` |
| Blanc | `rgb(255, 243, 243)` |

### Typographies

- Caveat
- Handlee
- Merienda

---

## Compétences développées

- Intégration d'une interface responsive
- Développement JavaScript dynamique
- Création d'un routeur frontend personnalisé
- Consommation d'une API REST avec Fetch
- Gestion de l'authentification côté client
- Mise en place d'une interface basée sur les rôles
- Validation de formulaires
- Manipulation du DOM
- Gestion dynamique des réservations
- Prévention des injections XSS sur les données affichées
- Utilisation de Sass et Bootstrap
- Git & GitHub
- Workflow professionnel

---

## Workflow Git

Le développement utilise des branches dédiées selon la nature des modifications :

- `feature/*`
- `fix/*`
- `security/*`
- `refactor/*`
- `docs/*`
- `release/*`

Les commits suivent la convention **Conventional Commits** :

```text
feat:
fix:
docs:
refactor:
style:
chore:
```

Les fonctionnalités sont développées et vérifiées sur leur branche avant intégration dans `main`.

---

## Améliorations possibles

- Ajouter des tests automatisés frontend
- Améliorer la gestion globale des erreurs API
- Ajouter davantage de retours visuels pour les actions administrateur
- Améliorer encore l'accessibilité et la navigation clavier
- Migrer ultérieurement vers une architecture frontend basée sur un framework

---

## Liens

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ddlgc-portfolio.netlify.app/)

[![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DdLgc/Quai-antique)

[![Backend](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DdLgc/Quai-antique-Back)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-le-gouellec-551322243/)

---

## Arborescence

```text
Quai-antique/
│
├── images/
├── js/
│   ├── auth/
│   ├── reservations/
│   ├── galerie.js
│   ├── home.js
│   ├── menus.js
│   └── script.js
│
├── pages/
│   ├── auth/
│   ├── reservations/
│   ├── galerie.html
│   ├── home.html
│   └── menus.html
│
├── Router/
│   ├── Route.js
│   ├── allRoutes.js
│   └── router.js
│
├── scss/
│   ├── main.scss
│   └── main.css
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## Captures d'écran

Les captures du projet sont utilisées dans mon portfolio afin de présenter l'interface et les principales fonctionnalités de Quai Antique.

---

## Auteur

**David Le Gouellec**

Développeur Web Full Stack en formation, avec une attention particulière portée à la structuration des projets, à la maintenabilité, à la sécurité et aux bonnes pratiques Git.

---

## Licence

Projet réalisé à des fins pédagogiques dans le cadre de la formation Développeur Web et Web Mobile.

Vous êtes libre de consulter ce dépôt et de l'utiliser comme support d'apprentissage.