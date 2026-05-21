"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Key, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@urbanflow.dz");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      
      // Optionally redirect back to login after showing success state
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-[440px]">
        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              Entrez votre adresse e-mail pour recevoir un lien de
              réinitialisation.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-slate-900 mb-2">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1c5dfd] focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 text-[15px]"
                  required
                />
              </div>
            </div>

            <div className="bg-[#f0f4ff] border border-blue-100/50 rounded-xl p-4 flex gap-3 text-[#1c5dfd] text-[14px]">
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                Un e-mail contenant un lien sécurisé vous sera envoyé.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSent}
              className={`w-full text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-80 text-[15px] ${
                isSent
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1c5dfd] hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSent ? (
                "Lien envoyé !"
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Envoyer le lien de réinitialisation
                </>
              )}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-[14px] text-slate-400 font-medium">ou</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[#1c5dfd] font-semibold hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

        {/* Security Info Box at Bottom */}
        <div className="mt-6 bg-[#f0f4ff] border border-blue-100/50 rounded-xl p-4 flex gap-3 text-[#1c5dfd] text-[14px]">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            Pour votre sécurité, le lien de réinitialisation expire après 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
