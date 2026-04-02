import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accueil from "./pages/accueil";
import About from "./pages/About";
import CreationProduit from "./pages/CreationProduit";
import Resultat from "./pages/Resultat";
import MiniJeu2 from "./pages/MiniJeu2";
import MiniJeu3 from "./pages/MiniJeu3";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Accueil />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/creation-produit"
          element={
            <ProtectedRoute>
              <CreationProduit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resultat"
          element={
            <ProtectedRoute>
              <Resultat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mini-jeu-2"
          element={
            <ProtectedRoute>
              <MiniJeu2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mini-jeu-3"
          element={
            <ProtectedRoute>
              <MiniJeu3 />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;