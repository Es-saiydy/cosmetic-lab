import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const score = state?.score ?? 0;
  const total = state?.total ?? 10;
  const message = state?.message ?? "";
  
  const replayPath = state?.replayPath ?? null; 
  
  const percentage = Math.round((score / total) * 100);

  if (!state) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Aucun résultat disponible</h2>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.primaryBtn}
        >
          Retour Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.brand}>Cosmetic Lab</h1>
        <h2 style={{ marginBottom: "30px" }}>Résultat du mini-jeu</h2>

        <div style={{
            ...styles.scoreDisplay,
            color: percentage >= 70 ? "#2e7d32" : "#d32f2f",
          }}>
          {score} / {total}
        </div>

        <div style={{ fontSize: "24px", marginBottom: "30px" }}>
          {percentage}% de bonnes réponses
        </div>

        <div style={{
            ...styles.feedbackBox,
            background: percentage >= 70 ? "#e8f5e9" : "#ffebee",
            color: percentage >= 70 ? "#2e7d32" : "#c62828",
          }}>
          {percentage >= 80
            ? "🎉 Excellent travail !"
            : percentage >= 60
            ? "👍 Bon résultat !"
            : "😕 Tu peux faire mieux la prochaine fois"}
        </div>

        {message && (
          <p style={{ fontSize: "18px", color: "#444", marginBottom: "30px" }}>
            {message}
          </p>
        )}

        <div style={styles.buttonGroup}>
          {/* BOUTON REJOUER : Utilise replayPath s'il existe, sinon recharge la page précédente */}
          <button
            onClick={() => replayPath ? navigate(replayPath) : navigate(-1)}
            style={styles.replayBtn}
          >
            Rejouer
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={styles.dashboardBtn}
          >
            Retour au Dashboard
          </button>
        </div>

        <p style={{ color: "#666", fontSize: "14px", marginTop: "25px" }}>
          Ton score a été enregistré dans la base de données.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f9fa", padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  card: { maxWidth: "600px", width: "100%", background: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1", padding: "50px 40px", textAlign: "center" },
  brand: { fontSize: "42px", color: "#0a4d8c", marginBottom: "10px", fontWeight: "bold" },
  scoreDisplay: { fontSize: "90px", fontWeight: "bold", marginBottom: "10px" },
  feedbackBox: { padding: "20px", borderRadius: "12px", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" },
  buttonGroup: { display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" },
  replayBtn: { padding: "14px 40px", background: "#43a047", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "bold" },
  dashboardBtn: { padding: "14px 40px", background: "#1976d2", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "bold" },
  primaryBtn: { padding: "14px 40px", background: "#1976d2", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer" }
};

export default Resultat;