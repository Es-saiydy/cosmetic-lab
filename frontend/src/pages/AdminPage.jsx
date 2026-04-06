import { useEffect, useState } from "react";
import API_URL from "../api";
import "../styles/admin.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
        <h1 className="admin-title">Page administrateur</h1>
        <p className="admin-subtitle">
          Consultez les utilisateurs, leurs scores et supprimez-les si nécessaire.
        </p>

        {message && <div className="admin-message">{message}</div>}

        {loading ? (
          <p className="admin-loading">Chargement...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Score total</th>
                  <th>Nb parties</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id_utilisateur}>
                      <td>{user.id_utilisateur}</td>
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.email}</td>
                      <td>{user.score_total}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;