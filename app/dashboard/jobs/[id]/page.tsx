import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Clock, Calendar, DollarSign, CheckCircle, Box } from 'lucide-react'
import { ApplySection } from './_components/ApplySection'
import { ImageCarousel } from '../../_components/ImageCarousel'

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Job with Owner Profile
    const { data: job, error } = await supabase
        .from('jobs')
        .select('*, profiles(full_name, role)')
        .eq('id', id)
        .single()

    if (error || !job) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Check if current user is owner
    const isOwner = user?.id === job.owner_id

    // Check if user has already applied
    let hasApplied = false
    if (user && !isOwner) {
        const { data: application } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', id)
            .eq('applicant_id', user.id)
            .single()

        if (application) hasApplied = true
    }

    const jobImages = job.images && job.images.length > 0 ? job.images : []

    // Translation Maps (copied from JobCard/Form)
    const levelMap: Record<string, string> = {
        'junior': '0-1 anos',
        'pleno': '1-3 anos',
        'senior': '3-5 anos',
        'expert': '5+ anos',
        '0-1': '0-1 anos',
        '1-3': '1-3 anos',
        '3-5': '3-5 anos',
        '5+': '5+ anos'
    }

    const formatMap: Record<string, string> = {
        'one-off': 'Pontual',
        'monthly': 'Mensal',
        'fixed': 'Preço Fixo',
        'hourly': 'Por Hora',
        'project': 'Por Projeto',
        'yearly': 'Anual'
    }

    const jobTypeMap: Record<string, string> = {
        'full-time': 'Tempo Integral',
        'part-time': 'Meio Período',
        'freelance': 'Freelance',
        'contract': 'Contrato',
        'internship': 'Estágio',
        'design': 'Design',
        'dev': 'Dev',
        'traffic': 'Tráfego',
        'copy': 'Copywriting',
        'social': 'Social Media'
    }

    // Price Display Logic
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    let priceDisplay = ''
    let priceSuffix = ''

    if (job.fixed_value) {
        priceDisplay = formatCurrency(job.fixed_value)
    } else if (job.value_min !== null && job.value_max !== null) {
        if (job.value_min === job.value_max) {
            priceDisplay = formatCurrency(job.value_min)
        } else {
            priceDisplay = `${formatCurrency(job.value_min)} - ${formatCurrency(job.value_max)}`
        }
    } else if (job.value_min !== null) {
        priceDisplay = formatCurrency(job.value_min)
    }

    if (job.format === 'hourly') {
        priceSuffix = '/hora'
    } else if (job.format === 'monthly') {
        priceSuffix = '/mês'
    } else if (job.format === 'yearly') {
        priceSuffix = '/ano'
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <nav className="flex items-center text-sm text-zinc-400 mb-6">
                <Link href="/dashboard/jobs?type=freelancing" className="hover:text-white transition-colors">Jobs</Link>
                <span className="mx-2">/</span>
                <span className="text-white truncate">{job.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Media Gallery */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <ImageCarousel
                            images={jobImages}
                            alt={job.title}
                            className="aspect-video w-full"
                        />
                    </div>

                    {/* Title & Stats */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-4">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {jobTypeMap[job.job_type] || job.job_type}
                            </span>
                            <span className="flex items-center gap-1 uppercase">
                                <Briefcase size={14} /> {levelMap[job.level] || job.level}
                            </span>
                            <span className="flex items-center gap-1 uppercase">
                                <Clock size={14} /> {formatMap[job.format] || job.format}
                            </span>
                            {job.deadline_type !== 'flexible' && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {job.deadline_type === 'duration' ? job.duration_text : `Prazo: ${new Date(job.deadline).toLocaleDateString('pt-BR')}`}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Detalhes</h2>
                        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {job.description}
                        </div>
                    </div>

                    {/* Plans Section (New) */}
                    {job.plans && Array.isArray(job.plans) && job.plans.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                                <Box size={20} className="text-blue-500" />
                                Planos Disponíveis
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.plans.map((plan: any, idx: number) => (
                                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{plan.title}</h3>
                                        <p className="text-2xl font-bold text-emerald-400 mb-4">
                                            {formatCurrency(plan.price)}
                                        </p>
                                        <p className="text-sm text-zinc-400 mb-4 min-h-[40px]">{plan.description}</p>

                                        <div className="space-y-3 border-t border-zinc-800 pt-4">
                                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase">
                                                <Clock size={12} /> Prazo: {plan.delivery}
                                            </div>
                                            {plan.topics && plan.topics.length > 0 && (
                                                <ul className="space-y-2">
                                                    {plan.topics.map((t: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                            <CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                                            <span>{t}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About the Client/Freelancer */}
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                            {job.listing_type === 'freelancing' ? 'Sobre o Profissional' : 'Sobre o Cliente'}
                        </h3>
                        <Link href={`/dashboard/profile/${job.owner_id}`} className="flex items-center gap-4 group">
                            <div className="h-12 w-12 bg-zinc-700 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-transparent group-hover:border-blue-500 transition-all overflow-hidden">
                                {job.profiles?.avatar_url ? (
                                    <img src={job.profiles.avatar_url} alt={job.profiles.full_name} className="h-full w-full object-cover" />
                                ) : (
                                    job.profiles?.full_name?.charAt(0) || 'U'
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {job.profiles?.full_name || 'Usuário 4C'}
                                </p>
                                <p className="text-sm text-zinc-500">{job.profiles?.role || 'Membro'}</p>
                            </div>
                        </Link>
                    </div>

                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24 shadow-xl shadow-black/50">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-zinc-400 mb-1">
                                Valor
                            </p>
                            <div className="text-3xl font-bold text-white flex flex-wrap items-baseline gap-2">
                                <DollarSign className="text-emerald-500" size={28} />
                                <span>{priceDisplay}</span>
                                <span className="text-lg text-zinc-500 font-medium">{priceSuffix}</span>
                            </div>
                            {/* logic asking if it is price per hour removed as request */}
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircle size={16} className="text-blue-500" /> Pagamento Garantido
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircle size={16} className="text-blue-500" /> Contrato 4C Seguro
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <ApplySection jobId={job.id} isOwner={isOwner} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
