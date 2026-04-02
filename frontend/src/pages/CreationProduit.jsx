import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../styles/creationProduit.css";

function CreationProduit() {
  const navigate = useNavigate();

  const [probleme, setProbleme] = useState("");
  const [typeProduit, setTypeProduit] = useState("");
  const [phaseAqueuse, setPhaseAqueuse] = useState("");
  const [phaseGrasse, setPhaseGrasse] = useState("");
  const [actif, setActif] = useState("");
  const [conservateur, setConservateur] = useState("");

  const [resultat, setResultat] = useState(null);
  const [message, setMessage] = useState("");
  const [sauvegardeMessage, setSauvegardeMessage] = useState("");

  const options = {
    aqueuse: ["Eau purifiée", "Hydrolat de rose", "Gel d’aloe vera"],
    grasse: ["Huile de jojoba", "Huile d’amande douce", "Beurre de karité"],
    actifs: [
      "Acide salicylique",
      "Niacinamide",
      "Acide hyaluronique",
      "Panthénol",
    ],
    conservateurs: ["Phénoxyéthanol", "Benzoate de sodium", "Aucun"],
  };

  const resetJeu = () => {
    setProbleme("");
    setTypeProduit("");
    setPhaseAqueuse("");
    setPhaseGrasse("");
    setActif("");
    setConservateur("");
    setResultat(null);
    setMessage("");
    setSauvegardeMessage("");
  };

  const handleValidation = async () => {
    setSauvegardeMessage("");

    if (
      !probleme ||
      !typeProduit ||
      !phaseAqueuse ||
      !phaseGrasse ||
      !actif ||
      !conservateur
    ) {
      setMessage("Veuillez compléter toutes les étapes de formulation.");
      setResultat(null);
      return;
    }

    let scoreEfficacite = 0;
    let scoreSecurite = 0;
    let scoreEnvironnement = 0;

    if (probleme === "acne") {
      if (typeProduit === "gel" || typeProduit === "serum") {
        scoreEfficacite += 3;
      }
      if (actif === "Acide salicylique" || actif === "Niacinamide") {
        scoreEfficacite += 5;
      }
      if (phaseGrasse === "Huile de jojoba") {
        scoreEfficacite += 1;
      }
    }

    if (probleme === "seche") {
      if (typeProduit === "creme" || typeProduit === "serum") {
        scoreEfficacite += 3;
      }
      if (actif === "Acide hyaluronique" || actif === "Panthénol") {
        scoreEfficacite += 5;
      }
      if (
        phaseGrasse === "Huile d’amande douce" ||
        phaseGrasse === "Beurre de karité"
      ) {
        scoreEfficacite += 1;
      }
    }

    if (probleme === "sensible") {
      if (typeProduit === "creme" || typeProduit === "serum") {
        scoreEfficacite += 3;
      }
      if (actif === "Panthénol" || actif === "Niacinamide") {
        scoreEfficacite += 5;
      }
      if (phaseAqueuse === "Hydrolat de rose") {
        scoreEfficacite += 1;
      }
    }

    if (scoreEfficacite > 10) scoreEfficacite = 10;

    scoreSecurite = 6;

    if (conservateur !== "Aucun") {
      scoreSecurite += 2;
    } else {
      scoreSecurite -= 3;
    }

    if (probleme === "sensible" && actif === "Acide salicylique") {
      scoreSecurite -= 3;
    }

    if (probleme === "acne" && phaseGrasse === "Beurre de karité") {
      scoreSecurite -= 1;
    }

    if (scoreSecurite < 0) scoreSecurite = 0;
    if (scoreSecurite > 10) scoreSecurite = 10;

    scoreEnvironnement = 5;

    if (
      phaseAqueuse === "Hydrolat de rose" ||
      phaseAqueuse === "Gel d’aloe vera"
    ) {
      scoreEnvironnement += 2;
    }

    if (
      phaseGrasse === "Huile de jojoba" ||
      phaseGrasse === "Huile d’amande douce"
    ) {
      scoreEnvironnement += 2;
    }

    if (conservateur === "Benzoate de sodium") {
      scoreEnvironnement += 1;
    }

    if (conservateur === "Phénoxyéthanol") {
      scoreEnvironnement -= 1;
    }

    if (scoreEnvironnement < 0) scoreEnvironnement = 0;
    if (scoreEnvironnement > 10) scoreEnvironnement = 10;

    const scoreTotal = Math.round(
      (scoreEfficacite + scoreSecurite + scoreEnvironnement) / 3
    );

    let commentaire = "";

    if (scoreTotal >= 8) {
      commentaire =
        "Très bonne formulation : produit cohérent et bien construit.";
    } else if (scoreTotal >= 5) {
      commentaire =
        "Formulation correcte, mais certains choix peuvent être améliorés.";
    } else {
      commentaire =
        "Formulation peu adaptée : il faut revoir les choix du produit.";
    }

    const resultatCalcule = {
      scoreEfficacite,
      scoreSecurite,
      scoreEnvironnement,
      scoreTotal,
      commentaire,
    };

    setMessage("");
    setResultat(resultatCalcule);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSauvegardeMessage("Token non trouvé. Veuillez vous reconnecter.");
        return;
      }

      const partieRes = await fetch(`${API_URL}/api/games/parties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_mini_jeu: 1,
        }),
      });

      const partieData = await partieRes.json();

      if (!partieRes.ok) {
        setSauvegardeMessage(
          "Erreur lors de la création de la partie : " +
            (partieData.message || partieData.error || "Erreur inconnue")
        );
        return;
      }

      const idPartie = partieData.id_partie || partieData.id;

      if (!idPartie) {
        setSauvegardeMessage("id_partie introuvable dans la réponse backend.");
        return;
      }

      const scoreRes = await fetch(`${API_URL}/api/games/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valeur: Number(scoreTotal),
          temps: 30,
          id_partie: Number(idPartie),
        }),
      });

      const scoreData = await scoreRes.json();

      if (!scoreRes.ok) {
        setSauvegardeMessage(
          "Erreur lors de l’enregistrement du score : " +
            (scoreData.message || scoreData.error || "Erreur inconnue")
        );
        return;
      }

      navigate("/resultat", {
        state: {
          score: scoreTotal,
          message: commentaire,
          details: resultatCalcule,
        },
      });
    } catch (error) {
      console.error("Erreur complète :", error);
      setSauvegardeMessage("Erreur serveur : " + error.message);
    }
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <h1 className="game-title">Création d’un produit cosmétique</h1>

        <div className="game-card">
          <h3 className="game-section-title">1. Choisir un problème de peau</h3>
          <select
            className="game-select"
            value={probleme}
            onChange={(e) => setProbleme(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            <option value="acne">Acné</option>
            <option value="seche">Peau sèche</option>
            <option value="sensible">Peau sensible</option>
          </select>
        </div>

        <div className="game-card">
          <h3 className="game-section-title">2. Choisir un type de produit</h3>
          <select
            className="game-select"
            value={typeProduit}
            onChange={(e) => setTypeProduit(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            <option value="gel">Gel</option>
            <option value="creme">Crème</option>
            <option value="serum">Sérum</option>
          </select>
        </div>

        <div className="game-card">
          <h3 className="game-section-title">3. Construire la formule</h3>

          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <label>Phase aqueuse</label>
              <select
                className="game-select"
                value={phaseAqueuse}
                onChange={(e) => setPhaseAqueuse(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                {options.aqueuse.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Phase grasse</label>
              <select
                className="game-select"
                value={phaseGrasse}
                onChange={(e) => setPhaseGrasse(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                {options.grasse.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Actif principal</label>
              <select
                className="game-select"
                value={actif}
                onChange={(e) => setActif(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                {options.actifs.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Conservateur</label>
              <select
                className="game-select"
                value={conservateur}
                onChange={(e) => setConservateur(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                {options.conservateurs.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="game-card">
          <div className="game-buttons">
            <button className="game-btn primary" onClick={handleValidation}>
              Valider la formulation
            </button>

            <button className="game-btn secondary" onClick={resetJeu}>
              Réinitialiser
            </button>
          </div>
        </div>

        {message && (
          <div className="game-card game-result">
            <p className="game-message">{message}</p>
          </div>
        )}

        {resultat && (
          <div className="game-card game-result">
            <p className="game-score">
              Score total : {resultat.scoreTotal} / 10
            </p>
            <p className="game-message">
              <strong>Efficacité :</strong> {resultat.scoreEfficacite} / 10
            </p>
            <p className="game-message">
              <strong>Sécurité :</strong> {resultat.scoreSecurite} / 10
            </p>
            <p className="game-message">
              <strong>Environnement :</strong> {resultat.scoreEnvironnement} / 10
            </p>
            <p className="game-message">{resultat.commentaire}</p>
          </div>
        )}

        {sauvegardeMessage && (
          <div className="game-card game-result">
            <p className="game-message">{sauvegardeMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreationProduit;