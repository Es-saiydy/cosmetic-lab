import { useNavigate, useOutletContext } from "react-router-dom";
import { FaSadTear, FaTint, FaExclamationTriangle } from "react-icons/fa";

function ProblemePeau() {
  const navigate = useNavigate();
  const { formData, updateField } = useOutletContext();

  const handleNext = () => {
    if (!formData.probleme) return;
    navigate("/creation-produit/type-produit");
  };

  return (
    <div className="game-card">
      <h3 className="game-section-title">Choisir un problème de peau</h3>

      <div className="choice-grid">
        <button
          type="button"
          className={`choice-card ${formData.probleme === "acne" ? "active" : ""}`}
          onClick={() => updateField("probleme", "acne")}
        >
          <FaSadTear size={28} />
          <p>Acné</p>
        </button>

        <button
          type="button"
          className={`choice-card ${formData.probleme === "seche" ? "active" : ""}`}
          onClick={() => updateField("probleme", "seche")}
        >
          <FaTint size={28} />
          <p>Peau sèche</p>
        </button>

        <button
          type="button"
          className={`choice-card ${formData.probleme === "sensible" ? "active" : ""}`}
          onClick={() => updateField("probleme", "sensible")}
        >
          <FaExclamationTriangle size={28} />
          <p>Peau sensible</p>
        </button>
      </div>

      <button className="game-btn primary" onClick={handleNext}>
        Suivant
      </button>
    </div>
  );
}

export default ProblemePeau;