import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, DollarSign, TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react'
import { InterestButton } from './_components/InterestButton'
import { ImageCarousel } from '../../_components/ImageCarousel'

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(val)
}

export default async function StartupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data: startup, error } = await supabase
        .from('startups')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .single()

    if (error || !startup) {
        notFound()
    }

    const isOwner = user?.id === startup.owner_id

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <nav className="flex items-center text-sm text-zinc-400 mb-6">
                <Link href="/dashboard/startups" className="hover:text-white transition-colors">Startups</Link>
                <span className="mx-2">/</span>
                <span className="text-white truncate">{startup.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Media Gallery */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <ImageCarousel
                            images={startup.images && startup.images.length > 0 ? startup.images : (startup.logo_url ? [startup.logo_url] : [])}
                            alt={startup.title}
                            className="aspect-video w-full"
                        />
                    </div>

                    {/* Title & Stats Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-4">{startup.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                            <span className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {startup.niche}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> Fundado em {startup.foundation_year || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={14} /> {startup.team_size || 0} pessoas
                            </span>
                            {startup.website_url && (
                                <a href={startup.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                                    <Globe size={14} /> Website
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Description / Pitch */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Sobre o Negócio</h2>
                        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {startup.description}
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Métricas e Dados</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard label="MRR Atual" value={startup.mrr ? formatCurrency(startup.mrr) : '-'} icon={TrendingUp} color="blue" />
                            <MetricCard label="Usuários Ativos" value={startup.active_users || '-'} icon={Users} />
                            <MetricCard label="CAC" value={startup.cac ? formatCurrency(startup.cac) : '-'} icon={Users} />
                            <MetricCard label="LTV" value={startup.ltv ? formatCurrency(startup.ltv) : '-'} icon={TrendingUp} />
                            <MetricCard label="Equity à Venda" value={startup.type === 'investment' ? `${startup.equity_percentage}%` : '100%'} icon={DollarSign} color="emerald" />
                        </div>
                    </div>

                    {/* About Seller */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Sobre o Founder</h3>
                        <Link href={`/dashboard/profile/${startup.owner_id}`} className="flex items-center gap-3 group">
                            <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-lg font-bold border-2 border-transparent group-hover:border-blue-500 transition-all">
                                {startup.profiles?.full_name?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                    {startup.profiles?.full_name || 'Usuário'}
                                </p>
                                <p className="text-xs text-zinc-500">{startup.profiles?.role || 'Membro'}</p>
                            </div>
                        </Link>
                    </div>

                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24 shadow-xl shadow-black/50">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-zinc-400 mb-1">
                                {startup.type === 'sale' ? 'Valor de Aquisição' : 'Investimento Solicitado'}
                            </p>
                            <div className="text-4xl font-bold text-white">
                                {formatCurrency(startup.ask_price)}
                            </div>
                            {startup.type === 'investment' && (
                                <p className="text-xs text-emerald-400 font-medium mt-2 bg-emerald-950/30 border border-emerald-900/50 rounded px-2 py-1 inline-block">
                                    Em troca de {startup.equity_percentage}% de Equity
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircle size={16} className="text-emerald-500" /> Acesso aos dados financeiros
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircle size={16} className="text-emerald-500" /> Reunião com sócios/fundadores
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <InterestButton startupId={startup.id} isOwner={isOwner} />
                            <p className="text-xs text-center text-zinc-500 mt-4">
                                Pagamento e acordo não são disponibilizados pelo 4C Club.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function MetricCard({ label, value, icon: Icon, color = 'zinc' }: any) {
    const colorClasses = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        zinc: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    }
    const theme = colorClasses[color as keyof typeof colorClasses] || colorClasses.zinc

    return (
        <div className={`p-4 rounded-xl border border-zinc-800 bg-zinc-900/50`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md ${theme}`}>
                    <Icon size={14} />
                </div>
                <span className="text-xs font-medium text-zinc-400 uppercase">{label}</span>
            </div>
            <p className="text-lg font-bold text-white truncate" title={value}>{value}</p>
        </div>
    )
}
