import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handlePlay = (id) => {
    if (id === 1) navigate("/creation-produit");
    if (id === 2) navigate("/mini-jeu-2");
    if (id === 3) navigate("/mini-jeu-3");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8f9fa", 
      padding: "40px 20px", 
      fontFamily: "Arial, sans-serif",
      textAlign: "center"
    }}>
      
      <h1 style={{ fontSize: "42px", color: "#222", marginBottom: "8px" }}>Dashboard</h1>
      
      <p style={{ fontSize: "20px", color: "#555", marginBottom: "50px" }}>
        Bienvenue {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
      </p>

      <h2 style={{ marginBottom: "40px", color: "#222", fontSize: "28px" }}>
        Mini-jeux disponibles
      </h2>

      {/* Card 1 */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        maxWidth: "520px",
        margin: "0 auto 25px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        textAlign: "left"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Créer un produit cosmétique</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Simule la création complète d'un produit à partir d'un problème de peau
        </p>
        <button 
          onClick={() => handlePlay(1)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Jouer
        </button>
      </div>

      {/* Card 2 */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        maxWidth: "520px",
        margin: "0 auto 25px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        textAlign: "left"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Associer les ingrédients</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Apprends les familles et fonctions des ingrédients cosmétiques
        </p>
        <button 
          onClick={() => handlePlay(2)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Jouer
        </button>
      </div>

      {/* Card 3 */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        maxWidth: "520px",
        margin: "0 auto 25px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        textAlign: "left"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Stabilité & contrôle qualité</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Analyse les défauts d'un produit cosmétique et propose des corrections
        </p>
        <button 
          onClick={() => handlePlay(3)}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Jouer
        </button>
      </div>

      <br /><br />
      <button 
        onClick={handleLogout}
        style={{
          padding: "14px 50px",
          background: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default Dashboard;