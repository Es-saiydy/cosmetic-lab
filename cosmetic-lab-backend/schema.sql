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
    icon VARCHAR(10),
    id_famille INT NOT NULL,
    FOREIGN KEY (id_famille) REFERENCES famille_ingredient(id_famille)
);

CREATE TABLE defaut_qualite (
    id_defaut SERIAL PRIMARY KEY,
    libelle VARCHAR(160) NOT NULL,
    description TEXT,
    mots_cibles TEXT[] NOT NULL,
    phrase TEXT[] NOT NULL
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
    code VARCHAR(40) NOT NULL UNIQUE,
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
('Phase grasse', 'Nutrition'),
('Actif', 'Action ciblée'),
('Conservateur', 'Protection microbienne');

-- 3. Ingrédients
INSERT INTO ingredient (nom, description, icon, id_famille) VALUES
-- Humectants / Phase aqueuse (id_famille = 1)
('Glycérine', 'Humectant puissant', '💧', 1),
('Aloe vera', 'Apaisant et hydratant', '🌱', 1),
('Hyaluronate de sodium', 'Hydratation intense', '💧', 1),
('Eau purifiée', 'Base aqueuse neutre', '💧', 1),
('Hydrolat de rose', 'Eau florale apaisante', '🌹', 1),
('Gel d''aloe vera', 'Gel hydratant et apaisant', '🌱', 1),
-- Phases grasses (id_famille = 2)
('Huile de jojoba', 'Émollient naturel', '🌿', 2),
('Beurre de karité', 'Nourrissant', '🧴', 2),
('Cire d''abeille', 'Protecteur naturel', '🐝', 2),
('Huile de coco', 'Hydratation intense', '🥥', 2),
('Huile d''amande douce', 'Émollient nourrissant', '🌰', 2),
-- Actifs (id_famille = 3)
('Vitamine C', 'Antioxydant éclat', '🍊', 3),
('Niacinamide', 'Régulateur de sébum', '🧪', 3),
('Extrait de thé vert', 'Antioxydant', '🍵', 3),
('Collagène', 'Anti-âge', '🧬', 3),
('Extrait de rose', 'Apaisant floral', '🌹', 3),
('Acide hyaluronique', 'Hydratation intense', '🔬', 3),
('Acide salicylique', 'Exfoliant anti-imperfections', '🧪', 3),
('Panthénol', 'Apaisant et réparateur', '🧴', 3),
-- Conservateurs (id_famille = 4)
('Phénoxyéthanol', 'Conservateur synthétique', '🧪', 4),
('Benzoate de sodium', 'Conservateur doux', '💠', 4),
('Tocophérol', 'Antioxydant naturel', '🧴', 4);

-- 4. Problèmes de peau
INSERT INTO probleme_peau (code, libelle, description) VALUES
('acne', 'Acné', 'Peau grasse avec imperfections, excès de sébum'),
('seche', 'Peau sèche', 'Déshydratation et tiraillements'),
('sensible', 'Peau sensible', 'Rougeurs et irritations');

-- 5. Défauts qualité + corrections
INSERT INTO defaut_qualite (libelle, description, mots_cibles, phrase) VALUES
('Séparation des phases', 'La phase aqueuse et grasse ne sont plus mélangées', ARRAY['INSTABILITE', 'PHYSIQUE'], ARRAY['La','formule','présente','une','INSTABILITE','PHYSIQUE']),
('Texture trop fluide', 'Viscosité insuffisante du produit', ARRAY['VISCOSITE', 'FAIBLE'], ARRAY['Le','produit','a','une','VISCOSITE','trop','FAIBLE']),
('pH trop acide', 'pH hors de la plage cible 5.5-6.5', ARRAY['CORRECTION', 'PH'], ARRAY['Nécessite','une','CORRECTION','du','PH']),
('Contamination', 'Développement microbien dans le produit', ARRAY['FLORE', 'MICROBIENNE'], ARRAY['Développement','d''une','FLORE','MICROBIENNE']),
('Oxydation des actifs', 'Dégradation chimique des principes actifs', ARRAY['CHANGEMENT', 'COULEUR'], ARRAY['On','note','un','CHANGEMENT','de','COULEUR']),
('Rancissement', 'Oxydation des phases grasses', ARRAY['ALTERATION', 'OLFACTIVE'], ARRAY['Présence','d''une','ALTERATION','OLFACTIVE']),
('Cristallisation', 'Apparition de cristaux indésirables', ARRAY['PRECIPITE', 'SOLIDE'], ARRAY['Formation','d''un','PRECIPITE','SOLIDE']),
('Mousse excessive', 'Surdosage des agents tensioactifs', ARRAY['SURFACTANTS'], ARRAY['Surdosage','des','SURFACTANTS']),
('Bulles d''air', 'Air emprisonné dans le produit', ARRAY['MELANGE', 'RAPIDE'], ARRAY['Problème','de','MELANGE','trop','RAPIDE']),
('Dépôt au fond', 'Sédimentation des particules', ARRAY['SEDIMENTATION'], ARRAY['Observation','d''une','SEDIMENTATION']),
('Pigments mal répartis', 'Défaut de dispersion des colorants', ARRAY['DISPERSION'], ARRAY['Défaut','de','DISPERSION']),
('Aspect granuleux', 'Incompatibilité entre ingrédients', ARRAY['INCOMPATIBLE'], ARRAY['Mélange','INCOMPATIBLE']),
('Évaporation', 'Perte des composants volatils', ARRAY['VOLATILITE'], ARRAY['Forte','VOLATILITE','des','actifs']),
('Rupture d''émulsion', 'Démixtion irréversible eau/huile', ARRAY['DEPHASAGE'], ARRAY['Le','produit','subit','un','DEPHASAGE']),
('Opacité non conforme', 'Aspect du produit hors spécification', ARRAY['TRANSLUCIDE'], ARRAY['Le','rendu','est','trop','TRANSLUCIDE']);

INSERT INTO correction (libelle, description) VALUES
('Ajouter un émulsifiant', 'Stabilise le mélange eau/huile'),
('Ajuster le pH avec acide citrique', 'Ramène le pH dans la plage 5.5-6.5'),
('Ajouter un conservateur', 'Empêche le développement microbien');

-- 6. Lien défaut ↔ correction
INSERT INTO defaut_a_pour_correction (id_defaut, id_correction) 
SELECT d.id_defaut, c.id_correction 
FROM defaut_qualite d, correction c;