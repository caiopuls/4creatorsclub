"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#090909] px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-8">
          <h1 className="text-3xl font-extrabold mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-[#a9a9a9] text-sm text-center mb-6">
            4Creators Club
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-[#bfbfbf] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                placeholder="admin@4creatorsclub.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#bfbfbf] mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-b from-white to-[#e9e9e9] text-black font-extrabold rounded-2xl hover:brightness-105 active:scale-98 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

