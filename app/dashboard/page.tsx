import Link from 'next/link'
import { Rocket, Briefcase, ChevronRight, BookOpen, Users, ArrowRight } from 'lucide-react'

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
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tighter text-white">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Membro 4C'}.</h1>

            {/* --- WIDGETS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookOpen size={100} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Curso 4Creators</h3>
                        <p className="text-zinc-300 text-sm mb-4">Aprenda habilidades e a escalar seus negócios com nossa metodologia exclusiva.</p>
                    </div>
                    <a href="#" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all text-sm">
                        Acessar Curso <ArrowRight size={16} />
                    </a>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Comunidade Exclusiva</h3>
                        <p className="text-zinc-300 text-sm mb-4">Conecte-se com outros creators e founders no nosso grupo VIP.</p>
                    </div>
                    <a href="https://chat.whatsapp.com/FjfHYbParqg6ZdMuozAeVI?mode=hqrt2" target="_blank" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all text-sm">
                        Entrar no Grupo <ArrowRight size={16} />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Jobs */}
                <Link
                    href="/dashboard/jobs"
                    className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all"
                >
                    <div className="absolute right-0 top-0 p-32 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all" />

                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                            <Briefcase size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Marketplace de Oportunidades</h2>
                        <p className="text-zinc-400 mb-6">
                            Encontre oportunidades de trabalho ou contrate talentos da comunidade.
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                            Acessar Jobs <ChevronRight size={16} />
                        </span>
                    </div>
                </Link>

                {/* Card Startups */}
                <Link
                    href="/dashboard/startups"
                    className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all"
                >
                    <div className="absolute right-0 top-0 p-32 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all" />

                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                            <Rocket size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Marketplace de Startups</h2>
                        <p className="text-zinc-400 mb-6">
                            Invista em negócios promissores ou anuncie sua startup para venda (Exit).
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                            Ver Startups <ChevronRight size={16} />
                        </span>
                    </div>
                </Link>
            </div>

        </div>
    )
}
