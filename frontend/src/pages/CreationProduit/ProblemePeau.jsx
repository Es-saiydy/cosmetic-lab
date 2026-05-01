import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaSadTear, FaTint, FaExclamationTriangle } from "react-icons/fa";
import API_URL from "../../api";

const iconsByCode = {
  acne: <FaSadTear size={28} />,
  seche: <FaTint size={28} />,
  sensible: <FaExclamationTriangle size={28} />,
};

function ProblemePeau() {
  const navigate = useNavigate();
  const { formData, updateField } = useOutletContext();

  const [problemes, setProblemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games/problemes-peau`);
        const data = await res.json();
        if (res.ok) setProblemes(data);
      } catch (err) {
        console.error("Erreur chargement problèmes peau :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemes();
  }, []);

  const handleNext = () => {
    if (!formData.probleme) return;
    navigate("/creation-produit/type-produit");
  };

  if (loading) {
    return (
      <div className="game-card">
        <p>Chargement des problèmes de peau...</p>
      </div>
    );
  }

  return (
    <div className="game-card">
      <h3 className="game-section-title">Choisir un problème de peau</h3>

      <div className="choice-grid">
        {problemes.map((p) => (
          <button
            key={p.id_probleme}
            type="button"
            className={`choice-card ${formData.probleme === p.code ? "active" : ""}`}
            onClick={() => updateField("probleme", p.code)}
          >
            {iconsByCode[p.code] || <FaTint size={28} />}
            <p>{p.libelle}</p>
          </button>
        ))}
      </div>

      <button className="game-btn primary" onClick={handleNext}>
        Suivant
      </button>
    </div>
  );
}

export default ProblemePeau;