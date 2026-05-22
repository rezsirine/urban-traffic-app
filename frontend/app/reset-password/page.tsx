"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // NOTE: The backend does not yet have a forgotPassword mutation.
    // This is a UI simulation. Email sending is not implemented.
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setTimeout(() => router.push("/login"), 4000);
    }, 800);
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
            Récupération<br />de compte<br />sécurisée
          </h1>
          <p style={{ color: "rgba(219,234,254,0.85)", fontSize: "16px", lineHeight: 1.6, marginBottom: "48px" }}>
            Vous avez oublié votre mot de passe ? Pas de panique, nous vous envoyons un lien sécurisé pour le réinitialiser rapidement.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { val: "100%", label: "Sécurisé" },
              { val: "24/7", label: "Support" },
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

      {/* Right panel */}
      <div style={{
        width: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px", background: "#f8fafc"
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Mot de passe oublié
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
          </p>

          {isSent ? (
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px",
              padding: "24px", textAlign: "center"
            }}>
              <div style={{
                width: "52px", height: "52px", background: "#dcfce7", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#15803d", marginBottom: "8px" }}>Demande enregistrée</h3>
              <p style={{ fontSize: "14px", color: "#166534", marginBottom: "12px" }}>
                Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vous sera envoyé.
              </p>
              <p style={{ fontSize: "12px", color: "#4ade80", background: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "8px 12px" }}>
                ⚠️ Fonctionnalité en cours d'intégration — l'envoi d'e-mail sera activé prochainement.
              </p>
              <p style={{ fontSize: "13px", color: "#15803d", marginTop: "12px" }}>
                Retour à la connexion dans quelques secondes...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "6px" }}>
                  Adresse e-mail
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                    display: "flex", alignItems: "center", pointerEvents: "none"
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="votre@email.com"
                    style={{
                      width: "100%", padding: "12px 16px 12px 44px", borderRadius: "10px",
                      border: "1.5px solid #e2e8f0", outline: "none", fontSize: "15px",
                      color: "#1e293b", background: "#fff", boxSizing: "border-box"
                    }}
                    onFocus={e => e.target.style.borderColor = "#1c5dfd"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              {/* Info box */}
              <div style={{
                background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px",
                padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <p style={{ fontSize: "13px", color: "#1d4ed8", lineHeight: 1.5, fontWeight: 500 }}>
                  Un e-mail contenant un lien sécurisé vous sera envoyé.
                </p>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7m2 4V7" />
                      <circle cx="12" cy="11" r="1" fill="white" />
                      <path d="M12 3v6m0 2v2" />
                    </svg>
                    Envoyer le lien de réinitialisation
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "28px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <Link href="/login" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            color: "#1c5dfd", fontWeight: 700, fontSize: "14px", textDecoration: "none"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c5dfd" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour à la connexion
          </Link>

          {/* Security box */}
          <div style={{
            marginTop: "28px", background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: "12px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p style={{ fontSize: "13px", color: "#1d4ed8", lineHeight: 1.5, fontWeight: 500 }}>
              Pour votre sécurité, le lien de réinitialisation expire après 15 minutes.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
