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
- produit
- ingredient
- famille_ingredient
- composition
- defaut_qualite
- correction

##  Configuration (.env)

Créer un fichier `.env` dans le dossier backend :

---

##  Installation et lancement

### 1. Cloner le projet

git clone https://github.com/ton-username/cosmetic-lab.git
cd cosmetic-lab

## Installer les dépendances
- npm install
 - Lancer le serveur
 node server.js

 - Serveur accessible sur :

http://localhost:5000

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
