"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import WhatsAppButton from "../components/WhatsAppButton";

export default function SetupAccount() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Auto-fill email if present in URL (Kiwify often passes this)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Check if email is authorized
            const { data: authorizedData, error: authError } = await supabase
                .from("authorized_signups")
                .select("id, status, is_blocked")
                .eq("email", email)
                .single();

            if (authError || !authorizedData) {
                throw new Error("Este email não foi encontrado em nossa lista de compras aprovadas. Verifique se digitou o mesmo email da compra.");
            }

            if (authorizedData.is_blocked) {
                throw new Error("Seu acesso foi suspenso devido ao status do pagamento (Reembolso, Cancelamento ou Atraso). Entre em contato com o suporte.");
            }

            if (authorizedData.status === 'completed') {
                throw new Error("Este email já possui uma conta configurada. Tente fazer login.");
            }

            // 2. Create User in Supabase Auth
            // Note: SignUp creates a new user. If "Confirm Email" is enabled in Supabase,
            // the user will need to confirm. For a smoother flow here, update Supabase settings 
            // or use signUp with auto-confirm if possible/safe. 
            // Assuming defaults: User gets an email confirmation link.
            // Alternatively, since we "verified" payment via webhook, we might want to allow instant access.
            // For this implementation, we proceed with standard signUp.

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: email.split('@')[0], // Fallback name
                    }
                }
            });

            if (signUpError) {
                // Handle "User already registered" specially
                if (signUpError.message.includes("already registered")) {
                    throw new Error("Usuário já cadastrado. Tente fazer login.");
                }
                throw signUpError;
            }

            // 3. Update authorized_signups status to completed
            // We can only do this if we are authenticated or have an RLS policy allowing it.
            // Since the user is not logged in yet (or just signed up but maybe not confirmed), 
            // we might run into RLS issues here if we try to update `authorized_signups`.
            // The secure way: The user logs in -> On first login, we match email -> update status.
            // OR: We trust the public insert/update logic if we opened RLS (risky).
            // Best approach for now: Just create the auth user. The table check passed.
            // We can trigger a database trigger or edge function to mark it 'completed' on auth.users insert ideally.
            // For this Client-side code, we will skip updating the table manually to avoid RLS blocks/security issues,
            // relying on the initial check.

            setSuccess(true);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="bg-[#0f0f0f] border border-green-900/30 p-8 rounded-[22px] max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Conta criada com sucesso!</h1>
                    <p className="text-[#a9a9a9] mb-6">
                        Sua conta foi configurada. Verifique seu email para confirmar o cadastro (se necessário) ou faça login agora.
                    </p>
                    <Link
                        href="/login"
                        className="block w-full bg-white text-black font-bold rounded-xl px-6 py-4 hover:brightness-90 transition-all text-center"
                    >
                        Ir para Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tighter mb-2">Configurar Conta</h1>
                    <p className="text-zinc-400">
                        Parabéns pela compra! Crie sua senha para acessar a plataforma.
                    </p>
                </div>

                <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-8">
                    <form onSubmit={handleSetup} className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#bfbfbf] mb-2">Seu Email de Compra</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#bfbfbf] mb-2">Criar Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-xl text-red-300 text-sm flex items-start gap-3">
                                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Criar Conta
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <WhatsAppButton />
        </main>
    );
}
