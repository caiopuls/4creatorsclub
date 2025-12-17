'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Send, Loader2 } from 'lucide-react'

interface InterestButtonProps {
    startupId: string
    isOwner: boolean
}

export function InterestButton({ startupId, isOwner }: InterestButtonProps) {
    const [loading, setLoading] = useState(true)
    const [hasInterest, setHasInterest] = useState(false)
    const [sending, setSending] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        async function checkStatus() {
            if (isOwner) {
                setLoading(false)
                return
            }

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('startup_interests')
                .select('id')
                .eq('startup_id', startupId)
                .eq('interested_profile_id', user.id)
                .single()

            if (data) setHasInterest(true)
            setLoading(false)
        }
        checkStatus()
    }, [startupId, isOwner])

    const handleInterest = async () => {
        setSending(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase.from('startup_interests').insert({
                startup_id: startupId,
                interested_profile_id: user.id,
                message: 'Tenho interesse neste projeto.',
            })

            if (error) throw error
            setHasInterest(true)
        } catch (err) {
            console.error(err)
        } finally {
            setSending(false)
        }
    }

    if (loading) return null

    if (isOwner) {
        return (
            <div className="w-full bg-zinc-800 text-center py-4 rounded-lg text-zinc-400 font-medium border border-zinc-700">
                Você é o dono deste projeto
            </div>
        )
    }

    if (hasInterest) {
        return (
            <div className="w-full bg-blue-950/30 border border-blue-900/50 text-blue-400 py-4 px-6 rounded-lg flex items-center justify-center gap-3 font-medium">
                <CheckCircle size={20} />
                <span>Interesse registrado</span>
            </div>
        )
    }

    return (
        <button
            onClick={handleInterest}
            disabled={sending}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
            {sending ? <Loader2 className="animate-spin" /> : (
                <>
                    <Send size={18} />
                    Tenho Interesse
                </>
            )}
        </button>
    )
}
