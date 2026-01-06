'use client'

import { Search, SlidersHorizontal, MapPin } from 'lucide-react'

const NICHES = [
    "Tecnologia", "Lifestyle", "Beleza", "Moda", "Fitness", "Saúde", "Negócios", "Finanças",
    "Educação", "Entretenimento", "Humor", "Games", "Viagens", "Gastronomia", "Decoração",
    "Maternidade", "Pets", "Carros", "Esportes", "Música", "Arte & Design", "Fotografia"
]

export interface FilterState {
    search: string;
    niche: string;
    minEngagement: number;
    region: string;
    // followers: string[]; // For future implementation
}

interface CreatorFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export function CreatorFilters({ filters, onChange }: CreatorFiltersProps) {

    const handleChange = (key: keyof FilterState, value: any) => {
        onChange({ ...filters, [key]: value })
    }

    return (
        <aside className="w-full md:w-72 flex flex-col gap-6 md:sticky md:top-24 h-fit">

            {/* SEARCH */}
            <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                    <Search size={16} />
                    Buscar Creator
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Nome ou @usuario"
                        className="w-full bg-[#151515] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>
            </div>

            {/* FILTERS */}
            <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-400 mb-6 flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Filtros Avançados
                </h3>

                <div className="space-y-6">

                    {/* Niche */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Nicho</label>
                        <select
                            className="w-full bg-[#151515] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                            value={filters.niche}
                            onChange={(e) => handleChange('niche', e.target.value)}
                        >
                            <option value="">Todos os nichos</option>
                            {NICHES.map(niche => (
                                <option key={niche} value={niche}>{niche}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reach / Followers */}
                    {/* <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Seguidores</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-[#151515] text-blue-500 focus:ring-0 focus:ring-offset-0" />
                                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Micro (10k - 50k)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-[#151515] text-blue-500 focus:ring-0 focus:ring-offset-0" />
                                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Mid (50k - 200k)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-[#151515] text-blue-500 focus:ring-0 focus:ring-offset-0" />
                                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Macro (200k - 1M)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-[#151515] text-blue-500 focus:ring-0 focus:ring-offset-0" />
                                <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Mega (1M+)</span>
                            </label>
                        </div>
                    </div> */}

                    {/* Region */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Região</label>
                        <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                            <select
                                className="w-full bg-[#151515] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 appearance-none"
                                value={filters.region}
                                onChange={(e) => handleChange('region', e.target.value)}
                            >
                                <option value="">Todo o Brasil</option>
                                <option value="sp">SP</option>
                                <option value="rj">RJ</option>
                                <option value="mg">MG</option>
                                <option value="sul">Sul</option>
                                <option value="nordeste">Nordeste</option>
                            </select>
                        </div>
                    </div>

                    {/* Engagement */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Engajamento Mínimo</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
                                value={filters.minEngagement}
                                onChange={(e) => handleChange('minEngagement', Number(e.target.value))}
                            />
                            <span className="text-sm font-mono text-blue-400 min-w-[3ch]">{filters.minEngagement}%</span>
                        </div>
                    </div>

                    {/* Reset Button (Optional visual aid) */}
                    <button
                        onClick={() => onChange({ search: '', niche: '', minEngagement: 0, region: '' })}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors text-sm"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>
        </aside>
    )
}
