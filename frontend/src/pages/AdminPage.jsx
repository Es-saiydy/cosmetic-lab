import { useEffect, useState } from "react";
import API_URL from "../api";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/admin-login");
  };
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        setMessage(data.message || data.error || "Impossible de charger les utilisateurs.");
      }
    } catch (error) {
      setMessage("Erreur serveur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, nom, prenom) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer ${prenom} ${nom} ?`
    );

    if (!confirmation) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Utilisateur supprimé avec succès.");
        setUsers((prev) => prev.filter((user) => user.id_utilisateur !== id));
      } else {
        setMessage(data.message || data.error || "Erreur lors de la suppression.");
      }
    } catch (error) {
      setMessage("Erreur serveur : " + error.message);
    }
  };

 return (
  <div className="admin-page">
    <div className="admin-container">
      
      <div className="admin-header">
        <div>
          <h1>🛠️ Administration</h1>
            <p>Gestion des utilisateurs et des scores</p>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
      
      {message && <div className="admin-alert">{message}</div>}

      {loading ? (
        <p className="admin-loading">Chargement...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>👤 Nom</th>
                <th>📧 Email</th>
                <th>🎯 Score total</th>
                <th>🎮 Parties</th>
                <th>⚙️ Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id_utilisateur}>
                  <td>{user.prenom} {user.nom}</td>
                  <td>{user.email}</td>
                  <td className="score">{user.score_total}</td>
                  <td>{user.nb_parties}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          user.id_utilisateur,
                          user.nom,
                          user.prenom
                        )
                      }
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
}

export default AdminPage;