'use client'

import { useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    itemId: string
    type: 'job' | 'startup'
    initialIsFavorite?: boolean
    className?: string
}

export function FavoriteButton({ itemId, type, initialIsFavorite = false, className = '' }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (loading) return

        setLoading(true)
        const previousState = isFavorite
        setIsFavorite(!previousState) // Optimistic update

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // If not logged in, maybe redirect or show toast (omitted for now)
                setIsFavorite(previousState)
                alert('Faça login para salvar favoritos.')
                return
            }

            if (previousState) {
                // Remove favorite (We need to find the record, OR delete by logic)
                // Since we don't have the Favorite ID here easily without fetching, 
                // we delete by matching user_id + item_id
                const column = type === 'job' ? 'job_id' : 'startup_id'
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq(column, itemId)

                if (error) throw error
            } else {
                // Add favorite
                const column = type === 'job' ? 'job_id' : 'startup_id'
                const { error } = await supabase
                    .from('favorites')
                    .insert({
                        user_id: user.id,
                        [column]: itemId
                    })

                if (error) throw error
            }

            router.refresh()
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setIsFavorite(previousState) // Revert
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${isFavorite
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                } ${className}`}
            title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            )}
        </button>
    )
}
