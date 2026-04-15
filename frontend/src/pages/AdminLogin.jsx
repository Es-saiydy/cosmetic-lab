import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield } from "react-icons/fa";
import API_URL from "../api";
import "../styles/adminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
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
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...data.admin,
            isAdmin: true,
          })
        );

        navigate("/admin");
      } else {
        setMessage(data.message || data.error || "Erreur de connexion admin");
      }
    } catch (error) {
      setMessage("Erreur serveur : " + error.message);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <button
          className="admin-login-back"
          onClick={() => navigate("/")}
        >
          ← Retour
        </button>

        <div className="admin-login-header">
          <div className="admin-login-icon">
            <FaUserShield />
          </div>
          <h1>Connexion administrateur</h1>
          <p>Accédez à l’espace de gestion de Cosmetic Lab.</p>
        </div>

        <div className="admin-login-card">
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-field">
              <label>Email administrateur</label>
              <input
                type="email"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Mot de passe</label>
              <div className="admin-password-wrapper">
                <FaLock className="admin-password-icon" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="admin-login-btn">
              Se connecter
            </button>
          </form>

          {message && <div className="admin-login-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;