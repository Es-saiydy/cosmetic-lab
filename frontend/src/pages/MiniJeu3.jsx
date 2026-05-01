import React, { useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

const colorsByIndex = [
  { top: "#a5d6ff", bottom: "#ffcc00" },
  { top: "#e0bbff", bottom: "#ffffff" },
  { top: "#ff8a80", bottom: "#ff5252" },
  { top: "#c8e6c9", bottom: "#2e7d32" },
  { top: "#ffe0b2", bottom: "#ef6c00" },
  { top: "#d1c4e9", bottom: "#4527a0" },
  { top: "#b3e5fc", bottom: "#0277bd" },
  { top: "#f0f4c3", bottom: "#9e9d24" },
  { top: "#cfd8dc", bottom: "#37474f" },
  { top: "#d7ccc8", bottom: "#4e342e" },
  { top: "#f8bbd0", bottom: "#c2185b" },
  { top: "#e1bee7", bottom: "#7b1fa2" },
  { top: "#b2ebf2", bottom: "#00838f" },
  { top: "#fff9c4", bottom: "#fbc02d" },
  { top: "#e0f2f1", bottom: "#004d40" },
];

function MiniJeu3() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [current, setCurrent] = useState(0);
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [wordPositions, setWordPositions] = useState({});
  const [score, setScore] = useState(0);

  const [globalTimeLeft, setGlobalTimeLeft] = useState(600);

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDefauts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/games/defauts`);
      const data = await res.json();
      if (res.ok) {
        const formatted = data.map((d, idx) => ({
          id: d.id_defaut,
          defect: d.libelle,
          targetWords: d.mots_cibles,
          sentence: d.phrase,
          colorTop: colorsByIndex[idx % colorsByIndex.length].top,
          colorBottom: colorsByIndex[idx % colorsByIndex.length].bottom,
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error("Erreur chargement défauts :", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDefauts();
}, []);

  const currentProduct = products[current];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

 const handleFinish = useCallback(async (finalScore) => {
  const tempsPasse = 600 - globalTimeLeft;

  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/games/parties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_mini_jeu: 3 }),
      });

      if (!res.ok) {
        throw new Error("Erreur création partie");
      }

      const data = await res.json();

      const scoreRes = await fetch(`${API_URL}/api/games/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valeur: Math.round((score / products.length) * 100),
          temps: tempsPasse,
          id_partie: data.id_partie,
        }),
      });

      if (!scoreRes.ok) {
        console.error("Erreur enregistrement score");
      }
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
    }
  }

  navigate("/resultat", {
    state: {
      score: finalScore,
      total: products.length,
      replayPath: "/mini-jeu-3",
    },
  });
}, [token, navigate, products.length, globalTimeLeft, score]);

  const generateGrid = useCallback(() => {
  const size = 13;
  let newGrid = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  );

  const usedRows = new Set();
  const positions = {}; // { "INSTABILITE": [{r:3, c:2}, {r:3, c:3}, ...] }

  currentProduct.targetWords.forEach((word) => {
    if (word.length > size) return;

    let row;
    let attempts = 0;
    do {
      row = Math.floor(Math.random() * size);
      attempts++;
    } while (usedRows.has(row) && attempts < 50);
    usedRows.add(row);

    const startCol = Math.floor(Math.random() * (size - word.length + 1));

    const wordCells = [];
      for (let i = 0; i < word.length; i++) {
        const col = startCol + i;
        newGrid[row][col] = word[i].toUpperCase();
        wordCells.push({ r: row, c: col });
      }
      positions[word] = wordCells;
   });

  setGrid(newGrid);
  setWordPositions(positions);
}, [currentProduct]);

  useEffect(() => {
  const timer = setInterval(() => {
    setGlobalTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  if (globalTimeLeft === 0) {
    handleFinish(score);
  }
}, [globalTimeLeft, handleFinish, score]);

  useEffect(() => {
    if (step === 2) {
      generateGrid();
      setFoundWords([]);
      setSelectedCells([]);
    }
  }, [step, generateGrid]);

  const handleNextCase = () => {
    if (current < products.length - 1) {
      setCurrent(prev => prev + 1);
      setStep(1);
    } else {
      handleFinish(score);
    }
  };

  const handleCellClick = (r, c) => {
  // Cas 1 : on clique sur la DERNIÈRE case sélectionnée → on la retire (undo)
  if (selectedCells.length > 0) {
    const last = selectedCells[selectedCells.length - 1];
    if (last.r === r && last.c === c) {
      setSelectedCells(selectedCells.slice(0, -1));
      return;
    }
  }

  // Cas 2 : on clique sur une autre case déjà sélectionnée → on ignore
  if (selectedCells.some(s => s.r === r && s.c === c)) return;

  // Cas 3 : si une case est déjà sélectionnée, vérifie l'adjacence
  if (selectedCells.length > 0) {
    const last = selectedCells[selectedCells.length - 1];
    const dr = Math.abs(r - last.r);
    const dc = Math.abs(c - last.c);
    const isAdjacent = dr <= 1 && dc <= 1 && (dr + dc > 0);

    if (!isAdjacent) {
      setSelectedCells([{ r, c, letter: grid[r][c] }]);
      return;
    }
  }

  // Cas 4 : ajout normal de la case à la sélection
  const newSelection = [...selectedCells, { r, c, letter: grid[r][c] }];
  setSelectedCells(newSelection);
  const currentWord = newSelection.map(s => s.letter).join("");

  if (currentProduct.targetWords.includes(currentWord)) {
    const updatedFound = [...foundWords, currentWord];
    setFoundWords(updatedFound);
    setSelectedCells([]);
    setFeedback("BRAVO !");
    setTimeout(() => setFeedback(null), 800);

    if (updatedFound.length === currentProduct.targetWords.length) {
      setScore(prev => prev + 1);
    }
  } else if (currentWord.length >= 12) {
    setSelectedCells([]);
  }
};

  const NavHeader = () => (
    <div style={styles.headerNav}>
      <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>← Retour</button>
      <div style={styles.centerBrand}>
        <span style={{fontSize: '24px'}}>🧪</span>
        <span style={styles.brandText}>Cosmetic Lab</span>
      </div>
      <div style={styles.timerBox}>
        <span style={{fontSize: "18px", fontWeight: "bold", color: globalTimeLeft < 60 ? "#ef4444" : "#1e293b"}}>
          ⏱ {formatTime(globalTimeLeft)}
        </span>
      </div>
    </div>
  );

  const FooterNav = () => (
    <div style={styles.footerNav}>
      <span style={styles.footerInfo}>Projet pédagogique — L3 MIAGE</span>
      <span style={styles.footerInfo}>Produit {current + 1} / {products.length}</span>
      <button onClick={() => handleFinish(score)} style={styles.quitBtn}>Quitter</button>
    </div>
  );

  if (loading || products.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p>Chargement des défauts qualité...</p>
        </div>
      </div>
    );
  }


  if (step === 1) {
    return (
      <div style={styles.page}>
        <NavHeader />
        <div style={styles.card}>
          <div style={styles.welcomeMessage}>
            Bienvenue dans notre jeu ! Vous avez <strong>10 minutes</strong> pour analyser les {products.length} produits.
          </div>
          <h2 style={styles.mainTitle}>Analyse du produit</h2>
          <p style={styles.subtitle}>Un produit cosmétique présente un défaut.</p>
          <div style={styles.observationArea}>
            <div style={styles.bottleWrapper}>
              <div style={styles.bottleCapReal}></div>
              <div style={styles.bottleNeck}></div>
              <div style={{...styles.bottleBody, background: `linear-gradient(${currentProduct.colorTop} 45%, ${currentProduct.colorBottom} 55%)`}}>
                <div style={styles.liquidReflex}></div>
              </div>
            </div>
            <div style={styles.defectInfoBox}>
              <div style={styles.defectTag}>Défaut détecté :</div>
              <div style={styles.defectMainValue}>{currentProduct.defect}</div>
            </div>
          </div>
          <button onClick={() => setStep(2)} style={styles.primaryBtn}>ANALYSER</button>
          <FooterNav />
        </div>
      </div>
    );
    
  }


  return (
    <div style={styles.page}>
      <NavHeader />
      <div style={styles.card}>
        <div style={styles.gameStats}>
           <span style={styles.scoreText}>Score : {score} / {products.length}</span>
        </div>
        <p style={styles.instructionText}>Mots à trouver : <br/>
          <span style={{color: '#3b82f6', fontWeight: 'bold'}}>
            {currentProduct.targetWords.join(" • ")}
          </span>
        </p>
        <div style={styles.gridContainer}>
          {grid.map((row, r) => row.map((letter, c) => {
            const isSel = selectedCells.some(s => s.r === r && s.c === c);
            const isLast = selectedCells.length > 0 
            && selectedCells[selectedCells.length - 1].r === r 
            && selectedCells[selectedCells.length - 1].c === c;
            const isWordFound = foundWords.some(w => wordPositions[w]?.some(pos => pos.r === r && pos.c === c));
            return (
              <div key={`${r}-${c}`} onClick={() => handleCellClick(r, c)}
                style={{
                  ...styles.gridCell, 
                  backgroundColor: isLast ? "#1e40af" : (isSel ? "#3b82f6" : (isWordFound ? "#d1fae5" : "white")), 
                  color: isSel ? "white" : "#1e293b",
                  boxShadow: isLast ? "0 0 0 3px #fbbf24" : "none",
                  transition: "all 0.15s"
                }}>
                {letter}
              </div>
            );
          }))}

        </div>
        <div style={styles.sentencePlaceholder}>
          {currentProduct.sentence.map((word, i) => (
            <span key={i} style={{
                marginRight: '8px', 
                color: currentProduct.targetWords.includes(word) && !foundWords.includes(word) ? '#cbd5e1' : '#334155',
                borderBottom: currentProduct.targetWords.includes(word) && !foundWords.includes(word) ? '2px solid #cbd5e1' : 'none'
            }}>
              {currentProduct.targetWords.includes(word) && !foundWords.includes(word) ? "______" : word}
            </span>
          ))}
        </div>
        
        {/* BOUTON TOUJOURS PRÉSENT POUR PASSER AU CAS SUIVANT */}
        <button onClick={handleNextCase} style={styles.nextBtn}>
          {current === products.length - 1 ? "TERMINER LE JEU" : "CAS SUIVANT →"}
        </button>
        
        <FooterNav />
      </div>
      {feedback && <div style={styles.toast}>{feedback}</div>}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Segoe UI', Roboto, sans-serif" },
  headerNav: { width: "100%", maxWidth: "850px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  backBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  centerBrand: { display: "flex", flexDirection: "column", alignItems: "center" },
  brandText: { fontSize: "18px", fontWeight: "800", color: "#0f172a" },
  timerBox: { background: "#f1f5f9", padding: "8px 15px", borderRadius: "12px", border: "1px solid #e2e8f0" },
  card: { width: "100%", maxWidth: "850px", background: "white", borderRadius: "35px", padding: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", textAlign: "center", position: "relative" },
  welcomeMessage: { background: "#eff6ff", color: "#1d4ed8", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" },
  mainTitle: { fontSize: "28px", color: "#1e293b", margin: "0 0 10px 0", fontWeight: "800" },
  subtitle: { color: "#64748b", marginBottom: "40px" },
  observationArea: { display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginBottom: "50px", background: "#f8fafc", padding: "40px", borderRadius: "25px", border: "1px solid #f1f5f9" },
  bottleWrapper: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center" },
  bottleCapReal: { width: "40px", height: "12px", background: "#334155", borderRadius: "3px" },
  bottleNeck: { width: "25px", height: "15px", background: "rgba(255,255,255,0.5)", borderLeft: "3px solid #334155", borderRight: "3px solid #334155", marginBottom: "-2px" },
  bottleBody: { width: "85px", height: "150px", border: "4px solid #334155", borderRadius: "8px 8px 35px 35px", position: "relative", overflow: "hidden" },
  liquidReflex: { position: "absolute", top: "10%", left: "10%", width: "10%", height: "80%", background: "rgba(255,255,255,0.2)", borderRadius: "20px" },
  defectInfoBox: { textAlign: "left" },
  defectTag: { color: "#64748b", fontSize: "14px", marginBottom: "10px" },
  defectMainValue: { fontSize: "26px", fontWeight: "800", color: "#ef4444" },
  primaryBtn: { padding: "18px 70px", background: "#334155", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  nextBtn: { marginTop: "25px", width: "100%", padding: "15px", background: "#10b981", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: "4px", margin: "20px auto", maxWidth: "650px" },
  gridCell: { height: "42px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  gameStats: { display: "flex", justifyContent: "center", fontWeight: "bold", marginBottom: "20px" },
  scoreText: { background: "#f1f5f9", padding: "8px 20px", borderRadius: "20px", color: "#334155" },
  instructionText: { fontSize: "16px", color: "#475569", marginBottom: "15px" },
  sentencePlaceholder: { background: "#f8fafc", padding: "20px", borderRadius: "15px", marginTop: "20px", fontSize: "18px", fontStyle: "italic", border: "1px solid #e2e8f0" },
  footerNav: { display: "flex", justifyContent: "space-between", width: "100%", marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "20px", fontSize: "12px", color: "#94a3b8" },
  quitBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold" },
  toast: { position: "absolute", top: "10px", right: "10px", padding: "8px 20px", background: "#10b981", color: "white", borderRadius: "10px", fontWeight: "bold" }
};


export default MiniJeu3;