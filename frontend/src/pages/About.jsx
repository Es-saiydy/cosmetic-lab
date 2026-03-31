import { useNavigate } from "react-router-dom";
import "../styles/accueil.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="about-card">
        <div className="home-brand">
          <span className="home-logo">⚗️</span>
          <span className="home-brand-text">Cosmetic Lab</span>
        </div>

        <h1 className="home-title">À propos</h1>

        <p className="about-text">
          Cosmetic Lab est une application pédagogique qui permet d’apprendre
          les bases de la cosmétique industrielle à travers des mini-jeux
          interactifs.
        </p>

        <p className="about-text">
          Le projet aide l’utilisateur à découvrir le choix des ingrédients,
          la formulation des produits, ainsi que la logique de qualité et
          d’évaluation.
        </p>

        <button className="home-button primary" onClick={() => navigate("/")}>
          RETOUR
        </button>
      </div>

      <div className="home-bottom-text">Projet pédagogique — L3 MIAGE</div>
    </div>
  );
}

export default About;