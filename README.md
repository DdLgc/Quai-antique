# Quai Antique - Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## Présentation

Quai Antique est une application web développée dans le cadre de ma formation de **Développeur Web et Web Mobile**.

Le projet met en avant le restaurant gastronomique **Quai Antique**, situé à Chambéry et dirigé par le chef **Arnaud Michant**.

Cette partie Frontend a été développée en **HTML5**, **SCSS**, **JavaScript Vanilla** et **Bootstrap 5**.

Elle communique avec une API Symfony dédiée afin de gérer l'authentification des utilisateurs, les réservations, la galerie ainsi que les différentes fonctionnalités de l'application.

---

## Fonctionnalités

### Visiteur

- Consulter la page d'accueil
- Consulter la galerie photos
- Consulter les menus du restaurant
- Créer un compte utilisateur
- Se connecter à l'application

### Utilisateur connecté

- Réserver une table
- Gérer son compte
- Modifier son mot de passe

### Interface

- Design responsive
- Navigation dynamique via Router JavaScript
- Interface optimisée pour mobile, tablette et desktop
- Charte graphique personnalisée avec Bootstrap et SCSS

---

## Technologies utilisées

### Frontend

- HTML5
- SCSS
- JavaScript ES6
- Bootstrap 5
- Bootstrap Icons

### Outils

- Git
- GitHub
- Visual Studio Code
- Node.js
- NPM
- Sass

---

## Structure du projet

```text
quaiAntiqueFront/
│
├── images/
├── pages/
├── router/
│   ├── Route.js
│   ├── allRoutes.js
│   └── router.js
│
├── scss/
│   ├── main.scss
│   └── _custom.scss
│
├── js/
├── index.html
├── package.json
└── package-lock.json
```

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/DdLgc/Quai-antique.git
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Compiler le SCSS

```bash
npm run sass
```

### 4. Lancer le projet

Ouvrir le fichier `index.html` via un serveur local.

---

## Charte graphique

### Couleurs principales

| Couleur | Valeur |
|---|---|
| Primaire | `#28afb0` |
| Secondaire | `#f4d35e` |
| Noir | `#3e4640` |

### Typographies

- Caveat
- Handlee
- Merienda

---

## Routage

L'application utilise un système de routage côté client développé en **JavaScript Vanilla**.

Les routes sont centralisées dans :

```text
router/allRoutes.js
```

Elles sont chargées dynamiquement via :

```text
router/router.js
```

---

## Responsive Design

L'interface est pensée pour offrir une expérience utilisateur adaptée sur :

- Mobile
- Tablette
- Ordinateur

---

## Backend

L'API Symfony associée au projet est développée dans un dépôt séparé.

Elle gère notamment :

- L'authentification des utilisateurs
- Les réservations
- La galerie
- Les rôles et permissions
- La gestion des données du restaurant

---

## Projet pédagogique

Projet réalisé dans le cadre du titre professionnel :

**Développeur Web et Web Mobile - DWWM**

Formation Studi.

---

## Auteur

**David Le Gouellec**

GitHub : [DdLgc](https://github.com/DdLgc)