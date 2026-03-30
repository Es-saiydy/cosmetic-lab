import { useLocation, useNavigate } from "react-router-dom";

function Resultat() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, message } = location.state || {};

  if (!score) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Aucun résultat disponible</h2>
        <button onClick={() => navigate("/dashboard")}>
          Retour Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Résultat du mini-jeu</h1>

      <h2>Score : {score} / 10</h2>
      <p>{message}</p>

      <br />

      <button onClick={() => navigate("/creation-produit")}>
        Rejouer
      </button>

      <br /><br />

      <button onClick={() => navigate("/dashboard")}>
        Retour Dashboard
      </button>
    </div>
  );
}

export default Resultat;