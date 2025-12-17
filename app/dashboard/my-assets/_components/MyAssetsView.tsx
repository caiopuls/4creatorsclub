'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { JobCard } from '../../_components/JobCard'
import { StartupCard } from '../../_components/StartupCard'
import { PackageOpen, Send, Rocket, Heart, Filter, LayoutGrid, Briefcase, Pencil, Trash2, MessageCircle, X, Eye, BookOpen, ArrowRight, Users, Loader2 } from 'lucide-react'

interface MyAssetsViewProps {
    createdJobs: any[]
    jobApplications: any[]
    createdStartups: any[]
    favorites: any[]
}

export function MyAssetsView({ createdJobs, jobApplications, createdStartups, favorites }: MyAssetsViewProps) {
    const [view, setView] = useState<'all' | 'jobs' | 'startups' | 'favorites'>('all')
    const [deleteId, setDeleteId] = useState<{ id: string, type: 'job' | 'startup' } | null>(null)
    const [viewApplications, setViewApplications] = useState<any[] | null>(null) // List of applications for modal
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const table = deleteId.type === 'job' ? 'jobs' : 'startups'
            const { error } = await supabase.from(table).delete().eq('id', deleteId.id)
            if (error) throw error
            router.refresh()
            setDeleteId(null)
        } catch (err) {
            console.error('Error deleting:', err)
            alert('Erro ao deletar. Tente novamente.')
        } finally {
            setIsDeleting(false)
        }
    }

    const formatPhone = (phone: string) => {
        return phone.replace(/\D/g, '')
    }

    // Filter Jobs by Type
    const services = createdJobs?.filter(j => j.listing_type === 'freelancing') || []
    const vacancies = createdJobs?.filter(j => j.listing_type === 'hiring') || []

    return (
        <div className="space-y-8">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Meus Projetos</h1>
                    <p className="text-zinc-400">Gerencie todo o seu portfólio 4C em um só lugar.</p>
                </div>

                <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                    <button onClick={() => setView('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Tudo</button>
                    <button onClick={() => setView('jobs')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'jobs' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}><Briefcase size={16} /> Jobs</button>
                    <button onClick={() => setView('startups')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'startups' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}><Rocket size={16} /> Startups</button>
                    <button onClick={() => setView('favorites')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'favorites' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}><Heart size={16} /> Favoritos</button>
                </div>
            </div>


            {/* --- JOBS SECTION --- */}
            {(view === 'all' || view === 'jobs') && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <BriefcaseIcon /> Jobs e Freelas
                    </h2>

                    {/* Services / Freelancing */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg">
                                <Briefcase size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-100">Meus Serviços Publicados</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.length > 0 ? services.map((job: any) => (
                                <div key={job.id} className="relative group flex flex-col">
                                    {/* Actions */}
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={`/dashboard/jobs/${job.id}/edit`} className="p-2 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-black border border-zinc-700 rounded-lg shadow-sm backdrop-blur-sm transition-all" title="Editar">
                                            <Pencil size={14} />
                                        </a>
                                        {job.applications && job.applications.length > 0 && (
                                            <button onClick={() => setViewApplications(job.applications)} className="p-2 bg-blue-900/80 text-blue-200 hover:text-white hover:bg-blue-900 border border-blue-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer" title="Ver Interessados">
                                                <Users size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => setDeleteId({ id: job.id, type: 'job' })} className="p-2 bg-red-900/80 text-red-200 hover:text-white hover:bg-red-900 border border-red-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer" title="Deletar">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Stats Badge */}
                                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
                                        <div className="bg-black/80 text-zinc-400 text-[10px] px-2 py-1 rounded-full border border-zinc-800 flex items-center gap-1 backdrop-blur-sm">
                                            <Eye size={12} /> {job.views || 0} Visualizações
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <JobCard job={job} />
                                    </div>

                                    {/* View Responses Button */}
                                    {/* View Responses Button Removed from here */}
                                </div>
                            )) : <EmptyState text="Nenhum serviço anunciado." />}
                        </div>
                    </div>

                    {/* Vagas / Hiring */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-900/30 text-emerald-400 rounded-lg">
                                <Users size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-100">Minhas Vagas Publicadas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vacancies.length > 0 ? vacancies.map((job: any) => (
                                <div key={job.id} className="relative group flex flex-col">
                                    {/* Actions */}
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={`/dashboard/jobs/${job.id}/edit`} className="p-2 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-black border border-zinc-700 rounded-lg shadow-sm backdrop-blur-sm transition-all" title="Editar">
                                            <Pencil size={14} />
                                        </a>
                                        {job.applications && job.applications.length > 0 && (
                                            <button onClick={() => setViewApplications(job.applications)} className="p-2 bg-blue-900/80 text-blue-200 hover:text-white hover:bg-blue-900 border border-blue-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer" title="Ver Interessados">
                                                <Users size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => setDeleteId({ id: job.id, type: 'job' })} className="p-2 bg-red-900/80 text-red-200 hover:text-white hover:bg-red-900 border border-red-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer" title="Deletar">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Stats Badge */}
                                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
                                        <div className="bg-black/80 text-zinc-400 text-[10px] px-2 py-1 rounded-full border border-zinc-800 flex items-center gap-1 backdrop-blur-sm">
                                            <Eye size={12} /> {job.views || 0} Visualizações
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <JobCard job={job} hideFavorite />
                                    </div>

                                    {/* View Responses Button */}
                                    {/* View Responses Button Removed from here */}
                                </div>
                            )) : <EmptyState text="Nenhuma vaga anunciada." />}
                        </div>
                    </div>

                    {/* Applications */}
                    <section className="space-y-4 pt-8 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-800/50 rounded-lg text-white">
                                <Send size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-100">Minhas Candidaturas Enviadas</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobApplications && jobApplications.length > 0 ? (
                                jobApplications.map((app: any) => {
                                    if (!app.jobs) return null
                                    return (
                                        <div key={app.job_id} className="relative group">
                                            <div className={`absolute -right-1 -top-1 z-10 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border tracking-wider shadow-sm ${app.status === 'accepted' ? 'bg-emerald-500 text-white border-emerald-400' :
                                                app.status === 'rejected' ? 'bg-red-500 text-white border-red-400' :
                                                    'bg-zinc-800 text-zinc-300 border-zinc-700'
                                                }`}>
                                                {app.status === 'pending' ? 'Pendente' : app.status}
                                            </div>
                                            <JobCard job={app.jobs} />
                                        </div>
                                    )
                                })
                            ) : (
                                <EmptyState text="Nenhuma candidatura enviada." />
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* --- STARTUPS SECTION --- */}
            {(view === 'all' || view === 'startups') && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <RocketIcon /> Startups e Investimentos
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Created Startups */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800/50 rounded-lg text-white">
                                    <Rocket size={18} />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-100">Meus Anúncios</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {createdStartups && createdStartups.length > 0 ? (
                                    createdStartups.map((startup: any) => (
                                        <div key={startup.id} className="relative group">
                                            {/* Action Buttons Overlay (Top Left) */}
                                            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={`/dashboard/startups/${startup.id}/edit`} className="p-2 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-black border border-zinc-700 rounded-lg shadow-sm backdrop-blur-sm transition-all">
                                                    <Pencil size={14} />
                                                </a>
                                                {startup.startup_interests && startup.startup_interests.length > 0 && (
                                                    <button onClick={() => setViewApplications(startup.startup_interests)} className="p-2 bg-blue-900/80 text-blue-200 hover:text-white hover:bg-blue-900 border border-blue-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer" title="Ver Interessados">
                                                        <Users size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setDeleteId({ id: startup.id, type: 'startup' })}
                                                    className="p-2 bg-red-900/80 text-red-200 hover:text-white hover:bg-red-900 border border-red-800 rounded-lg shadow-sm backdrop-blur-sm transition-all cursor-pointer"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Stats Badge */}
                                            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
                                                <div className="bg-black/80 text-zinc-400 text-[10px] px-2 py-1 rounded-full border border-zinc-800 flex items-center gap-1 backdrop-blur-sm">
                                                    <Eye size={12} /> {startup.views || 0} Visualizações
                                                </div>
                                            </div>

                                            <StartupCard startup={startup} hideFavorite />

                                            {/* View Interests Button Removed from here */}
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState text="Nenhuma startup anunciada." />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* --- FAVORITES SECTION --- */}
            {(view === 'favorites') && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Heart className="text-red-500" /> Meus Favoritos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites && favorites.length > 0 ? (
                            favorites.map((fav: any) => {
                                if (fav.jobs) {
                                    return (
                                        <div key={fav.id} className="relative group">
                                            <div className="absolute top-3 right-3 z-20 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow-sm flex items-center gap-1">
                                                <Heart size={10} fill="currentColor" /> Favorito
                                            </div>
                                            <JobCard job={fav.jobs} isFavorite />
                                        </div>
                                    )
                                } else if (fav.startups) {
                                    return (
                                        <div key={fav.id} className="relative group">
                                            <div className="absolute top-3 right-3 z-20 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow-sm flex items-center gap-1">
                                                <Heart size={10} fill="currentColor" /> Favorito
                                            </div>
                                            <StartupCard startup={fav.startups} isFavorite />
                                        </div>
                                    )
                                }
                                return null
                            })
                        ) : (
                            <EmptyState text="Nenhum item salvo como favorito." />
                        )}
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-sm w-full space-y-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Tem certeza?</h3>
                        <p className="text-zinc-400 text-sm">Essa ação não pode ser desfeita. O item será removido permanentemente.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer">Cancelar</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium cursor-pointer flex items-center justify-center gap-2">
                                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Sim, deletar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- APPLICATIONS MODAL --- */}
            {viewApplications && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users size={20} className="text-blue-500" />
                                Interessados ({viewApplications.length})
                            </h3>
                            <button onClick={() => setViewApplications(null)} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4">
                            {viewApplications.map((app: any) => (
                                <div key={app.id} className="bg-black/50 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
                                            {app.profiles?.avatar_url ? (
                                                <img src={app.profiles.avatar_url} alt={app.profiles.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-lg">
                                                    {app.profiles?.full_name?.[0] || '?'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{app.profiles?.full_name || 'Usuário Desconhecido'}</h4>
                                                <p className="text-zinc-500 text-xs">{new Date(app.created_at).toLocaleDateString('pt-BR')} às {new Date(app.created_at).toLocaleTimeString('pt-BR')}</p>
                                            </div>
                                            {app.profiles?.phone && (
                                                <a href={`https://wa.me/55${formatPhone(app.profiles.phone)}?text=Olá, vi seu interesse no meu projeto no 4Creators Club!`} target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-emerald-900/20">
                                                    <MessageCircle size={16} /> Chamar no Zap
                                                </a>
                                            )}
                                        </div>
                                        {app.message && <div className="bg-zinc-900 p-3 rounded-lg text-zinc-300 text-sm italic">"{app.message}"</div>}
                                        {app.portfolio_link && <a href={app.portfolio_link} target="_blank" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"><Briefcase size={14} /> Ver Portfólio</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="text-zinc-500 text-sm italic py-8 bg-zinc-900/20 rounded-xl text-center border border-zinc-800 border-dashed hover:bg-zinc-900/40 transition-colors">
            {text}
        </div>
    )
}

function BriefcaseIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
}

function RocketIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
}
