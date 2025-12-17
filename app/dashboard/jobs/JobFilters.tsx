'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, SlidersHorizontal, Briefcase } from 'lucide-react'
import { currencyMask } from '../_utils/formatters'

export function JobFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        job_type: searchParams.get('job_type') || '',
        level: searchParams.get('level') || '',
        min_value: searchParams.get('min_value') || '',
        max_value: searchParams.get('max_value') || '',
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

        if (filters.job_type) params.set('job_type', filters.job_type)
        else params.delete('job_type')

        if (filters.level) params.set('level', filters.level)
        else params.delete('level')

        if (filters.min_value) params.set('min_value', filters.min_value.replace(/\D/g, ''))
        else params.delete('min_value')

        if (filters.max_value) params.set('max_value', filters.max_value.replace(/\D/g, ''))
        else params.delete('max_value')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const clearFilters = () => {
        setFilters({
            search: filters.search,
            job_type: '',
            level: '',
            min_value: '',
            max_value: ''
        })
        const params = new URLSearchParams()
        if (filters.search) params.set('search', filters.search)
        // Keep the listing type (opportunities/services) if it exists
        const currentType = searchParams.get('type')
        if (currentType) params.set('type', currentType)

        router.push(`?${params.toString()}`)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (['min_value', 'max_value'].includes(name)) {
            setFilters(prev => ({ ...prev, [name]: currencyMask(value) }))
        } else {
            setFilters(prev => ({ ...prev, [name]: value }))
        }
    }

    return (
        <div className="mb-8 space-y-4">
            {/* Search Bar & Filter Toggle */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar jobs por título, descrição..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${isOpen || (filters.job_type || filters.min_value)
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
                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                            <select
                                name="job_type"
                                value={filters.job_type}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            >
                                <option value="">Todas as Categorias</option>
                                <option value="design">Design</option>
                                <option value="dev">Desenvolvimento</option>
                                <option value="traffic">Tráfego</option>
                                <option value="copy">Copywriting</option>
                                <option value="social">Social Media</option>
                                <option value="other">Outros</option>
                            </select>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Nível</label>
                            <select
                                name="level"
                                value={filters.level}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                            >
                                <option value="">Todos os Níveis</option>
                                <option value="junior">Júnior</option>
                                <option value="pleno">Pleno</option>
                                <option value="senior">Sênior</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Orçamento / Valor (R$)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    name="min_value"
                                    value={filters.min_value}
                                    onChange={handleChange}
                                    placeholder="Min"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm"
                                />
                                <span className="text-zinc-600">-</span>
                                <input
                                    name="max_value"
                                    value={filters.max_value}
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
