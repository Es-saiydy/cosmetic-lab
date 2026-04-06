import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";
import "../styles/auth.css";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe: motDePasse,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setMessage(data.message || data.error || "Erreur de connexion");
      }
    } catch (error) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => navigate("/")}>
          ← Retour
        </button>
      </div>

      <div className="auth-header">
        <div className="auth-brand">
          <span className="auth-logo">⚗️</span>
          <span className="auth-brand-text">Cosmetic Lab</span>
        </div>

        <h1 className="auth-title">Connexion</h1>

        <p className="auth-subtitle">Bienvenue sur le panneau d'administration.</p>
        <p className="auth-subtitle">Gérez et suivez les résultats des mini-jeux.</p>
      </div>

      <div className="auth-card">
        <form className="auth-form" onSubmit={handleLogin}>
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
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
            />

            <button
                type="button"
                className="auth-input-right"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button className="auth-button" type="submit">
            CONNEXION
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-footer-link">
          <Link to="/register">Inscription</Link>
        </div>
      </div>

      <div className="auth-bottom-text">Projet pédagogique — L3 MIAGE</div>
    </div>
  );
}

export default Login;