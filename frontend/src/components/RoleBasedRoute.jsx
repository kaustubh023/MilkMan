import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleBasedRoute({ children, roles }) {
  const { role } = useAuth();
  if (!roles.includes(role)) return <Navigate to="/" />;
  return children;
}

export default RoleBasedRoute;

