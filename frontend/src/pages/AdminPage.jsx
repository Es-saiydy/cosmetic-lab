import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import API_URL from "../api";
import "../styles/admin.css";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState(null);
  const [byMiniJeu, setByMiniJeu] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, overviewRes, miniJeuRes, topRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/stats/overview`, { headers }),
        fetch(`${API_URL}/api/admin/stats/by-minijeu`, { headers }),
        fetch(`${API_URL}/api/admin/stats/top-players`, { headers }),
      ]);

      const usersData = await usersRes.json();
      const overviewData = await overviewRes.json();
      const miniJeuData = await miniJeuRes.json();
      const topData = await topRes.json();

      if (usersRes.ok) setUsers(usersData);
      if (overviewRes.ok) setOverview(overviewData);
      if (miniJeuRes.ok) setByMiniJeu(miniJeuData);
      if (topRes.ok) setTopPlayers(topData);
    } catch (error) {
      setMessage("Erreur serveur : " + error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Utilisateur supprimé");
        fetchAll();
      } else {
        setMessage(data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      setMessage("Erreur serveur : " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>🧪 Cosmetic Lab — Tableau de bord</h1>
          <p className="admin-subtitle">Vue d'ensemble de l'activité</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </header>

      {message && <div className="admin-message">{message}</div>}

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-value">{overview?.total_users ?? 0}</div>
          <div className="kpi-label">Utilisateurs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🎮</div>
          <div className="kpi-value">{overview?.total_parties ?? 0}</div>
          <div className="kpi-label">Parties jouées</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-value">{overview?.total_scores ?? 0}</div>
          <div className="kpi-label">Scores enregistrés</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-value">{overview?.avg_score ?? 0}<span className="kpi-suffix">/100</span></div>
          <div className="kpi-label">Score moyen global</div>
        </div>
      </section>

      {/* Graphiques */}
      <section className="charts-grid">
        <div className="chart-card">
          <h2>Score moyen par mini-jeu</h2>
          {byMiniJeu.length === 0 ? (
            <p className="empty-text">Aucune partie jouée</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byMiniJeu}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mini_jeu" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score_moyen" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>Répartition des parties</h2>
          {byMiniJeu.length === 0 || byMiniJeu.every(m => m.nb_parties === 0) ? (
            <p className="empty-text">Aucune partie jouée</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={byMiniJeu}
                  dataKey="nb_parties"
                  nameKey="mini_jeu"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={(entry) => `${entry.nb_parties}`}
                >
                  {byMiniJeu.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Top 5 */}
      <section className="top-players-section">
        <h2>🏆 Top 5 joueurs</h2>
        {topPlayers.length === 0 ? (
          <p className="empty-text">Aucun joueur classé pour l'instant</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Joueur</th>
                <th>Parties</th>
                <th>Meilleur score</th>
                <th>Score moyen</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((p, idx) => (
                <tr key={p.id_utilisateur}>
                  <td className="rank">#{idx + 1}</td>
                  <td>{p.prenom} {p.nom}</td>
                  <td>{p.nb_parties}</td>
                  <td className="score">{p.best_score} / 100</td>
                  <td>{p.avg_score} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Liste des utilisateurs */}
      <section className="users-section">
        <h2>👥 Tous les utilisateurs</h2>
        {users.length === 0 ? (
          <p className="empty-text">Aucun utilisateur</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Score total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id_utilisateur}>
                  <td>{user.id_utilisateur}</td>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td className="score">{user.score_total} pts</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(user.id_utilisateur)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminPage;