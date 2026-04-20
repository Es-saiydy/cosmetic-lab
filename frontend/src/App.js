import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accueil from "./pages/accueil";
import About from "./pages/About";
import Resultat from "./pages/Resultat";
import MiniJeu2 from "./pages/MiniJeu2";
import MiniJeu3 from "./pages/MiniJeu3";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import CreationProduitPage from "./pages/CreationProduit/CreationProduitPage";
import ProblemePeau from "./pages/CreationProduit/ProblemePeau";
import TypeProduit from "./pages/CreationProduit/TypeProduit";
import FormuleProduit from "./pages/CreationProduit/FormuleProduit";
import ResultatCreationProduit from "./pages/CreationProduit/ResultatCreationProduit";
import AdminRoute from "./components/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import LeaderboardPage from "./pages/LeaderboardPage";

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
              <CreationProduitPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="probleme" replace />} />
          <Route path="probleme" element={<ProblemePeau />} />
          <Route path="type-produit" element={<TypeProduit />} />
          <Route path="formule" element={<FormuleProduit />} />
          <Route path="resultat" element={<ResultatCreationProduit />} />
        </Route>

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/leaderboard"
          element={
        <ProtectedRoute>
          <LeaderboardPage />
        </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;