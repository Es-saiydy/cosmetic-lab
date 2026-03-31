import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreationProduit from "./pages/CreationProduit";
import Resultat from "./pages/Resultat";
import About from "./pages/About";
import Accueil from "./pages/accueil";


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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;