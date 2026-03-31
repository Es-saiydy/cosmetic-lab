import { useNavigate } from "react-router-dom";
import "../styles/accueil.css";

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-brand">
          <span className="home-logo">⚗️</span>
          <span className="home-brand-text">Cosmetic Lab</span>
        </div>

        <h1 className="home-title">Cosmetic Lab</h1>

        <div className="home-buttons">
          <button className="home-button primary" onClick={() => navigate("/login")}>
            JOUER
          </button>

          <button className="home-button secondary" onClick={() => navigate("/about")}>
            À PROPOS
          </button>
        </div>
      </div>

      <div className="home-bottom-text">Projet pédagogique — L3 MIAGE</div>
    </div>
  );
}

export default Accueil;