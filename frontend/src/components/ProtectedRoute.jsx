import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("access_token");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectTo", location.pathname + location.search);
      setAuthorized(false);
      setLoading(false);
      return;
    }
    const check = async () => {
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        const now = Math.floor(Date.now() / 1000);
        if (!payload.exp || payload.exp <= now) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        if (!allowedRole) {
          setAuthorized(true);
          setLoading(false);
          return;
        }
        if (payload.role) {
          setAuthorized(payload.role === allowedRole);
          setLoading(false);
          return;
        }
        const res = await api.get("auth/me/");
        setAuthorized(res.data?.role === allowedRole);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [token, allowedRole, location.pathname, location.search]);

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (!authorized) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
