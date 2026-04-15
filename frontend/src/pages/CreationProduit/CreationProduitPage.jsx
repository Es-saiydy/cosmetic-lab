import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../styles/creationProduit.css";

function CreationProduitPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    probleme: "",
    typeProduit: "",
    phaseAqueuse: "",
    phaseGrasse: "",
    actif: "",
    conservateur: "",
  });

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Temps écoulé !");
      navigate("/creation-produit/resultat");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

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
    setTimeLeft(300);
  };

  const getStep = () => {
    if (location.pathname.includes("probleme")) return 1;
    if (location.pathname.includes("type-produit")) return 2;
    if (location.pathname.includes("formule")) return 3;
    return 3;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

        <div className={`game-timer ${timeLeft < 60 ? "danger" : ""}`}>
          ⏱️ Temps restant : {formatTime(timeLeft)}
        </div>

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

        <Outlet context={{ formData, updateField, resetJeu, timeLeft }} />
      </div>
    </div>
  );
}

export default CreationProduitPage;