import { useNavigate, useOutletContext } from "react-router-dom";
import { FaPumpSoap, FaJar, FaBottleDroplet } from "react-icons/fa6";

function TypeProduit() {
  const navigate = useNavigate();
  const { formData, updateField } = useOutletContext();

  const handleNext = () => {
    if (!formData.typeProduit) return;
    navigate("/creation-produit/formule");
  };

  return (
    <div className="game-card">
      <h3 className="game-section-title">Choisir un type de produit</h3>

      <div className="choice-grid">
        <button
          type="button"
          className={`choice-card ${formData.typeProduit === "gel" ? "active" : ""}`}
          onClick={() => updateField("typeProduit", "gel")}
        >
          <FaPumpSoap size={28} />
          <p>Gel</p>
        </button>

        <button
          type="button"
          className={`choice-card ${formData.typeProduit === "creme" ? "active" : ""}`}
          onClick={() => updateField("typeProduit", "creme")}
        >
          <FaJar size={28} />
          <p>Crème</p>
        </button>

        <button
          type="button"
          className={`choice-card ${formData.typeProduit === "serum" ? "active" : ""}`}
          onClick={() => updateField("typeProduit", "serum")}
        >
          <FaBottleDroplet size={28} />
          <p>Sérum</p>
        </button>
      </div>

      <div className="game-buttons">
        <button
          className="game-btn secondary"
          onClick={() => navigate("/creation-produit/probleme")}
        >
          Retour
        </button>

        <button className="game-btn primary" onClick={handleNext}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default TypeProduit;