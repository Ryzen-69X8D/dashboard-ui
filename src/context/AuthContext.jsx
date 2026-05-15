import { createContext, useContext, useMemo, useState } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

const demoUser = {
  full_name: "Demo Analyst",
  email: "demo@autodata.local",
};

function loadStoredUser() {
  const raw = window.localStorage.getItem("autodata_user");
  if (!raw) return demoUser;

  try {
    return JSON.parse(raw);
  } catch {
    return demoUser;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(() => window.localStorage.getItem("autodata_token"));
  const [loading, setLoading] = useState(false);

  async function login(credentials) {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", credentials);
      window.localStorage.setItem("autodata_token", data.access_token);
      window.localStorage.setItem("autodata_user", JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/register", payload);
      window.localStorage.setItem("autodata_token", data.access_token);
      window.localStorage.setItem("autodata_user", JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("autodata_token");
    window.localStorage.removeItem("autodata_user");
    setToken(null);
    setUser(demoUser);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
