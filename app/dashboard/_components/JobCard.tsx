import Link from 'next/link'
import { Briefcase, DollarSign, Clock } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'
import { FavoriteButton } from './FavoriteButton'

// Formatters
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(val)
}

interface JobCardProps {
    isFavorite?: boolean
    hideFavorite?: boolean
    job: {
        id: string
        title: string
        description: string
        job_type: string
        level: string
        format: string
        value_min: number | null
        value_max: number | null
        fixed_value: number | null
        deadline: string | null
        deadline_type?: string
        duration_text?: string
        images: string[] | null
        listing_type?: string
        profiles?: {
            full_name: string
            role: string
            profile_type: string
            company_name: string
            avatar_url: string
        }
    }
}

export function JobCard({ job, isFavorite = false, hideFavorite = false }: JobCardProps) {
    // Determine images to show
    const displayImages = job.images && job.images.length > 0 ? job.images : []

    // Logic for price display
    let suffix = ''
    if (job.format === 'hourly') suffix = '/hr'
    else if (job.format === 'monthly') suffix = '/mês'
    else if (job.format === 'yearly') suffix = '/ano'

    let priceDisplay = ''
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

    if (suffix) priceDisplay += ` ${suffix}`

    // Translation Maps
    const jobTypeMap: Record<string, string> = {
        'full-time': 'Tempo Integral',
        'part-time': 'Meio Período',
        'freelance': 'Freelance',
        'contract': 'Contrato',
        'internship': 'Estágio',
        'design': 'Design',
        'dev': 'Dev',
        'traffic': 'Tráfego',
        'copy': 'Copy',
        'social': 'Social'
    }

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
        'fixed': 'Fixo',
        'hourly': 'Por Hora',
        'project': 'Projeto',
        'yearly': 'Anual'
    }

    return (
        <div className="block group bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-500 transition-all overflow-hidden flex flex-col h-full">

            {/* Carousel Section */}
            <div className="h-48 w-full relative">
                <ImageCarousel images={displayImages} alt={job.title} className="h-full w-full" />

                {/* Favorite Button */}
                {!hideFavorite && (
                    <div className="absolute top-3 left-3 z-10">
                        <FavoriteButton itemId={job.id} type="job" initialIsFavorite={isFavorite} />
                    </div>
                )}

                {/* Type Badge Overlay */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-md shadow-sm z-10 bg-zinc-950/80 text-zinc-300 border border-zinc-500/30">
                    {jobTypeMap[job.job_type.toLowerCase()] || job.job_type}
                </div>
            </div>

            <Link href={`/dashboard/jobs/${job.id}`} className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 font-medium mt-1">
                            <span className="uppercase whitespace-nowrap">{levelMap[job.level?.toLowerCase()] || job.level}</span>
                            <span>•</span>
                            <span className="uppercase whitespace-nowrap">{formatMap[job.format?.toLowerCase()] || job.format}</span>
                        </div>
                    </div>
                </div>

                {/* User Info with Agency Badge */}
                {job.profiles && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                            {job.profiles.avatar_url ? (
                                <img src={job.profiles.avatar_url} alt={job.profiles.full_name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                                    {job.profiles.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm text-zinc-400 truncate">
                                {job.profiles.profile_type === 'agency' && job.profiles.company_name
                                    ? job.profiles.company_name
                                    : job.profiles.full_name}
                            </span>
                            {job.profiles.profile_type === 'agency' && (
                                <div className="bg-purple-500/20 text-purple-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/20">
                                    Agency
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-1">
                    {job.description}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-auto">
                    <div>
                        <p className="text-xs text-zinc-500 mb-1">Valor</p>
                        <div className="font-bold text-white flex items-center gap-1 text-base">
                            {priceDisplay}
                        </div>
                    </div>
                    {job.deadline_type !== 'flexible' && (
                        <div>
                            <p className="text-xs text-zinc-500 mb-1">Prazo</p>
                            <div className="font-bold text-white flex items-center gap-1">
                                <Clock size={14} className="text-blue-500" />
                                {job.deadline_type === 'duration'
                                    ? job.duration_text
                                    : job.deadline ? new Date(job.deadline).toLocaleDateString('pt-BR') : 'Indefinido'
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}
