import Link from 'next/link'
import { Rocket, Briefcase, ChevronRight, BookOpen, Users, ArrowRight, Lock, Zap, Search, DollarSign, PlusCircle, Target } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let profile = null

    if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        profile = data
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold tracking-tighter text-white">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Membro 4C'}.</h1>

            {/* --- TOP WIDGETS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">

                {/* COURSE - LOCKED */}
                <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden group">
                    {/* Lock Overlay */}
                    <div className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 z-20">
                        <Lock size={12} />
                        Em desenvolvimento
                    </div>

                    <div className="absolute top-0 right-0 p-3 opacity-5">
                        <BookOpen size={100} />
                    </div>

                    <div className="opacity-50 blur-[0.5px] pointer-events-none">
                        <h3 className="text-xl font-bold text-white mb-2">Curso 4Creators</h3>
                        <p className="text-zinc-400 text-sm mb-4 max-w-[80%]">
                            Aprenda habilidades e a escalar seus negócios com nossa metodologia exclusiva.
                        </p>
                    </div>

                    <div className="mt-4">
                        <button disabled className="inline-flex items-center gap-2 text-zinc-500 font-semibold text-sm cursor-not-allowed border border-zinc-800 bg-zinc-900 px-4 py-2 rounded-lg">
                            <Lock size={14} /> Liberado em breve
                        </button>
                    </div>
                </div>

                {/* COMMUNITY */}
                <div className="bg-[#051a14] border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-emerald-500">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Comunidade Exclusiva</h3>
                        <p className="text-zinc-300 text-sm mb-4">Conecte-se com outros creators e founders no nosso grupo VIP.</p>
                    </div>
                    <a href="https://chat.whatsapp.com/FjfHYbParqg6ZdMuozAeVI?mode=hqrt2" target="_blank" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all text-sm group-hover:text-emerald-400">
                        Entrar no Grupo <ArrowRight size={16} />
                    </a>
                </div>
            </div>

            {/* --- PROFILE ACTIONS --- */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="text-blue-500" />
                    O que você busca hoje?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* BUILDER */}
                    <div className="bg-[#0e0e0e] border border-blue-900/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Builders</h3>
                                <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Vender Serviços</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/dashboard/jobs/new?type=service" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero vender meu serviço</span>
                                <PlusCircle size={16} className="text-zinc-500 group-hover/link:text-blue-500 transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* CREATOR */}
                    <div className="bg-[#0e0e0e] border border-pink-900/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Creators</h3>
                                <p className="text-xs text-pink-400 font-medium uppercase tracking-wider">Influência</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/dashboard/jobs/new?type=creator" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero vender minha audiência</span>
                                <DollarSign size={16} className="text-zinc-500 group-hover/link:text-pink-500 transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* FOUNDER */}
                    <div className="bg-[#0e0e0e] border border-amber-900/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Rocket size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Founders</h3>
                                <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">Negócios</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/dashboard/jobs?category=service" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero contratar um serviço</span>
                                <Search size={16} className="text-zinc-500 group-hover/link:text-amber-500 transition-colors" />
                            </Link>
                            <Link href="/dashboard/jobs?category=creator" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero contratar um creator</span>
                                <Search size={16} className="text-zinc-500 group-hover/link:text-amber-500 transition-colors" />
                            </Link>
                            <div className="h-px bg-[#222] my-2" />
                            <Link href="/dashboard/startups" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero investir em startups</span>
                                <DollarSign size={16} className="text-zinc-500 group-hover/link:text-amber-500 transition-colors" />
                            </Link>
                            <Link href="/dashboard/startups/new" className="flex items-center justify-between p-4 rounded-xl bg-[#151515] border border-[#222] hover:bg-[#1a1a1a] hover:border-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group/link shadow-md">
                                <span className="text-zinc-300 text-sm font-medium group-hover/link:text-white">Quero encontrar investidores</span>
                                <Rocket size={16} className="text-zinc-500 group-hover/link:text-amber-500 transition-colors" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
