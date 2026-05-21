"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@urbanflow.dz");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call and redirect to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-[#1a438e] to-[#14326d] text-white">
        <div>
          <div className="flex items-center gap-3 font-semibold text-xl mb-24">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            UrbanFlow
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Supervision
              <br />
              du trafic urbain
              <br />
              en temps réel
            </h1>
            <p className="text-blue-100/80 text-lg mb-12">
              Plateforme intelligente de gestion du trafic — supervision des
              véhicules, détection des incidents et analyse de circulation.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition">
                <div className="text-3xl font-bold mb-1">247</div>
                <div className="text-sm text-blue-200">Véhicules actifs</div>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition">
                <div className="text-3xl font-bold mb-1">18</div>
                <div className="text-sm text-blue-200">Zones surveillées</div>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition">
                <div className="text-3xl font-bold mb-1">1,284</div>
                <div className="text-sm text-blue-200">Incidents résolus</div>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition">
                <div className="text-3xl font-bold mb-1">99.9%</div>
                <div className="text-sm text-blue-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-blue-300 text-sm">
          © 2026 UrbanFlow — Système de Gestion du Trafic Urbain
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Connexion
            </h2>
            <p className="text-slate-500">
              Accédez à votre espace de supervision
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-200 outline-none transition text-slate-700"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-200 outline-none transition text-slate-700"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-pink-500"
                  defaultChecked
                />
                <span className="text-sm text-slate-600">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                href="/reset-password"
                className="text-sm font-semibold text-[#1c5dfd] hover:text-blue-700 transition"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1c5dfd] text-white rounded-lg py-3.5 font-semibold mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#1c5dfd] hover:text-blue-700"
            >
              Créer un compte
            </Link>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700 text-sm">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <p className="leading-relaxed">
              Authentification sécurisée par JWT — session expirée
              automatiquement après 8h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
