"use client";

import { useState } from "react";
import LoginScreen from "./LoginScreen";
import Dashboard from "./Dashboard";

const SESSION_KEY = "admin-token";

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(
    () => (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null)
  );

  const handleLogin = (t: string) => {
    sessionStorage.setItem(SESSION_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
