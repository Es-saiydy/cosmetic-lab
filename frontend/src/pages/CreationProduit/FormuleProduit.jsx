import { useNavigate, useOutletContext } from "react-router-dom";
import { FaTint, FaOilCan, FaFlask, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function FormuleProduit() {
  const navigate = useNavigate();
  const { formData, updateField, resetJeu } = useOutletContext();

  const options = {
    aqueuse: ["Eau purifiée", "Hydrolat de rose", "Gel d’aloe vera"],
    grasse: ["Huile de jojoba", "Huile d’amande douce", "Beurre de karité"],
    actifs: [
      "Acide salicylique",
      "Niacinamide",
      "Acide hyaluronique",
      "Panthénol",
    ],
    conservateurs: ["Phénoxyéthanol", "Benzoate de sodium", "Aucun"],
  };

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

  return (
    <div className="game-card">
      <h3 className="game-section-title">Construire la formule</h3>
      <p className="game-helper">
        Sélectionnez un ingrédient pour chaque catégorie.
      </p>

      <div className="formule-layout">
        <div className="formule-main">
          <div className="formula-section">
            <h4 className="formula-section-title">
              <FaTint /> Phase aqueuse
            </h4>
            <div className="formula-choice-grid">
              {options.aqueuse.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`formula-choice-card ${
                    formData.phaseAqueuse === item ? "active" : ""
                  }`}
                  onClick={() => updateField("phaseAqueuse", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4 className="formula-section-title">
              <FaOilCan /> Phase grasse
            </h4>
            <div className="formula-choice-grid">
              {options.grasse.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`formula-choice-card ${
                    formData.phaseGrasse === item ? "active" : ""
                  }`}
                  onClick={() => updateField("phaseGrasse", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4 className="formula-section-title">
              <FaFlask /> Actif principal
            </h4>
            <div className="formula-choice-grid">
              {options.actifs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`formula-choice-card ${
                    formData.actif === item ? "active" : ""
                  }`}
                  onClick={() => updateField("actif", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4 className="formula-section-title">
              <FaShieldAlt /> Conservateur
            </h4>
            <div className="formula-choice-grid">
              {options.conservateurs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`formula-choice-card ${
                    formData.conservateur === item ? "active" : ""
                  }`}
                  onClick={() => updateField("conservateur", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="formule-recap">
          <div className="recap-card">
            <h4 className="recap-title">Récapitulatif de la formule</h4>

            <div className="recap-item">
              <span className="recap-label">
                <FaTint /> Phase aqueuse
              </span>
              <span className="recap-value">
                {formData.phaseAqueuse || "Non choisie"}
              </span>
            </div>

            <div className="recap-item">
              <span className="recap-label">
                <FaOilCan /> Phase grasse
              </span>
              <span className="recap-value">
                {formData.phaseGrasse || "Non choisie"}
              </span>
            </div>

            <div className="recap-item">
              <span className="recap-label">
                <FaFlask /> Actif
              </span>
              <span className="recap-value">
                {formData.actif || "Non choisi"}
              </span>
            </div>

            <div className="recap-item">
              <span className="recap-label">
                <FaShieldAlt /> Conservateur
              </span>
              <span className="recap-value">
                {formData.conservateur || "Non choisi"}
              </span>
            </div>

            <div className={`recap-status ${isComplete ? "complete" : ""}`}>
              <FaCheckCircle />
              <span>
                {isComplete
                  ? "Formule complète"
                  : "Formule incomplète"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="game-buttons">
        <button
          className="game-btn secondary"
          onClick={() => navigate("/creation-produit/type-produit")}
        >
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