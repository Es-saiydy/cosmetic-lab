import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const ingredients = [
  { id: 1, nom: "Glycérine", icon: "💧", famille: "Humectant", fonction: "Hydratation" },
  { id: 2, nom: "Huile végétale", icon: "🌿", famille: "Phase grasse", fonction: "Nutrition" },
  { id: 3, nom: "Acide hyaluronique", icon: "🔬", famille: "Actif", fonction: "Protection microbienne" },
  { id: 4, nom: "Conservateur", icon: "🧪", famille: "Conservateur", fonction: "Action ciblée" },
  { id: 5, nom: "Vitamine C", icon: "🍊", famille: "Actif", fonction: "Antioxydant" },
  { id: 6, nom: "Beurre de karité", icon: "🧴", famille: "Phase grasse", fonction: "Nourrissant" },
  { id: 7, nom: "Aloe vera", icon: "🌱", famille: "Humectant", fonction: "Apaisant" },
  { id: 8, nom: "Niacinamide", icon: "🧪", famille: "Actif", fonction: "Régulateur de sébum" },
  { id: 9, nom: "Hyaluronate de sodium", icon: "💧", famille: "Humectant", fonction: "Hydratation intense" },
  { id: 10, nom: "Cire d'abeille", icon: "🐝", famille: "Phase grasse", fonction: "Protecteur" },
  { id: 11, nom: "Extrait de thé vert", icon: "🍵", famille: "Actif", fonction: "Antioxydant" },
  { id: 12, nom: "Parfum", icon: "🌸", famille: "Conservateur", fonction: "Parfumant" },
  { id: 13, nom: "Collagène", icon: "🧬", famille: "Actif", fonction: "Anti-âge" },
  { id: 14, nom: "Huile de coco", icon: "🥥", famille: "Phase grasse", fonction: "Hydratation" },
  { id: 15, nom: "Extrait de rose", icon: "🌹", famille: "Actif", fonction: "Apaisant" },
  { id: 16, nom: "Tocophérol", icon: "🧴", famille: "Conservateur", fonction: "Antioxydant" }
];

function MiniJeu2() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedFamille, setSelectedFamille] = useState(null);
  const [selectedFonction, setSelectedFonction] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showTimeWarning, setShowTimeWarning] = useState(true);

  const token = localStorage.getItem("token");
  const ing = ingredients[current];

  // Timer 10 minutes
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev + 1 >= 600) {
            setIsRunning(false);
            saveToDatabase();
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Notification d'avertissement temps (à droite) qui disparaît après 4 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeWarning(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleFamille = (fam) => setSelectedFamille(fam);
  const handleFonction = (fonc) => setSelectedFonction(fonc);

  const handleValidate = () => {
    if (!selectedFamille || !selectedFonction) {
      alert("Vous devez choisir une famille ET une fonction");
      return;
    }

    const familleCorrect = selectedFamille === ing.famille;
    const fonctionCorrect = selectedFonction === ing.fonction;

    let message = "";
    if (familleCorrect && fonctionCorrect) {
      setScore(score + 1);
      message = `✅ Excellent ! La ${ing.nom.toLowerCase()} est bien un ${ing.famille.toLowerCase()} qui aide à ${ing.fonction.toLowerCase()}.`;
    } else if (familleCorrect) {
      message = `✅ Famille correcte, mais la fonction est fausse.`;
    } else if (fonctionCorrect) {
      message = `✅ Fonction correcte, mais la famille est fausse.`;
    } else {
      message = `❌ Les deux sont faux pour ${ing.nom}.`;
    }

    setFeedback({ type: familleCorrect && fonctionCorrect ? "success" : "error", text: message });

    setTimeout(() => {
      setFeedback(null);
      setSelectedFamille(null);
      setSelectedFonction(null);

      if (current < ingredients.length - 1) {
        setCurrent(current + 1);
      } else {
        setIsRunning(false);
        saveToDatabase();
      }
    }, 2600);
  };

  const saveToDatabase = useCallback(async () => {
    if (!token) {
      navigate("/resultat", { state: { score, total: ingredients.length } });
      return;
    }

    try {
      const partieRes = await fetch(`${API_URL}/api/games/partie`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id_mini_jeu: 2 })
      });

      const partieData = await partieRes.json();
      const id_partie = partieData.id_partie;

      await fetch(`${API_URL}/api/games/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id_partie, score_total: score })
      });

      navigate("/resultat", { state: { score, total: ingredients.length } });
    } catch (error) {
      console.error(error);
      navigate("/resultat", { state: { score, total: ingredients.length } });
    }
  }, [token, score, navigate]);

  const handleQuitter = () => {
    setIsRunning(false);
    saveToDatabase();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "30px 20px", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={handleQuitter} style={{ padding: "12px 24px", background: "#555", color: "white", border: "none", borderRadius: "10px" }}>← Retour</button>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, color: "#0a4d8c", fontSize: "36px" }}>Cosmetic Lab</h1>
            <h2>Mini-jeu 2 : Associer les ingrédients</h2>
            <p>Choisissez la famille et la fonction correctes pour chaque ingrédient.</p>
          </div>

          <div style={{ fontSize: "26px", fontWeight: "bold", color: time >= 540 ? "#d32f2f" : "#222" }}>
            ⏱ {formatTime(time)}
          </div>

          <button onClick={handleQuitter} style={{ padding: "12px 24px", background: "#555", color: "white", border: "none", borderRadius: "10px" }}>Quitter</button>
        </div>

        {/* Notification d'avertissement temps à droite */}
        {showTimeWarning && (
          <div style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            background: "#ffebee",
            color: "#c62828",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            fontWeight: "bold",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
            maxWidth: "380px"
          }}>
            ⚠️ Attention : Ne dépassez pas 10 minutes dans le jeu !
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: "16px", padding: "35px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px" }}>

            <div>
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Ingrédient</h3>
              <div style={{ background: "#e3f2fd", borderRadius: "12px", padding: "40px 20px", textAlign: "center", minHeight: "380px" }}>
                <div style={{ fontSize: "80px", marginBottom: "15px" }}>{ing.icon}</div>
                <h3>{ing.nom}</h3>
              </div>
            </div>

            <div>
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Famille</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Humectant", "Phase grasse", "Actif", "Conservateur"].map(fam => (
                  <button key={fam} onClick={() => handleFamille(fam)}
                    style={{ padding: "18px", background: selectedFamille === fam ? "#1976d2" : "#fff", color: selectedFamille === fam ? "white" : "black", border: "2px solid #ddd", borderRadius: "10px", fontSize: "17px", cursor: "pointer" }}>
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Fonction</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Hydratation", "Nutrition", "Protection microbienne", "Action ciblée"].map(fonc => (
                  <button key={fonc} onClick={() => handleFonction(fonc)}
                    style={{ padding: "18px", background: selectedFonction === fonc ? "#1976d2" : "#fff", color: selectedFonction === fonc ? "white" : "black", border: "2px solid #ddd", borderRadius: "10px", fontSize: "17px", cursor: "pointer" }}>
                    {fonc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button onClick={handleValidate} style={{ padding: "16px 70px", background: "#1976d2", color: "white", border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer" }}>
              VALIDER
            </button>
          </div>

          {feedback && (
            <div style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: feedback.type === "success" ? "#e8f5e9" : "#ffebee",
              color: feedback.type === "success" ? "#2e7d32" : "#c62828",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "17px"
            }}>
              {feedback.text}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "30px", fontSize: "18px" }}>
            Progression : {current + 1} / {ingredients.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniJeu2;