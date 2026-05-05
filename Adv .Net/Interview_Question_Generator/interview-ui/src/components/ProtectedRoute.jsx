import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/error?code=403&msg=Please login first" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/error?code=403&msg=Access denied" replace />;
  }

  return children;
}

export default ProtectedRoute;
