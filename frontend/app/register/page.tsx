"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Mohamed");
  const [lastName, setLastName] = useState("Amine");
  const [email, setEmail] = useState("m.amine@urbanflow.dz");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("OPERATOR");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call and redirect to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1c5dfd] p-2 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">UrbanFlow</div>
            <div className="text-xs text-slate-500">Traffic Management System</div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Créer un compte
          </h1>
          <p className="text-sm text-slate-500">
            Renseignez vos informations pour accéder au système
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Rôle
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-sm appearance-none bg-white"
              required
            >
              <option value="OPERATOR">OPERATOR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1c5dfd] text-white rounded-lg py-3 font-semibold mt-6 flex items-center justify-center gap-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-70 text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1c5dfd] hover:text-blue-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
