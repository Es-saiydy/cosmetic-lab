# Cosmetic Lab

Application éducative pour l’apprentissage de la cosmétique industrielle.


## Description du projet

**Cosmetic Lab** est une application web pédagogique développée dans le cadre du module *Projet Système d’Information* .

L’objectif est de faciliter l’apprentissage des concepts de la cosmétique industrielle à travers une approche interactive basée sur des mini-jeux.

L’application permet aux utilisateurs de :
- simuler la création de produits cosmétiques
- associer des ingrédients à leurs fonctions
- analyser des défauts qualité
- suivre leurs performances via un système de score

## Architecture du projet

L’application repose sur une architecture **client–serveur en 3 couches** :

-  **Frontend (React)** *(à venir)*
-  **Backend (Node.js / Express)**
-  **Base de données (PostgreSQL)**

---

## Technologies utilisées

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors

### Base de données
- PostgreSQL
- pgAdmin

### Outils
- Git & GitHub
- Visual Studio Code


##  Base de données

Nom de la base : cosmetic_lab

### Tables principales

- utilisateur
- administrateur
- mini_jeu
- partie
- score
- probleme_peau
- ingredient
- famille_ingredient
- defaut_qualite
- correction
- defaut_a_pour_correction

##  Configuration (.env)

Créer un fichier `.env` dans le dossier backend :

---

##  Installation et lancement

### 1. Cloner le projet

git clone https://github.com/Es-saiydy/cosmetic-lab.git
cd cosmetic-lab

## Installer les dépendances
- npm install
 - Lancer le serveur
 node server.js

 - Serveur accessible sur :

http://localhost:5001

- Test de connexion PostgreSQL

Route disponible :

GET /api/test-db

Résultat attendu :

{
  "success": true,
  "message": "Connexion PostgreSQL réussie"
}
##  Tests API avec Postman

### ✔ Test serveur
GET / → Backend Cosmetic Lab OK

### ✔ Test connexion base de données
GET /api/test-db → Connexion PostgreSQL réussie

### ✔ Test inscription
POST /api/users/register → Utilisateur créé

### ✔ Test connexion
POST /api/users/login → Token JWT généré

### ✔ Authentification JWT
Utilisation du token pour accéder aux routes protégées

---

##  Statut backend

- API fonctionnelle
- Authentification JWT opérationnelle
- Connexion base de données validée
- Tests réalisés avec Postman

---


## Fonctionnalités actuelles

L’application permet actuellement de :

- créer un compte utilisateur
- se connecter à l’application
- accéder à une page d’accueil
- consulter le dashboard des mini-jeux
- jouer au mini-jeu: Création d’un produit cosmétique
- jouer au mini-jeu: Association des ingrédients
- jouer au mini-jeu: Contrôle qualité
- sélectionner un problème de peau et des ingrédients
- calculer un score à la fin du mini-jeu
- enregistrer la partie et le score dans la base de données
- afficher une page de résultat
- consulter le classement personnel et le classement global
- accéder à un espace administrateur avec statistiques et graphiques

## Structure du projet

cosmetic-lab/
- frontend/
  - src/pages
  - src/components
  - src/styles
- backend/
  - config
  - controllers
  - routes
  - middleware

## Frontend

Le frontend a été développé avec **React**.

Pages principales actuellement disponibles :
- Accueil
- Connexion
- Inscription
- Dashboard
- CréationProduit
- Résultat
- Leaderboard
- AdminLogin
- AdminPage

Pour lancer le frontend :

cd frontend
npm install
npm start



## Backend

Le backend a été développé avec **Node.js**, **Express.js** et **PostgreSQL**.

Fonctionnalités backend réalisées :
- connexion à la base de données PostgreSQL
- création des routes API
- authentification avec JWT
- protection des routes privées
- création et enregistrement des parties
- enregistrement des scores en base de données
- récupération des mini-jeux depuis la base
- récupération des données métier depuis la base (ingrédients, familles, problèmes de peau, défauts qualité)
- routes d’administration avec restriction par middleware
- routes statistiques avec agrégation SQL (COUNT, AVG, GROUP BY)
- suppression d'utilisateur avec nettoyage des parties et scores associés

Pour lancer le backend :
cd cosmetic-lab-backend
npm install
node server.js

Backend accessible sur :

http://localhost:5001