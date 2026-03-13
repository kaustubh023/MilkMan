import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "./AuthContextValue";

function clearStoredAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function decodeToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= now) {
      return null;
    }

    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem("access_token")));
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("access_token")));

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const decodedUser = decodeToken(token);

    if (!token) {
      return;
    }

    if (!decodedUser) {
      clearStoredAuth();
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    let ignore = false;

    api
      .get("auth/me/")
      .then((res) => {
        if (!ignore) {
          setUser(res.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          clearStoredAuth();
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post("auth/login/", { email, password });
    const { access, refresh } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    const payload = decodeToken(access);
    let redirect = localStorage.getItem("redirectTo");
    localStorage.removeItem("redirectTo");
    let resolvedUser = payload;

    if (payload) {
      setUser(payload);
    }

    try {
      const me = await api.get("auth/me/");
      setUser(me.data);
      resolvedUser = me.data;
    } catch {
      // Keep decoded token data if the profile refresh fails.
    }

    if (!redirect) {
      if (resolvedUser?.role === "ADMIN") redirect = "/admin/dashboard";
      else if (resolvedUser?.role === "STAFF") redirect = "/staff/profile";
      else redirect = "/";
    }

    navigate(redirect);
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
