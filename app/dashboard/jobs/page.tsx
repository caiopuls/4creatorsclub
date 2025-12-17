import { createClient } from '@/lib/supabase/server'
import { JobCard } from '../_components/JobCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

import { JobFilters } from './JobFilters'

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ type?: string, search?: string, job_type?: string, level?: string, min_value?: string, max_value?: string }> }) {
    const params = await searchParams
    const listingType = params.type === 'freelancing' ? 'freelancing' : 'hiring' // Default to Hiring (Opportunities)

    const supabase = await createClient()

    // Fetch Jobs with Profile
    let query = supabase
        .from('jobs')
        .select(`
            *,
            profiles (
                full_name,
                role,
                profile_type,
                company_name,
                avatar_url
            )
        `)
        .eq('listing_type', listingType)
        .order('created_at', { ascending: false })

    // Apply Filters
    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }

    if (params.job_type) {
        query = query.eq('job_type', params.job_type)
    }
    if (params.level) {
        query = query.eq('level', params.level)
    }
    if (params.min_value) {
        // Let's go with: Job Minimum Value >= Filter Minimum
        query = query.gte('value_min', parseInt(params.min_value))
    }
    if (params.max_value) {
        // Simple Logic: value_min <= Max Filter
        query = query.lte('value_min', parseInt(params.max_value))
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch Favorites (if user is logged in)
    let favoriteIds = new Set<string>()
    if (user) {
        const { data: favorites } = await supabase
            .from('favorites')
            .select('job_id')
            .eq('user_id', user.id)
            .not('job_id', 'is', null) // Ensure only jobs

        if (favorites) {
            favorites.forEach(f => {
                if (f.job_id) favoriteIds.add(f.job_id)
            })
        }
    }

    const { data: jobs, error } = await query

    if (error) {
        console.error('Error fetching jobs:', error)
    } else {
        console.log(`Fetched ${jobs?.length} jobs for type: ${listingType}`)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Marketplace de {listingType === 'hiring' ? 'Oportunidades' : 'Serviços'}</h1>
                    <p className="text-zinc-400">
                        {listingType === 'hiring'
                            ? 'Encontre projetos para atuar e ganhe dinheiro.'
                            : 'Contrate especialistas para o seu projeto.'}
                    </p>
                </div>
                <Link
                    href={listingType === 'hiring' ? '/dashboard/jobs/new/hiring' : '/dashboard/jobs/new/freelancing'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    {listingType === 'hiring' ? 'Publicar Vaga' : 'Oferecer Serviço'}
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                {/* Toggle Filter */}
                <div className="flex bg-zinc-900/50 p-1 rounded-lg w-full md:w-fit border border-zinc-800">
                    <Link
                        href="/dashboard/jobs?type=hiring"
                        className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all text-center ${listingType === 'hiring'
                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                            : 'text-zinc-400 hover:text-white'}`}
                    >
                        Oportunidades
                    </Link>
                    <Link
                        href="/dashboard/jobs?type=freelancing"
                        className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all text-center ${listingType === 'freelancing'
                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                            : 'text-zinc-400 hover:text-white'}`}
                    >
                        Serviços
                    </Link>
                </div>
            </div>

            <JobFilters />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} isFavorite={favoriteIds.has(job.id)} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50 border-dashed">
                        <p className="text-zinc-500 text-lg">Nenhum item encontrado nesta categoria.</p>
                        <p className="text-zinc-600 text-sm mt-1">Seja o primeiro a publicar!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
