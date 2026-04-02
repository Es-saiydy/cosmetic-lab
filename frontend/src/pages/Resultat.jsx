import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const score = state?.score ?? 0;
  const total = state?.total ?? 16;
  const percentage = Math.round((score / total) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 20px", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%", background: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", padding: "50px 40px", textAlign: "center" }}>

        <h1 style={{ fontSize: "42px", color: "#0a4d8c", marginBottom: "10px" }}>Cosmetic Lab</h1>
        <h2 style={{ marginBottom: "30px" }}>Résultat du Mini-jeu 2</h2>

        <div style={{ fontSize: "90px", fontWeight: "bold", color: percentage >= 70 ? "#2e7d32" : "#d32f2f", marginBottom: "10px" }}>
          {score} / {total}
        </div>

        <div style={{ fontSize: "24px", marginBottom: "30px" }}>
          {percentage}% de bonnes réponses
        </div>

        <div style={{
          background: percentage >= 70 ? "#e8f5e9" : "#ffebee",
          color: percentage >= 70 ? "#2e7d32" : "#c62828",
          padding: "20px",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "40px"
        }}>
          {percentage >= 80 ? "🎉 Excellent travail !" : 
           percentage >= 60 ? "👍 Bon résultat !" : 
           "😕 Tu peux faire mieux la prochaine fois"}
        </div>

        <button 
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "18px 60px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "20px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Retour au Dashboard
        </button>

        <p style={{ color: "#666", fontSize: "16px" }}>
          Ton score a été enregistré dans la base de données.
        </p>
      </div>
    </div>
  );
}

export default Resultat;