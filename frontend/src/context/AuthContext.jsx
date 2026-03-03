import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp > now) {
        setUser({ id: payload.id, email: payload.email, role: payload.role });
        api
          .get("auth/me/")
          .then((res) => setUser(res.data))
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLoading(false);
      }
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("auth/login/", { email, password });
    const { access, refresh } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    const payload = JSON.parse(
      atob(access.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    setUser({ id: payload.id, email: payload.email, role: payload.role });
    let redirect = localStorage.getItem("redirectTo");
    localStorage.removeItem("redirectTo");
    if (!redirect) {
      if (payload.role === "ADMIN") redirect = "/admin/dashboard";
      else if (payload.role === "STAFF") redirect = "/staff/profile";
      else redirect = "/";
    }
    try {
      const me = await api.get("auth/me/");
      setUser(me.data);
    } catch {}
    navigate(redirect);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      login,
      logout,
      setUser,
      loading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
