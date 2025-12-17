import { createClient } from '@/lib/supabase/server'
import { StartupCard } from '../_components/StartupCard'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

import { StartupFilters } from './StartupFilters'

export default async function StartupsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await searchParams
    const supabase = await createClient()

    let query = supabase
        .from('startups')
        .select('*, profiles(full_name, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // Apply Filters
    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }
    if (params.niche) {
        query = query.eq('niche', params.niche)
    }
    if (params.min_price) {
        query = query.gte('ask_price', parseInt(params.min_price))
    }
    if (params.max_price) {
        query = query.lte('ask_price', parseInt(params.max_price))
    }
    if (params.min_mrr) {
        query = query.gte('mrr', parseInt(params.min_mrr))
    }
    if (params.max_mrr) {
        query = query.lte('mrr', parseInt(params.max_mrr))
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch Favorites
    let favoriteIds = new Set<string>()
    if (user) {
        const { data: favorites } = await supabase
            .from('favorites')
            .select('startup_id')
            .eq('user_id', user.id)
            .not('startup_id', 'is', null)

        if (favorites) {
            favorites.forEach(f => {
                if (f.startup_id) favoriteIds.add(f.startup_id)
            })
        }
    }

    const { data: startups } = await query

    return (
        <div className="space-y-8">
            {/* Header / Hero */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Marketplace de Startups</h1>
                    <p className="text-zinc-400 max-w-xl">
                        Invista em startups validadas ou adquira projetos prontos para escalar.
                        Oportunidades exclusivas para membros 4C.
                    </p>
                </div>
                <Link
                    href="/dashboard/startups/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Anunciar Projeto
                </Link>
            </div>

            {/* Filters */}
            <StartupFilters />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups && startups.length > 0 ? (
                    startups.map((startup) => (
                        <StartupCard key={startup.id} startup={startup} isFavorite={favoriteIds.has(startup.id)} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
                        <h3 className="text-xl font-medium text-white mb-2">Nenhum projeto encontrado</h3>
                        <p className="text-zinc-500 mb-6">Tente ajustar os filtros ou busque por outro termo.</p>
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/dashboard/startups"
                                className="text-blue-400 hover:underline"
                            >
                                Limpar Filtros
                            </Link>
                            <span className="text-zinc-700">|</span>
                            <Link
                                href="/dashboard/startups/new"
                                className="text-zinc-300 hover:text-white"
                            >
                                Anunciar
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
