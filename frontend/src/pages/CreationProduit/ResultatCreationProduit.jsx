import { useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import API_URL from "../../api";
import {
  FaFlask,
  FaShieldAlt,
  FaLeaf,
  FaCheckCircle,
  FaTint,
  FaOilCan,
} from "react-icons/fa";
import { FaPumpSoap, FaJar, FaBottleDroplet } from "react-icons/fa6";

function ResultatCreationProduit() {
  const navigate = useNavigate();
  const { formData, resetJeu } = useOutletContext();
  const hasSaved = useRef(false);

  const {
    probleme,
    typeProduit,
    phaseAqueuse,
    phaseGrasse,
    actif,
    conservateur,
  } = formData;

  let scoreEfficacite = 0;
  let scoreSecurite = 0;
  let scoreEnvironnement = 0;

  if (probleme === "acne") {
    if (typeProduit === "gel" || typeProduit === "serum") scoreEfficacite += 3;
    if (actif === "Acide salicylique" || actif === "Niacinamide") scoreEfficacite += 5;
    if (phaseGrasse === "Huile de jojoba") scoreEfficacite += 1;
  }

  if (probleme === "seche") {
    if (typeProduit === "creme" || typeProduit === "serum") scoreEfficacite += 3;
    if (actif === "Acide hyaluronique" || actif === "Panthénol") scoreEfficacite += 5;
    if (
      phaseGrasse === "Huile d’amande douce" ||
      phaseGrasse === "Beurre de karité"
    ) {
      scoreEfficacite += 1;
    }
  }

  if (probleme === "sensible") {
    if (typeProduit === "creme" || typeProduit === "serum") scoreEfficacite += 3;
    if (actif === "Panthénol" || actif === "Niacinamide") scoreEfficacite += 5;
    if (phaseAqueuse === "Hydrolat de rose") scoreEfficacite += 1;
  }

  if (scoreEfficacite > 10) scoreEfficacite = 10;

  scoreSecurite = 6;

  if (conservateur !== "Aucun") scoreSecurite += 2;
  else scoreSecurite -= 3;

  if (probleme === "sensible" && actif === "Acide salicylique") scoreSecurite -= 3;
  if (probleme === "acne" && phaseGrasse === "Beurre de karité") scoreSecurite -= 1;

  if (scoreSecurite < 0) scoreSecurite = 0;
  if (scoreSecurite > 10) scoreSecurite = 10;

  scoreEnvironnement = 5;

  if (phaseAqueuse === "Hydrolat de rose" || phaseAqueuse === "Gel d’aloe vera") {
    scoreEnvironnement += 2;
  }

  if (phaseGrasse === "Huile de jojoba" || phaseGrasse === "Huile d’amande douce") {
    scoreEnvironnement += 2;
  }

  if (conservateur === "Benzoate de sodium") scoreEnvironnement += 1;
  if (conservateur === "Phénoxyéthanol") scoreEnvironnement -= 1;

  if (scoreEnvironnement < 0) scoreEnvironnement = 0;
  if (scoreEnvironnement > 10) scoreEnvironnement = 10;

  const scoreTotal = Math.round(
    (scoreEfficacite + scoreSecurite + scoreEnvironnement) / 3
  );

  useEffect(() => {
  if (hasSaved.current) return;
  hasSaved.current = true;

  const token = localStorage.getItem("token");
  if (!token) return;

  const saveToDatabase = async () => {
    try {
      const partieRes = await fetch(`${API_URL}/api/games/parties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_mini_jeu: 1 }),
      });

      if (!partieRes.ok) {
        console.error("Erreur création partie");
        return;
      }

      const partieData = await partieRes.json();
      const id_partie = partieData.id_partie;

      const scoreRes = await fetch(`${API_URL}/api/games/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valeur: scoreTotal,
          temps: 0,
          id_partie,
        }),
      });

      if (!scoreRes.ok) {
        console.error("Erreur enregistrement score");
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  };

  saveToDatabase();
}, [scoreTotal]);

  let commentaire = "";

  if (scoreTotal >= 8) {
    commentaire = "Très bonne formulation : produit cohérent et bien construit.";
  } else if (scoreTotal >= 5) {
    commentaire = "Formulation correcte, mais certains choix peuvent être améliorés.";
  } else {
    commentaire = "Formulation peu adaptée : il faut revoir les choix du produit.";
  }

  const getProduitIcon = () => {
    if (typeProduit === "gel") return <FaPumpSoap />;
    if (typeProduit === "creme") return <FaJar />;
    if (typeProduit === "serum") return <FaBottleDroplet />;
    return <FaFlask />;
  };

  const getProduitLabel = () => {
    if (typeProduit === "gel") return "Gel cosmétique";
    if (typeProduit === "creme") return "Crème cosmétique";
    if (typeProduit === "serum") return "Sérum cosmétique";
    return "Produit cosmétique";
  };

  return (
    <div className="result-layout">
      <div className="result-card">
        <div className="result-title-row">
          <FaCheckCircle className="result-main-icon" />
          <h2>Résultat de la formulation</h2>
        </div>

        <div className="score-total-box">
          <span>Score total</span>
          <strong>{scoreTotal} / 10</strong>
        </div>

        <div className="score-grid">
          <div className="score-box">
            <div className="score-box-top">
              <FaFlask />
              <span>Efficacité</span>
            </div>
            <strong>{scoreEfficacite} / 10</strong>
          </div>

          <div className="score-box">
            <div className="score-box-top">
              <FaShieldAlt />
              <span>Sécurité</span>
            </div>
            <strong>{scoreSecurite} / 10</strong>
          </div>

          <div className="score-box">
            <div className="score-box-top">
              <FaLeaf />
              <span>Environnement</span>
            </div>
            <strong>{scoreEnvironnement} / 10</strong>
          </div>
        </div>

        <p className="result-comment">{commentaire}</p>

        <div className="result-formule-summary">
          <h3>Résumé de la formule</h3>

          <div className="result-summary-item">
            <span><FaTint /> Phase aqueuse</span>
            <strong>{phaseAqueuse}</strong>
          </div>

          <div className="result-summary-item">
            <span><FaOilCan /> Phase grasse</span>
            <strong>{phaseGrasse}</strong>
          </div>

          <div className="result-summary-item">
            <span><FaFlask /> Actif principal</span>
            <strong>{actif}</strong>
          </div>

          <div className="result-summary-item">
            <span><FaShieldAlt /> Conservateur</span>
            <strong>{conservateur}</strong>
          </div>
        </div>

        <div className="game-buttons">
          <button
            className="game-btn secondary"
            onClick={() => navigate("/creation-produit/formule")}
          >
            Retour
          </button>

          <button
            className="game-btn primary"
            onClick={() =>
              navigate("/resultat", {
                state: {
                  score: scoreTotal,
                  total: 10,
                  nextGame: "/mini-jeu-2",
                  replayPath: "/creation-produit/probleme",
                  message: commentaire,
                },
              })
            }
          >
            Continuer
          </button>

          <button
            className="game-btn ghost"
            onClick={() => {
              resetJeu();
              navigate("/creation-produit/probleme");
            }}
          >
            Recommencer
          </button>
        </div>
      </div>

      <div className="preview-card">
        <h3 className="preview-title">Preview du produit</h3>

        <div className="preview-product">
          <div className="preview-product-icon">
            {getProduitIcon()}
          </div>

          <h4>{getProduitLabel()}</h4>
          <p className="preview-problem">
            Conçu pour :{" "}
            <strong>
              {probleme === "acne"
                ? "Acné"
                : probleme === "seche"
                ? "Peau sèche"
                : "Peau sensible"}
            </strong>
          </p>
        </div>

        <div className="preview-tags">
          <div className="preview-tag"><FaTint /> {phaseAqueuse}</div>
          <div className="preview-tag"><FaOilCan /> {phaseGrasse}</div>
          <div className="preview-tag"><FaFlask /> {actif}</div>
          <div className="preview-tag"><FaShieldAlt /> {conservateur}</div>
        </div>
      </div>
    </div>
  );
}

export default ResultatCreationProduit;