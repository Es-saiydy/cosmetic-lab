import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;