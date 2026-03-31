import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const ingredients = [
  { id: 1, nom: "Glycérine", icon: "💧", famille: "Humectant", fonction: "Hydratation" },
  { id: 2, nom: "Huile végétale", icon: "🌿", famille: "Phase grasse", fonction: "Nutrition" },
  { id: 3, nom: "Acide hyaluronique", icon: "🔬", famille: "Actif", fonction: "Protection microbienne" },
  { id: 4, nom: "Conservateur", icon: "🧪", famille: "Conservateur", fonction: "Action ciblée" }
];

function MiniJeu2() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const token = localStorage.getItem("token");
  const ing = ingredients[current];

  // Timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleAssociation = (chosenFamille, chosenFonction) => {
    const isCorrect = chosenFamille === ing.famille && chosenFonction === ing.fonction;

    if (isCorrect) setScore(score + 1);

    setFeedback({
      type: isCorrect ? "success" : "error",
      text: isCorrect 
        ? `Bonne réponse ! La ${ing.nom.toLowerCase()} est un ${ing.famille.toLowerCase()} qui aide à ${ing.fonction.toLowerCase()}.`
        : `Mauvaise réponse pour ${ing.nom}.`
    });

    setTimeout(() => {
      setFeedback(null);
      if (current < ingredients.length - 1) {
        setCurrent(current + 1);
      } else {
        setIsRunning(false);
        saveToDatabase();
      }
    }, 2300);
  };

  const saveToDatabase = async () => {
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
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header avec Timer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", background: "#555", color: "white", border: "none", borderRadius: "8px" }}>← Retour</button>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, color: "#0a4d8c" }}>Cosmetic Lab</h1>
            <h2>Mini-jeu 2 : Associer les ingrédients</h2>
            <p>Associez chaque ingrédient à sa famille et à sa fonction.</p>
          </div>

          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#d32f2f" }}>
            ⏱ {formatTime(time)}
          </div>

          <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", background: "#555", color: "white", border: "none", borderRadius: "8px" }}>Quitter</button>
        </div>

        {/* Main Area */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px" }}>

            {/* Ingrédients */}
            <div>
              <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Ingrédients</h3>
              <div style={{ background: "#e3f2fd", borderRadius: "12px", padding: "40px 20px", textAlign: "center", minHeight: "380px" }}>
                <div style={{ fontSize: "70px", marginBottom: "15px" }}>{ing.icon}</div>
                <h3 style={{ fontSize: "24px" }}>{ing.nom}</h3>
              </div>
            </div>

            {/* Familles */}
            <div>
              <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Familles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Humectant", "Phase grasse", "Actif", "Conservateur"].map(fam => (
                  <button key={fam} onClick={() => handleAssociation(fam, ing.fonction)}
                    style={{ padding: "18px", background: "#fff", border: "2px solid #ddd", borderRadius: "10px", fontSize: "17px", cursor: "pointer" }}>
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Fonctions */}
            <div>
              <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Fonctions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Hydratation", "Nutrition", "Protection microbienne", "Action ciblée"].map(fonc => (
                  <button key={fonc} onClick={() => handleAssociation(ing.famille, fonc)}
                    style={{ padding: "18px", background: "#fff", border: "2px solid #ddd", borderRadius: "10px", fontSize: "17px", cursor: "pointer" }}>
                    {fonc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{
              marginTop: "25px",
              padding: "18px",
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

          {/* Progression */}
          <div style={{ textAlign: "center", marginTop: "30px", fontSize: "18px" }}>
            Progression : {current + 1} / {ingredients.length}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MiniJeu2;