"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { REGISTER_MUTATION } from "../../lib/queries";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [register] = useMutation(REGISTER_MUTATION);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data } = await register({
        variables: { input: { email, name: `${firstName} ${lastName}`, password, role } },
      });
      if (data?.register?.token) {
        setIsSuccess(true);
        // Account created — redirect to login after a brief success message
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de la création du compte.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", outline: "none", fontSize: "15px",
    color: "#1e293b", background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Left blue panel */}
      <div style={{
        width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", background: "linear-gradient(135deg, #1a438e 0%, #14326d 100%)", color: "#fff"
      }}>
        <div>
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

          <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.15, marginBottom: "24px" }}>
            Rejoignez<br />notre plateforme
          </h1>
          <p style={{ color: "rgba(219,234,254,0.85)", fontSize: "16px", lineHeight: 1.6, marginBottom: "48px" }}>
            Créez un compte pour accéder aux outils de gestion, superviser les véhicules et gérer les incidents en temps réel.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { val: "247", label: "Véhicules actifs" },
              { val: "18", label: "Zones surveillées" },
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
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>Créer un compte</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "32px" }}>
            Renseignez vos informations pour accéder au système
          </p>

          {isSuccess && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px",
              padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "20px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "1px" }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p style={{ fontSize: "14px", color: "#15803d", fontWeight: 600 }}>
                Compte créé avec succès ! Redirection vers la page de connexion...
              </p>
            </div>
          )}

          {errorMessage && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px",
              padding: "12px 16px", color: "#dc2626", fontSize: "14px", fontWeight: 600, marginBottom: "20px"
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* First/Last name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>Prénom</label>
                <input
                  type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                  placeholder="Mohamed"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>Nom</label>
                <input
                  type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                  placeholder="Amine"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>Adresse e-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="votre@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>Rôle</label>
              <select
                value={role} onChange={e => setRole(e.target.value)} required
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#1c5dfd"}
                onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#e2e8f0"}
              >
                <option value="OPERATOR">OPERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <button
              type="submit" disabled={isLoading}
              style={{
                width: "100%", padding: "14px", marginTop: "8px",
                background: isLoading ? "#6b9efa" : "#1c5dfd", color: "#fff",
                border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
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
              ) : "Créer mon compte"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "#64748b" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ fontWeight: 700, color: "#1c5dfd", textDecoration: "none" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
