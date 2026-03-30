import { useState } from "react";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";

function CreationProduit() {
  const [probleme, setProbleme] = useState("");
  const [ingredientsSelectionnes, setIngredientsSelectionnes] = useState([]);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");
  const [sauvegardeMessage, setSauvegardeMessage] = useState("");
  const navigate = useNavigate();

  const ingredients = [
    { id: 1, nom: "Acide salicylique" },
    { id: 2, nom: "Niacinamide" },
    { id: 3, nom: "Acide hyaluronique" },
    { id: 4, nom: "Glycérine" },
    { id: 5, nom: "Parfum" },
  ];

  const handleIngredientChange = (ingredientNom) => {
    if (ingredientsSelectionnes.includes(ingredientNom)) {
      setIngredientsSelectionnes(
        ingredientsSelectionnes.filter((item) => item !== ingredientNom)
      );
    } else {
      setIngredientsSelectionnes([...ingredientsSelectionnes, ingredientNom]);
    }
  };

  const calculerScore = () => {
    let nouveauScore = 0;

    if (probleme === "acne") {
      if (ingredientsSelectionnes.includes("Acide salicylique")) nouveauScore += 5;
      if (ingredientsSelectionnes.includes("Niacinamide")) nouveauScore += 5;
      if (ingredientsSelectionnes.includes("Acide hyaluronique")) nouveauScore += 1;
      if (ingredientsSelectionnes.includes("Glycérine")) nouveauScore += 1;
    }

    if (probleme === "seche") {
      if (ingredientsSelectionnes.includes("Acide hyaluronique")) nouveauScore += 5;
      if (ingredientsSelectionnes.includes("Glycérine")) nouveauScore += 5;
      if (ingredientsSelectionnes.includes("Niacinamide")) nouveauScore += 1;
      if (ingredientsSelectionnes.includes("Acide salicylique")) nouveauScore += 0;
    }

    if (ingredientsSelectionnes.includes("Parfum")) {
      nouveauScore -= 1;
    }

    if (nouveauScore < 0) {
      nouveauScore = 0;
    }

    return nouveauScore;
  };

  const handleValidation = async () => {
    setSauvegardeMessage("");

    if (!probleme) {
      setMessage("Veuillez choisir un problème de peau.");
      setScore(null);
      return;
    }

    if (ingredientsSelectionnes.length === 0) {
      setMessage("Veuillez sélectionner au moins un ingrédient.");
      setScore(null);
      return;
    }

    const nouveauScore = calculerScore();
    setScore(nouveauScore);

    if (nouveauScore >= 8) {
      setMessage("Très bon choix d’ingrédients.");
    } else if (nouveauScore >= 5) {
      setMessage("Choix correct, mais améliorable.");
    } else {
      setMessage("Choix peu adapté au problème de peau.");
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      console.log("API_URL =", API_URL);
      console.log("user =", user);
      console.log("token =", token);
      console.log("url partie =", `${API_URL}/api/games/parties`);
      console.log("url score =", `${API_URL}/api/games/scores`);

      if (!user || !user.id) {
        setSauvegardeMessage("Utilisateur non trouvé dans la session.");
        return;
      }

      if (!token) {
        setSauvegardeMessage("Token non trouvé. Veuillez vous reconnecter.");
        return;
      }

      const partiePayload = {
        id_utilisateur: Number(user.id),
        id_mini_jeu: 1,
      };

      console.log("DATA ENVOYÉE PARTIE =", partiePayload);

      const partieRes = await fetch(`${API_URL}/api/games/parties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partiePayload),
      });

      const partieData = await partieRes.json();
      console.log("REPONSE PARTIE =", partieData);

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

      const scorePayload = {
        valeur: Number(nouveauScore),
        temps: 30,
        id_partie: Number(idPartie),
      };

      console.log("DATA ENVOYÉE SCORE =", scorePayload);

      const scoreRes = await fetch(`${API_URL}/api/games/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scorePayload),
      });

      const scoreData = await scoreRes.json();
      console.log("REPONSE SCORE =", scoreData);

      if (!scoreRes.ok) {
        setSauvegardeMessage(
          "Erreur lors de l’enregistrement du score : " +
            (scoreData.message || scoreData.error || "Erreur inconnue")
        );
        return;
      }

      navigate("/resultat", {
        state: {
            score: nouveauScore,
            message: message,
            },
    });

    } catch (error) {
      console.error("Erreur complète :", error);
      setSauvegardeMessage("Erreur serveur : " + error.message);
    }
  };

  const resetJeu = () => {
    setProbleme("");
    setIngredientsSelectionnes([]);
    setScore(null);
    setMessage("");
    setSauvegardeMessage("");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", textAlign: "center" }}>
      <h1>Création d’un produit cosmétique</h1>

      <h3>1. Choisir un problème de peau</h3>
      <select value={probleme} onChange={(e) => setProbleme(e.target.value)}>
        <option value="">-- Choisir --</option>
        <option value="acne">Acné</option>
        <option value="seche">Peau sèche</option>
      </select>

      <h3 style={{ marginTop: "30px" }}>2. Sélectionner les ingrédients</h3>

      <div style={{ textAlign: "left", display: "inline-block" }}>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={ingredientsSelectionnes.includes(ingredient.nom)}
                onChange={() => handleIngredientChange(ingredient.nom)}
              />{" "}
              {ingredient.nom}
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "25px" }}>
        <button onClick={handleValidation} style={{ marginRight: "10px" }}>
          Valider
        </button>

        <button onClick={resetJeu}>Réinitialiser</button>
      </div>

      {message && (
        <div style={{ marginTop: "30px" }}>
          <p>
            <strong>Résultat :</strong> {message}
          </p>
        </div>
      )}

      {score !== null && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>Score :</strong> {score} / 10
          </p>
        </div>
      )}

      {sauvegardeMessage && (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>Sauvegarde :</strong> {sauvegardeMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default CreationProduit;