'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, Send, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ApplySectionProps {
    jobId: string
    isOwner: boolean
}

export function ApplySection({ jobId, isOwner }: ApplySectionProps) {
    const [loading, setLoading] = useState(true)
    const [hasApplied, setHasApplied] = useState(false)
    const [showForm, setShowForm] = useState(false)

    // Application Form State
    const [message, setMessage] = useState('')
    const [portfolio, setPortfolio] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function checkStatus() {
            if (isOwner) {
                setLoading(false)
                return
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('applications')
                .select('id')
                .eq('job_id', jobId)
                .eq('applicant_id', user.id)
                .single()

            if (data) setHasApplied(true)
            setLoading(false)
        }
        checkStatus()
    }, [jobId, isOwner])

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Faça login para aplicar')

            const { error } = await supabase.from('applications').insert({
                job_id: jobId,
                applicant_id: user.id,
                message,
                portfolio_link: portfolio,
            })

            if (error) throw error

            setHasApplied(true)
            setShowForm(false)
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar aplicação')
        } finally {
            setSending(false)
        }
    }

    if (loading) return <div className="h-12 w-full bg-zinc-800 animate-pulse rounded-lg" />

    if (isOwner) {
        return (
            <div className="w-full bg-zinc-800 text-center py-4 rounded-lg text-zinc-400 font-medium border border-zinc-700">
                Você é o dono deste job
            </div>
        )
    }

    if (hasApplied) {
        return (
            <div className="w-full bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 py-4 px-6 rounded-lg flex items-center gap-3 font-medium">
                <CheckCircle size={20} />
                <div>
                    <p>Candidatura enviada</p>
                    <p className="text-xs text-emerald-500/70 font-normal">Aguarde contato do anunciante</p>
                </div>
            </div>
        )
    }

    if (showForm) {
        return (
            <form onSubmit={handleApply} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Sua mensagem</label>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none resize-none"
                        placeholder="Por que você é ideal para esse job?"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Link do Portfólio / Case</label>
                    <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none"
                        placeholder="https://..."
                    />
                </div>

                {error && (
                    <div className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> {error}
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        {sending ? <Loader2 className="animate-spin" size={16} /> : 'Enviar Aplicação'}
                    </button>
                </div>
            </form>
        )
    }

    return (
        <button
            onClick={() => setShowForm(true)}
            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
        >
            <Send size={18} />
            Quero me candidatar
        </button>
    )
}
