'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { currencyMask } from '../_utils/formatters'

export function StartupFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        niche: searchParams.get('niche') || '',
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        min_mrr: searchParams.get('min_mrr') || '',
        max_mrr: searchParams.get('max_mrr') || '',
    })

    // Debounce search update
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (filters.search) {
                params.set('search', filters.search)
            } else {
                params.delete('search')
            }
            router.replace(`?${params.toString()}`)
        }, 500)

        return () => clearTimeout(handler)
    }, [filters.search, router, searchParams])

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (filters.niche) params.set('niche', filters.niche)
        else params.delete('niche')

        if (filters.min_price) params.set('min_price', filters.min_price.replace(/\D/g, ''))
        else params.delete('min_price')

        if (filters.max_price) params.set('max_price', filters.max_price.replace(/\D/g, ''))
        else params.delete('max_price')

        if (filters.min_mrr) params.set('min_mrr', filters.min_mrr.replace(/\D/g, ''))
        else params.delete('min_mrr')

        if (filters.max_mrr) params.set('max_mrr', filters.max_mrr.replace(/\D/g, ''))
        else params.delete('max_mrr')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const clearFilters = () => {
        setFilters({
            search: filters.search, // Keep search
            niche: '',
            min_price: '',
            max_price: '',
            min_mrr: '',
            max_mrr: ''
        })
        const params = new URLSearchParams()
        if (filters.search) params.set('search', filters.search)
        router.push(`?${params.toString()}`)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (['min_price', 'max_price', 'min_mrr', 'max_mrr'].includes(name)) {
            setFilters(prev => ({ ...prev, [name]: currencyMask(value) }))
        } else {
            setFilters(prev => ({ ...prev, [name]: value }))
        }
    }

    const niches = ['SaaS', 'E-commerce', 'Fintech', 'Healthtech', 'Edtech', 'Marketplace', 'Agrotech', 'Logística', 'IA / Machine Learning', 'Web3 / Crypto', 'Outro']

    return (
        <div className="mb-8 space-y-4">
            {/* Search Bar & Filter Toggle */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar startups por nome ou descrição..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${isOpen || (filters.niche || filters.min_price)
                        ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                >
                    <SlidersHorizontal size={20} />
                    Filtros
                </button>
            </div>

            {/* Expanded Filters Panel */}
            {isOpen && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Filter size={16} /> Filtros Avançados
                        </h3>
                        <button onClick={clearFilters} className="text-sm text-zinc-500 hover:text-red-400 transition-colors">
                            Limpar Filtros
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Niche */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Nicho / Vertical</label>
                            <select
                                name="niche"
                                value={filters.niche}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            >
                                <option value="">Todos os Nichos</option>
                                {niches.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Valor da Oferta (R$)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    name="min_price"
                                    value={filters.min_price}
                                    onChange={handleChange}
                                    placeholder="Min"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm"
                                />
                                <span className="text-zinc-600">-</span>
                                <input
                                    name="max_price"
                                    value={filters.max_price}
                                    onChange={handleChange}
                                    placeholder="Max"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* MRR Range */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Receita Mensal (MRR)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    name="min_mrr"
                                    value={filters.min_mrr}
                                    onChange={handleChange}
                                    placeholder="Min"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm"
                                />
                                <span className="text-zinc-600">-</span>
                                <input
                                    name="max_mrr"
                                    value={filters.max_mrr}
                                    onChange={handleChange}
                                    placeholder="Max"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleApplyFilters}
                            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
