import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../styles/dashboard.css";
import { LuGamepad2 } from "react-icons/lu";
import { FaFlask, FaMicroscope, FaPuzzlePiece } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [miniJeux, setMiniJeux] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMiniJeux = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games/minijeux`);
        const data = await res.json();

        if (res.ok) {
          setMiniJeux(data);
        } else {
          setMessage("Impossible de charger les mini-jeux.");
        }
      } catch (error) {
        setMessage("Erreur serveur : " + error.message);
      }
    };

    fetchMiniJeux();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handlePlay = (jeu) => {
    if (jeu.id_mini_jeu === 1) navigate("/creation-produit");
    if (jeu.id_mini_jeu === 2) navigate("/mini-jeu-2");
    if (jeu.id_mini_jeu === 3) navigate("/mini-jeu-3");
  };

  const getIcon = (jeu) => {
    if (jeu.id_mini_jeu === 1) return <FaFlask />;
    if (jeu.id_mini_jeu === 2) return <FaPuzzlePiece />;
    if (jeu.id_mini_jeu === 3) return <FaMicroscope />;
    return <LuGamepad2 />;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-topbar">
          <div className="dashboard-brand">
            <span className="dashboard-logo">⚗️</span>
            <span className="dashboard-brand-text">Cosmetic Lab</span>
          </div>

          <div className="dashboard-actions">
            {user?.isAdmin && (
              <button className="dashboard-admin" onClick={() => navigate("/admin")}>
                Administration
              </button>
            )}

            <button className="dashboard-logout" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>  

        <div className="dashboard-hero">
          <h1>
            Bienvenue {user ? `${user.prenom} ${user.nom}` : "dans Cosmetic Lab"}
          </h1>
          <p>
            Découvrez nos mini-jeux pédagogiques pour apprendre les bases de la
            cosmétique industrielle de manière interactive, ludique et progressive.
          </p>
        </div>

        <h2 className="dashboard-section-title">Mini-jeux disponibles</h2>

        {message && <p className="dashboard-message">{message}</p>}

        {miniJeux.length === 0 ? (
          <p className="dashboard-empty">Chargement des mini-jeux...</p>
        ) : (
          <div className="dashboard-grid">
            {miniJeux.map((jeu) => (
              <div key={jeu.id_mini_jeu} className="dashboard-card">
                <div className="dashboard-card-icon">{getIcon(jeu)}</div>
                <h3>{jeu.nom}</h3>
                <p>{jeu.description}</p>
                <button onClick={() => handlePlay(jeu)}>Jouer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;