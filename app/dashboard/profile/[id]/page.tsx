import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Briefcase, Calendar } from 'lucide-react'
import { StartupCard } from '../../_components/StartupCard'
import { JobCard } from '../../_components/JobCard'

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (!profile) return notFound()

    // Fetch User's Startups
    const { data: startups } = await supabase
        .from('startups')
        .select('*')
        .eq('owner_id', id)
        .order('created_at', { ascending: false })

    // Fetch User's Jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('owner_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Dashboard
            </Link>

            {/* Header / Profile Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="h-32 w-32 bg-zinc-800 rounded-full flex items-center justify-center text-4xl font-bold text-zinc-500 border-4 border-zinc-950 shadow-xl">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        profile.full_name?.charAt(0) || '?'
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-white">{profile.full_name || 'Usuário Sem Nome'}</h1>
                            {profile.profile_type === 'agency' && (
                                <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                    <Briefcase size={12} />
                                    Agência
                                </div>
                            )}
                        </div>
                        {profile.profile_type === 'agency' && profile.company_name && (
                            <p className="text-zinc-400 text-lg mb-1">{profile.company_name}</p>
                        )}
                        <p className="text-blue-400 font-medium">{profile.role || 'Membro da Comunidade'}</p>
                    </div>

                    <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
                        {profile.bio || 'Sem biografia.'}
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                            <Calendar size={16} />
                            Entrou em {new Date(profile.created_at || Date.now()).toLocaleDateString()}
                        </div>
                        {/* Placeholder for location or other info */}
                    </div>
                </div>
            </div>

            {/* Content Tabs / Sections */}
            <div className="space-y-12">

                {/* Startups Section */}
                {startups && startups.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-purple-500" /> Startups & Projetos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {startups.map((startup) => (
                                <StartupCard key={startup.id} startup={startup} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Jobs Section */}
                {jobs && jobs.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-500" /> Jobs Publicados
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    </section>
                )}

                {(!startups?.length && !jobs?.length) && (
                    <div className="text-center py-12 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/30">
                        <p className="text-zinc-500">Este usuário ainda não publicou projetos ou jobs.</p>
                    </div>
                )}

            </div>
        </div>
    )
}
