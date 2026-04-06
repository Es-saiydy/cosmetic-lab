import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../styles/auth.css";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (motDePasse !== confirmation) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe: motDePasse,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setMessage(data.message || data.error || "Erreur d'inscription");
      }
    } catch (error) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => navigate("/login")}>
          ← Retour
        </button>
      </div>

      <div className="auth-header">
        <div className="auth-brand">
          <span className="auth-logo">⚗️</span>
          <span className="auth-brand-text">Cosmetic Lab</span>
        </div>

        <h1 className="auth-title">Inscription</h1>
      </div>

      <div className="auth-card">
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-input-wrapper">
          <FiUser className="auth-input-icon" />
          <input
            className="auth-input"
            type="text"
            placeholder="Nom prénom"
            value={`${prenom}${prenom && nom ? " " : ""}${nom}`}
            onChange={(e) => {
                const value = e.target.value.trimStart();
                const parts = value.split(" ");
                setPrenom(parts[0] || "");
                setNom(parts.slice(1).join(" ") || "");
            }}
            required
        />
      </div>

          <div className="auth-input-wrapper">
            <FiMail className="auth-input-icon" />
            <input
                className="auth-input"
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="auth-input-wrapper">
            <FiLock className="auth-input-icon" />
            <input
                className="auth-input"
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
            required
            />
          </div>

          <div className="auth-input-wrapper">
            <FiLock className="auth-input-icon" />
            <input
                className="auth-input"
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
            />
          </div>

          <button className="auth-button" type="submit">
            INSCRIPTION
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-footer-link">
          <span>Déjà un compte ? </span>
          <Link to="/login">Connexion</Link>
        </div>
      </div>

      <div className="auth-bottom-text">Projet pédagogique — L3 MIAGE</div>
    </div>
  );
}

export default Register;