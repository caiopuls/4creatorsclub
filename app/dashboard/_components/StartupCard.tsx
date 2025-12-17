import Link from 'next/link'
import { Rocket, TrendingUp, DollarSign } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'
import { FavoriteButton } from './FavoriteButton'
import UserBadge from '@/app/components/UserBadge'

// Formatters
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(val)
}

interface StartupCardProps {
    isFavorite?: boolean
    hideFavorite?: boolean
    startup: {
        id: string
        title: string
        niche: string
        description: string
        mrr: number | null
        ask_price: number
        type: string
        equity_percentage: number | null
        logo_url: string | null
        images: string[] | null // New images array
        profiles?: {
            full_name: string
            avatar_url: string
        }
    }
}

export function StartupCard({ startup, isFavorite = false, hideFavorite = false }: StartupCardProps) {
    // Logic to prepare images for carousel
    // If logo_url exists, put it first in the array? Or treat logo separate?
    // User asked for carousel. Let's assume 'images' column is main gallery.
    // If no images, maybe use logo_url as single image if available?

    const displayImages = startup.images && startup.images.length > 0
        ? startup.images
        : (startup.logo_url ? [startup.logo_url] : [])

    return (
        <div className="block group bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-500 transition-all overflow-hidden flex flex-col h-full">

            {/* Carousel Section */}
            <div className="h-48 w-full relative">
                <ImageCarousel images={displayImages} alt={startup.title} className="h-full w-full" />

                {/* Favorite Button */}
                {!hideFavorite && (
                    <div className="absolute top-3 left-3 z-10">
                        <FavoriteButton itemId={startup.id} type="startup" initialIsFavorite={isFavorite} />
                    </div>
                )}

                {/* Type Badge Overlay */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-md shadow-sm z-10 ${startup.type === 'sale'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                    }`}>
                    {startup.type === 'sale' ? 'Venda Total' : `Investimento (${startup.equity_percentage}%)`}
                </div>
            </div>

            <Link href={`/dashboard/startups/${startup.id}`} className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {startup.title}
                        </h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
                            {startup.niche}
                        </p>
                    </div>
                </div>

                {/* User Info */}
                {startup.profiles && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                            {startup.profiles.avatar_url ? (
                                <img src={startup.profiles.avatar_url} alt={startup.profiles.full_name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                                    {startup.profiles.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-zinc-400 truncate">
                            {startup.profiles.full_name}
                        </span>
                        {/* Assuming profiles might have role now, checking broadly */}
                        <UserBadge role={(startup.profiles as any).role} />
                    </div>
                )}

                <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-1">
                    {startup.description}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-auto">
                    <div>
                        <p className="text-xs text-zinc-500 mb-1">Oferta Inicial</p>
                        <div className="font-bold text-white flex items-center gap-1">
                            <DollarSign size={14} className="text-emerald-500" />
                            {formatCurrency(startup.ask_price)}
                        </div>
                    </div>
                    {startup.mrr && (
                        <div>
                            <p className="text-xs text-zinc-500 mb-1">MRR Atual</p>
                            <div className="font-bold text-white flex items-center gap-1">
                                <TrendingUp size={14} className="text-blue-500" />
                                {formatCurrency(startup.mrr)}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}
