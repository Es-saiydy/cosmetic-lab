import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../styles/leaderboard.css";

function LeaderboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [userResults, setUserResults] = useState([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, globalRes] = await Promise.all([
          fetch(`${API_URL}/api/leaderboard/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/api/leaderboard/global`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const userData = await userRes.json();
        const globalData = await globalRes.json();

        if (userRes.ok) {
          setUserResults(userData);
        }

        if (globalRes.ok) {
          setGlobalLeaderboard(globalData);
        }

        if (!userRes.ok || !globalRes.ok) {
          setMessage("Impossible de charger les résultats.");
        }
      } catch (error) {
        setMessage("Erreur serveur : " + error.message);
      }
    };

    if (user?.id && token) {
      fetchData();
    }
  }, [user, token]);

const totals = useMemo(() => {
  return userResults.reduce(
    (acc, item) => {
      acc.totalScore += Number(item.score_total || 0);
      acc.totalTime += Number(item.temps_effectue_s || 0);
      return acc;
    },
    { totalScore: 0, totalTime: 0 }
  );
}, [userResults]);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>Résultats & Classement</h1>
          <button className="leaderboard-back" onClick={() => navigate("/dashboard")}>
            Retour dashboard
          </button>
        </div>

        {message && <div className="leaderboard-message">{message}</div>}

        <div className="leaderboard-card">
          <h2>Mes statistiques</h2>
          <div className="leaderboard-stats">
            <div className="leaderboard-stat-box">
              <span>Score total</span>
              <strong>{totals.totalScore}</strong>
            </div>

            <div className="leaderboard-stat-box">
              <span>Temps cumulé</span>
              <strong>{totals.totalTime}s</strong>
            </div>

            <div className="leaderboard-stat-box">
              <span>Mini-jeux joués</span>
              <strong>{userResults.length}</strong>
            </div>
          </div>
        </div>

        <div className="leaderboard-card">
          <h2>Mes meilleurs scores par mini-jeu</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Mini-jeu</th>
                <th>Score</th>
                <th>Efficacité</th>
                <th>Sécurité</th>
                <th>Environnement</th>
                <th>Temps</th>
              </tr>
            </thead>
            <tbody>
              {userResults.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun résultat disponible.</td>
                </tr>
              ) : (
                userResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.mini_jeu}</td>
                    <td>{result.score_total}</td>
                    <td>{result.score_efficacite ?? "-"}</td>
                    <td>{result.score_securite ?? "-"}</td>
                    <td>{result.score_environnement ?? "-"}</td>
                    <td>{result.temps_effectue_s ?? 0}s</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="leaderboard-card">
          <h2>Classement général</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Utilisateur</th>
                <th>meilleur score</th>
                <th>Temps</th>
                <th>Parties</th>
              </tr>
            </thead>
            <tbody>
              {globalLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5">Aucun classement disponible.</td>
                </tr>
              ) : (
                globalLeaderboard.map((player, index) => (
                  <tr key={player.id_utilisateur}>
                    <td>{index + 1}</td>
                    <td>{player.prenom} {player.nom}</td>
                    <td>{player.best_score}</td>
                    <td>{player.best_time}s</td>
                    <td>{player.nb_parties}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;