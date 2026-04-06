import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/creationProduit.css";
import { useNavigate } from "react-router-dom";

function CreationProduitPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    probleme: "",
    typeProduit: "",
    phaseAqueuse: "",
    phaseGrasse: "",
    actif: "",
    conservateur: "",
  });

  const location = useLocation();

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetJeu = () => {
    setFormData({
      probleme: "",
      typeProduit: "",
      phaseAqueuse: "",
      phaseGrasse: "",
      actif: "",
      conservateur: "",
    });
  };

  const getStep = () => {
    if (location.pathname.includes("probleme")) return 1;
    if (location.pathname.includes("type-produit")) return 2;
    if (location.pathname.includes("formule")) return 3;
    return 3;
  };

  const currentStep = getStep();

  return (

    <div className="game-page">
      <div className="game-container">
        <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
        >
            ← Retour au dashboard
        </button>
        <h1 className="game-title">Création d’un produit cosmétique</h1>
        <p className="game-subtitle">
          Avance étape par étape pour formuler un produit adapté.
        </p>

        <div className="game-progress">
          <div className={`game-step-pill ${currentStep >= 1 ? "active" : ""}`}>
            Problème de peau
          </div>
          <div className={`game-step-pill ${currentStep >= 2 ? "active" : ""}`}>
            Type de produit
          </div>
          <div className={`game-step-pill ${currentStep >= 3 ? "active" : ""}`}>
            Formule
          </div>
        </div>

        <Outlet context={{ formData, updateField, resetJeu }} />
      </div>
    </div>
  );
}

export default CreationProduitPage;