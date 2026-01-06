'use client'

import { useEffect, useState } from 'react'
import { CreatorFilters, FilterState } from './CreatorFilters'
import { CreatorCard } from './CreatorCard'
import { PlusCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CreatorsPage() {
    const supabase = createClient()
    const [creators, setCreators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filters State
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        niche: '',
        minEngagement: 0,
        region: ''
    })

    useEffect(() => {
        async function fetchCreators() {
            try {
                const { data, error } = await supabase
                    .from('creators')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setCreators(data || [])
            } catch (error) {
                console.error('Error fetching creators:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCreators()
    }, [])

    // Filter Logic
    const filteredCreators = creators.filter(creator => {
        // Search (Name)
        const matchesSearch = creator.name.toLowerCase().includes(filters.search.toLowerCase())

        // Niche
        const matchesNiche = filters.niche ? creator.niche === filters.niche : true

        // Region (Location) - simplified match
        const matchesRegion = filters.region ? creator.location.toLowerCase().includes(filters.region.toLowerCase()) : true

        // Engagement
        let engagementVal = 0
        if (creator.avg_engagement) {
            // Remove % and replace comma with dot if necessary, then parse
            const cleanStr = creator.avg_engagement.replace('%', '').replace(',', '.')
            engagementVal = parseFloat(cleanStr) || 0
        }
        const matchesEngagement = engagementVal >= filters.minEngagement

        return matchesSearch && matchesNiche && matchesRegion && matchesEngagement
    })

    return (
        <div className="min-h-screen bg-[#050505] pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Marketplace de Creators</h1>
                        <p className="text-zinc-400">Encontre as vozes ideais para sua marca ou campanha.</p>
                    </div>
                    <Link
                        href="/dashboard/creators/new"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                        <PlusCircle size={20} />
                        Criar meu Mídia Kit
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <CreatorFilters filters={filters} onChange={setFilters} />

                    {/* Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                        ) : filteredCreators.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredCreators.map((creator) => (
                                    <CreatorCard key={creator.id} creator={creator} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-[#0e0e0e] rounded-2xl border border-zinc-800">
                                <p className="text-zinc-400 text-lg">Nenhum creator encontrado.</p>
                                <p className="text-zinc-600 text-sm mt-2">Tente ajustar os filtros ou seja o primeiro a publicar!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
