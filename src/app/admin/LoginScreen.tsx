"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { API_URL } from "./types";

export default function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setChecking(true);
    setError(false);
    try {
      const res = await fetch(`${API_URL}/api/admin/submissions`, {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.ok) {
        onLogin(value);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-white">Admin Paneli</h1>
          <p className="text-xs text-gray-500 mt-1">VBT Hackathon 2026</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs text-gray-400 mb-2 font-medium">
            Admin Token
          </label>
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="••••••••••••"
            style={{
              width: "100%",
              background: "#1e293b",
              border: error ? "1px solid #f87171" : "1px solid #475569",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#f8fafc",
              fontSize: "14px",
              outline: "none",
              display: "block",
              marginBottom: "8px",
            }}
          />
          {error && (
            <p className="text-red-400 text-xs mb-3 text-center">
              Geçersiz token. Tekrar dene.
            </p>
          )}
          <button
            type="submit"
            disabled={checking || !value.trim()}
            className="w-full mt-2 py-3 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-semibold hover:bg-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kontrol ediliyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
