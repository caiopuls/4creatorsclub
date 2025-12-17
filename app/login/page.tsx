'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')

    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/jobs') // Middleware will redirection if needed, but this is explicit
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    },
                })
                if (error) throw error
                router.push('/jobs')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">4C Jobs</h1>
                    <p className="text-zinc-400">
                        Acesse o marketplace exclusivo para membros.
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 "
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Entrar
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-zinc-500">
                    Ainda não é membro?{' '}
                    <Link href="/" className="text-white hover:underline">
                        Aplicar para o 4C Club
                    </Link>
                </div>
            </div>
        </div>
    )
}
