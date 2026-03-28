import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [miniJeux, setMiniJeux] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/games/minijeux")
      .then(res => res.json())
      .then(data => {
        console.log("Mini-jeux:", data);
        setMiniJeux(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dashboard</h1>

      <p>
        Bienvenue {user ? `${user.prenom} ${user.nom}` : "utilisateur"}
      </p>

      <h2>Mini-jeux</h2>

      {miniJeux.length === 0 ? (
        <p>Chargement...</p>
      ) : (
        miniJeux.map((jeu) => (
          <div key={jeu.id_mini_jeu} style={{ marginBottom: "20px" }}>
            <h3>{jeu.nom}</h3>
            <p>{jeu.description}</p>
          </div>
        ))
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;