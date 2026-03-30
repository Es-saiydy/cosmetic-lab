import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

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
          setMessage("❌ Impossible de charger les mini-jeux");
        }
      } catch (error) {
        setMessage("❌ Erreur serveur : " + error.message);
      }
    };

    fetchMiniJeux();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Dashboard</h1>

      <p>
        Bienvenue {user ? `${user.prenom} ${user.nom}` : "utilisateur"}
      </p>

      <h2>Mini-jeux disponibles</h2>

      {message && <p>{message}</p>}

      {miniJeux.length === 0 ? (
        <p>Chargement...</p>
      ) : (
        miniJeux.map((jeu) => (
          <div
            key={jeu.id_mini_jeu}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "15px auto",
              width: "300px",
              borderRadius: "10px",
            }}
          >
            <h3>{jeu.nom}</h3>
            <p>{jeu.description}</p>
            <button onClick={() => navigate("/creation-produit")}>
                Jouer
            </button>
          </div>
        ))
      )}

      <br />
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default Dashboard;