import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaTint, FaOilCan, FaFlask, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import API_URL from "../../api";

function FormuleProduit() {
  const navigate = useNavigate();
  const { formData, updateField, resetJeu } = useOutletContext();

  const [ingredientsByFamille, setIngredientsByFamille] = useState({
    1: [], 2: [], 3: [], 4: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games/ingredients`);
        const data = await res.json();
        if (res.ok) {
          // Groupe les ingrédients par id_famille
          const grouped = data.reduce((acc, ing) => {
            if (!acc[ing.id_famille]) acc[ing.id_famille] = [];
            acc[ing.id_famille].push(ing.nom);
            return acc;
          }, { 1: [], 2: [], 3: [], 4: [] });

          // Ajoute "Aucun" comme option spéciale pour les conservateurs (UX, pas un vrai ingrédient)
          grouped[4] = [...grouped[4], "Aucun"];

          setIngredientsByFamille(grouped);
        }
      } catch (err) {
        console.error("Erreur chargement ingrédients :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const handleValidate = () => {
    if (
      !formData.phaseAqueuse ||
      !formData.phaseGrasse ||
      !formData.actif ||
      !formData.conservateur
    ) {
      return;
    }
    navigate("/creation-produit/resultat");
  };

  const isComplete =
    formData.phaseAqueuse &&
    formData.phaseGrasse &&
    formData.actif &&
    formData.conservateur;

  if (loading) {
    return (
      <div className="game-card">
        <p>Chargement des ingrédients...</p>
      </div>
    );
  }

  // Helper pour rendre une section
  const renderSection = (icon, title, familleId, fieldKey) => (
    <div className="formula-section">
      <h4 className="formula-section-title">
        {icon} {title}
      </h4>
      <div className="formula-choice-grid">
        {ingredientsByFamille[familleId].map((item) => (
          <button
            key={item}
            type="button"
            className={`formula-choice-card ${formData[fieldKey] === item ? "active" : ""}`}
            onClick={() => updateField(fieldKey, item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="game-card">
      <h3 className="game-section-title">Construire la formule</h3>
      <p className="game-helper">Sélectionnez un ingrédient pour chaque catégorie.</p>

      <div className="formule-layout">
        <div className="formule-main">
          {renderSection(<FaTint />, "Phase aqueuse", 1, "phaseAqueuse")}
          {renderSection(<FaOilCan />, "Phase grasse", 2, "phaseGrasse")}
          {renderSection(<FaFlask />, "Actif principal", 3, "actif")}
          {renderSection(<FaShieldAlt />, "Conservateur", 4, "conservateur")}
        </div>

        <div className="formule-recap">
          <div className="recap-card">
            <h4 className="recap-title">Récapitulatif de la formule</h4>

            <div className="recap-item">
              <span className="recap-label"><FaTint /> Phase aqueuse</span>
              <span className="recap-value">{formData.phaseAqueuse || "Non choisie"}</span>
            </div>

            <div className="recap-item">
              <span className="recap-label"><FaOilCan /> Phase grasse</span>
              <span className="recap-value">{formData.phaseGrasse || "Non choisie"}</span>
            </div>

            <div className="recap-item">
              <span className="recap-label"><FaFlask /> Actif</span>
              <span className="recap-value">{formData.actif || "Non choisi"}</span>
            </div>

            <div className="recap-item">
              <span className="recap-label"><FaShieldAlt /> Conservateur</span>
              <span className="recap-value">{formData.conservateur || "Non choisi"}</span>
            </div>

            <div className={`recap-status ${isComplete ? "complete" : ""}`}>
              <FaCheckCircle />
              <span>{isComplete ? "Formule complète" : "Formule incomplète"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="game-buttons">
        <button className="game-btn secondary" onClick={() => navigate("/creation-produit/type-produit")}>
          Retour
        </button>
        <button className="game-btn primary" onClick={handleValidate}>
          Valider
        </button>
        <button
          className="game-btn ghost"
          onClick={() => {
            resetJeu();
            navigate("/creation-produit/probleme");
          }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default FormuleProduit;