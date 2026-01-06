'use client'

import { Instagram, Youtube, Twitter, MapPin, ArrowUpRight, FileText, Download } from 'lucide-react'
import Link from 'next/link'

interface CreatorProps {
    id: string;
    name: string;
    niche: string;
    location: string;
    pitch: string;
    media_kit_pdf: string;
    total_followers: string;
    avg_engagement: string;
    start_price: string;
    // We could pass social icons dynamically if joined, but for now we assume simplified
}

export function CreatorCard({ creator }: { creator: CreatorProps }) {

    // Placeholder image logic or fetch from profile if available
    const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=random&color=fff`

    return (
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                    <img
                        src={image}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{creator.name}</h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                {creator.niche}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                                <MapPin size={10} />
                                {creator.location}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex-1">
                <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                    {creator.pitch || "Sem descrição disponível."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#151515] rounded-xl p-3 border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Seguidores</p>
                    <p className="text-lg font-bold text-white">{creator.total_followers}</p>
                </div>
                <div className="bg-[#151515] rounded-xl p-3 border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Engajamento</p>
                    <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                        {creator.avg_engagement}
                        <ArrowUpRight size={14} />
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-auto">
                <div className="text-sm">
                    <p className="text-zinc-500">A partir de</p>
                    <p className="text-white font-bold">{creator.start_price}</p>
                </div>
                {creator.media_kit_pdf ? (
                    <a
                        href={creator.media_kit_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        <Download size={16} />
                        Mídia Kit
                    </a>
                ) : (
                    <span className="text-xs text-zinc-600 italic">Sem PDF</span>
                )}
            </div>
        </div>
    )
}
