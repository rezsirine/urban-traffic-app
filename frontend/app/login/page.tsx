"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { LOGIN_MUTATION } from "../../lib/queries";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [login] = useMutation<{ login: { token: string; user: any } }>(LOGIN_MUTATION);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data } = await login({ variables: { input: { email, password } } });
      if (data?.login?.token) {
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("user", JSON.stringify(data.login.user));
        // Redirect based on role
        const role = data.login.user?.role;
        if (role === "ADMIN") {
          router.push("/");
        } else if (role === "OPERATOR") {
          router.push("/incidents");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Identifiants incorrects.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Left blue panel */}
      <div style={{
        width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", background: "linear-gradient(135deg, #1a438e 0%, #14326d 100%)", color: "#fff"
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "96px" }}>
            <div style={{
              background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "8px",
              border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 12h4l2-6 4 12 2-6h4" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "20px" }}>UrbanFlow</span>
          </div>

          {/* Hero */}
          <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.15, marginBottom: "24px" }}>
            Supervision<br />du trafic urbain<br />en temps réel
          </h1>
          <p style={{ color: "rgba(219,234,254,0.85)", fontSize: "16px", lineHeight: 1.6, marginBottom: "48px" }}>
            Plateforme intelligente de gestion du trafic — supervision des véhicules, détection des incidents et analyse de circulation.
          </p>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { val: "247", label: "Véhicules actifs" },
              { val: "18", label: "Zones surveillées" },
              { val: "1 284", label: "Incidents résolus" },
              { val: "99.9%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.1)", borderRadius: "14px", padding: "20px",
                border: "1px solid rgba(255,255,255,0.12)"
              }}>
                <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>{s.val}</div>
                <div style={{ fontSize: "13px", color: "rgba(191,219,254,0.9)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "rgba(147,197,253,0.7)" }}>
          © 2026 UrbanFlow — Système de Gestion du Trafic Urbain
        </p>
      </div>

      {/* Right white panel */}
      <div style={{
        width: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px", background: "#f8fafc"
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>Connexion</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "32px" }}>Accédez à votre espace de supervision</p>

          {errorMessage && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px",
              padding: "12px 16px", color: "#dc2626", fontSize: "14px", fontWeight: 600, marginBottom: "20px"
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                Adresse e-mail
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", outline: "none", fontSize: "15px",
                  color: "#1e293b", background: "#fff", boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                placeholder="votre@email.com"
                onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                Mot de passe
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", outline: "none", fontSize: "15px",
                  color: "#1e293b", background: "#fff", boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#1c5dfd" }}
                />
                <span style={{ fontSize: "14px", color: "#475569" }}>Se souvenir de moi</span>
              </label>
              <Link href="/reset-password" style={{ fontSize: "14px", fontWeight: 600, color: "#1c5dfd", textDecoration: "none" }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit" disabled={isLoading}
              style={{
                width: "100%", padding: "14px", background: isLoading ? "#6b9efa" : "#1c5dfd",
                color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px",
                fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background 0.2s"
              }}
            >
              {isLoading ? (
                <span style={{
                  width: "18px", height: "18px", border: "2.5px solid rgba(255,255,255,0.3)",
                  borderTop: "2.5px solid #fff", borderRadius: "50%", display: "inline-block",
                  animation: "spin 0.8s linear infinite"
                }} />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#64748b" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ fontWeight: 700, color: "#1c5dfd", textDecoration: "none" }}>
              Créer un compte
            </Link>
          </p>

          <div style={{
            marginTop: "28px", background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: "12px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p style={{ fontSize: "13px", color: "#1d4ed8", lineHeight: 1.5, fontWeight: 500 }}>
              Authentification sécurisée par JWT — session expirée automatiquement après 8h
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}