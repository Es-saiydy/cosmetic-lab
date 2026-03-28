-- =============================================
-- CRÉATION DES TABLES - Cosmetic Lab
-- À exécuter dans la base cosmetic_lab
-- =============================================

CREATE TABLE utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(60) NOT NULL,
    prenom VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE administrateur (
    id_admin SERIAL PRIMARY KEY,
    nom VARCHAR(60) NOT NULL,
    prenom VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mini_jeu (
    id_mini_jeu SERIAL PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE session (
    id_session SERIAL PRIMARY KEY,
    titre VARCHAR(120) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_admin INT NOT NULL,
    FOREIGN KEY (id_admin) REFERENCES administrateur(id_admin)
);

CREATE TABLE session_contient_mini_jeu (
    id_session INT NOT NULL,
    id_mini_jeu INT NOT NULL,
    ordre_affichage INT NOT NULL,
    PRIMARY KEY (id_session, id_mini_jeu),
    FOREIGN KEY (id_session) REFERENCES session(id_session),
    FOREIGN KEY (id_mini_jeu) REFERENCES mini_jeu(id_mini_jeu)
);

CREATE TABLE famille_ingredient (
    id_famille SERIAL PRIMARY KEY,
    libelle VARCHAR(120) NOT NULL,
    fonction VARCHAR(160)
);

CREATE TABLE ingredient (
    id_ingredient SERIAL PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    description TEXT,
    id_famille INT NOT NULL,
    FOREIGN KEY (id_famille) REFERENCES famille_ingredient(id_famille)
);

CREATE TABLE defaut_qualite (
    id_defaut SERIAL PRIMARY KEY,
    libelle VARCHAR(160) NOT NULL,
    description TEXT
);

CREATE TABLE correction (
    id_correction SERIAL PRIMARY KEY,
    libelle VARCHAR(160) NOT NULL,
    description TEXT
);

CREATE TABLE defaut_a_pour_correction (
    id_defaut INT NOT NULL,
    id_correction INT NOT NULL,
    PRIMARY KEY (id_defaut, id_correction),
    FOREIGN KEY (id_defaut) REFERENCES defaut_qualite(id_defaut),
    FOREIGN KEY (id_correction) REFERENCES correction(id_correction)
);

CREATE TABLE probleme_peau (
    id_probleme SERIAL PRIMARY KEY,
    libelle VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE partie (
    id_partie SERIAL PRIMARY KEY,
    date_partie TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temps_effectue_s INT,
    id_utilisateur INT NOT NULL,
    id_mini_jeu INT NOT NULL,
    id_session INT,
    id_probleme INT,
    id_defaut INT,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (id_mini_jeu) REFERENCES mini_jeu(id_mini_jeu),
    FOREIGN KEY (id_session) REFERENCES session(id_session),
    FOREIGN KEY (id_probleme) REFERENCES probleme_peau(id_probleme),
    FOREIGN KEY (id_defaut) REFERENCES defaut_qualite(id_defaut)
);

CREATE TABLE score (
    id_score SERIAL PRIMARY KEY,
    score_total INT NOT NULL,
    score_efficacite INT,
    score_securite INT,
    score_environnement INT,
    temps_effectue_s INT,
    id_partie INT NOT NULL UNIQUE,
    FOREIGN KEY (id_partie) REFERENCES partie(id_partie)
);

CREATE TABLE produit (
    id_produit SERIAL PRIMARY KEY,
    nom VARCHAR(140) NOT NULL,
    type_packaging VARCHAR(120),
    ordre_melange VARCHAR(160),
    temperature_c DECIMAL(5,2),
    ph DECIMAL(4,2),
    conforme_reglement BOOLEAN,
    impact_env VARCHAR(120),
    id_partie INT NOT NULL UNIQUE,
    FOREIGN KEY (id_partie) REFERENCES partie(id_partie)
);

CREATE TABLE composition (
    id_produit INT NOT NULL,
    id_ingredient INT NOT NULL,
    quantite DECIMAL(10,3) NOT NULL,
    unite VARCHAR(10),
    PRIMARY KEY (id_produit, id_ingredient),
    FOREIGN KEY (id_produit) REFERENCES produit(id_produit),
    FOREIGN KEY (id_ingredient) REFERENCES ingredient(id_ingredient)
);

-- 1. Mini-jeux
INSERT INTO mini_jeu (nom, description) VALUES
('Créer un produit cosmétique', 'Simule la création complète d''un produit à partir d''un problème de peau'),
('Associer les ingrédients', 'Apprends les familles et fonctions des ingrédients cosmétiques'),
('Stabilité & contrôle qualité', 'Analyse les défauts et propose des corrections');

-- 2. Familles d''ingrédients
INSERT INTO famille_ingredient (libelle, fonction) VALUES
('Humectant', 'Hydratation'),
('Phase grasse', 'Émollient / Nourrissant'),
('Actif', 'Action ciblée'),
('Conservateur', 'Protection microbienne');

-- 3. Ingrédients
INSERT INTO ingredient (nom, description, id_famille) VALUES
('Glycérine', 'Humectant puissant', 1),
('Huile de jojoba', 'Émollient naturel', 2),
('Acide hyaluronique', 'Hydratation intense', 3),
('Vitamine E', 'Antioxydant', 3),
('Phénoxyéthanol', 'Conservateur', 4);

-- 4. Problèmes de peau
INSERT INTO probleme_peau (libelle, description) VALUES
('Peau sèche', 'Déshydratation et tiraillements'),
('Peau grasse avec imperfections', 'Excès de sébum et boutons'),
('Peau sensible', 'Rougeurs et irritations');

-- 5. Défauts qualité + corrections
INSERT INTO defaut_qualite (libelle, description) VALUES
('Séparation des phases', 'La phase aqueuse et grasse ne sont plus mélangées'),
('pH incorrect', 'Le pH est trop acide ou trop basique'),
('Contamination microbienne', 'Présence de bactéries ou moisissures');

INSERT INTO correction (libelle, description) VALUES
('Ajouter un émulsifiant', 'Stabilise le mélange eau/huile'),
('Ajuster le pH avec acide citrique', 'Ramène le pH dans la plage 5.5-6.5'),
('Ajouter un conservateur', 'Empêche le développement microbien');

-- 6. Lien défaut ↔ correction
INSERT INTO defaut_a_pour_correction (id_defaut, id_correction) 
SELECT d.id_defaut, c.id_correction 
FROM defaut_qualite d, correction c;