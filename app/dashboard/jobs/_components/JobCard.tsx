import Link from 'next/link'
import { BadgeDollarSign, Clock, Briefcase, ChevronRight } from 'lucide-react'

// Helper for formatting currency
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(val)
}

// Helper for formatting value range
const formatValue = (min: number | null, max: number | null, isFixed: boolean) => {
    if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`
    if (min) return `A partir de ${formatCurrency(min)}`
    if (max) return `Até ${formatCurrency(max)}`
    return 'A combinar'
}

// Helper for time ago
const timeAgo = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24))
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    return `há ${days} dias`
}

interface JobCardProps {
    job: {
        id: string
        title: string
        job_type: string
        level: string
        format: string
        value_min: number | null
        value_max: number | null
        is_fixed_price: boolean
        created_at: string
        profiles: {
            full_name: string | null
            role: string | null
        } | null
    }
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Link
            href={`/jobs/${job.id}`}
            className="block group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-black hover:border-zinc-700 transition-all"
        >
            <div className="flex justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {job.job_type}
                        </span>
                        <span className="text-xs font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {job.level}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-1">
                        {job.title}
                    </h3>

                    <p className="text-sm text-zinc-400 mb-4">
                        Publicado por <span className="text-white">{job.profiles?.full_name || 'Usuário'}</span> • {timeAgo(job.created_at)}
                    </p>
                </div>

                <div className="hidden sm:block">
                    <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm border-t border-zinc-800 pt-4 mt-2">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <BadgeDollarSign size={16} />
                    {formatValue(job.value_min, job.value_max, job.is_fixed_price)}
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                    <Briefcase size={16} />
                    <span className="capitalize">{job.format === 'one-off' ? 'Projeto Pontual' : job.format === 'monthly' ? 'Mensal' : 'Fixo'}</span>
                </div>
            </div>
        </Link>
    )
}
