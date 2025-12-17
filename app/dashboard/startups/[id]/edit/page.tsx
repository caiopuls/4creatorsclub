'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, DollarSign, TrendingUp, Users, Calendar, Globe, AlignLeft, Tag, Briefcase, PieChart, Image as ImageIcon, Type, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { currencyMask } from '../../../_utils/formatters'
import { ImageUpload } from '../../../_components/ImageUpload'
import { Toast } from '../../../_components/Toast'

export default function EditStartupPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()
    const startupId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        niche: '',
        description: '',
        website_url: '',
        logo_url: '',
        foundation_year: '',
        team_size: '',
        mrr: '',
        cac: '',
        ltv: '',
        type: 'sale',
        ask_price: '',
        equity_percentage: '',
        images: [] as string[]
    })

    const formatCurrency = (val: number | null) => {
        if (!val) return ''
        return (val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    }

    // --- FETCH DATA ---
    useEffect(() => {
        async function fetchStartup() {
            try {
                const { data, error } = await supabase
                    .from('startups')
                    .select('*')
                    .eq('id', startupId)
                    .single()

                if (error) throw error

                // Security Check
                const { data: { user } } = await supabase.auth.getUser()
                if (!user || data.owner_id !== user.id) {
                    router.push('/dashboard')
                    return
                }

                setFormData({
                    title: data.title,
                    niche: data.niche,
                    description: data.description,
                    website_url: data.website_url || '',
                    logo_url: data.logo_url || '',
                    foundation_year: data.foundation_year?.toString() || '',
                    team_size: data.team_size?.toString() || '',
                    mrr: formatCurrency(data.mrr),
                    cac: formatCurrency(data.cac),
                    ltv: formatCurrency(data.ltv),
                    type: data.type,
                    ask_price: formatCurrency(data.ask_price),
                    equity_percentage: data.equity_percentage?.toString() || '',
                    images: data.images || []
                })

                setLoading(false)
            } catch (err) {
                console.error(err)
                setError('Erro ao carregar startup')
                setLoading(false)
            }
        }
        fetchStartup()
    }, [startupId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const price = parseFloat(formData.ask_price.replace(/\D/g, '')) / 100
            if (!price) throw new Error('Defina um valor pedido.')

            const payload = {
                title: formData.title,
                niche: formData.niche,
                description: formData.description,
                website_url: formData.website_url || null,
                logo_url: formData.logo_url || null,
                foundation_year: formData.foundation_year ? parseInt(formData.foundation_year) : null,
                team_size: formData.team_size ? parseInt(formData.team_size) : null,
                mrr: formData.mrr ? parseFloat(formData.mrr.replace(/\D/g, '')) / 100 : null,
                cac: formData.cac ? parseFloat(formData.cac.replace(/\D/g, '')) / 100 : null,
                ltv: formData.ltv ? parseFloat(formData.ltv.replace(/\D/g, '')) / 100 : null,
                type: formData.type,
                ask_price: price,
                equity_percentage: formData.type === 'investment' && formData.equity_percentage ? parseFloat(formData.equity_percentage) : null,
                images: formData.images
            }

            const { error: updateError } = await supabase.from('startups').update(payload).eq('id', startupId)
            if (updateError) throw updateError

            setShowToast(true)
            setTimeout(() => {
                router.back()
                router.refresh()
            }, 1000)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao salvar anúncio')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        // Apply mask for financial fields
        if (['mrr', 'cac', 'ltv', 'ask_price'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: currencyMask(value) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Toast message="Alterações salvas!" isVisible={showToast} onClose={() => setShowToast(false)} />

            <Link
                href="/dashboard/my-assets"
                className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Editar Projeto</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">

                {/* Media Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <ImageIcon size={20} className="text-blue-500" />
                        Mídia e Identidade Visual
                    </h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 border-dashed">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Fotos do Projeto / Galeria</label>
                        <p className="text-xs text-zinc-500 mb-4">Adicione capturas de tela, logos ou materiais promocionais. (Máx 5)</p>
                        <ImageUpload
                            onUploadComplete={(urls) => setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))}
                            maxFiles={5}
                            initialImages={formData.images}
                        />
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <AlignLeft size={20} className="text-blue-500" />
                        Sobre o Negócio
                    </h3>

                    <div className="grid gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Type size={16} className="text-zinc-500" />
                                Nome do Projeto / Startup
                            </label>
                            <input
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: SaaS de Gestão de Frota"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <Tag size={16} className="text-zinc-500" />
                                    Nicho / Vertical
                                </label>
                                <div className="relative">
                                    <select
                                        name="niche"
                                        value={formData.niche}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Healthtech">Healthtech</option>
                                        <option value="Edtech">Edtech</option>
                                        <option value="Marketplace">Marketplace</option>
                                        <option value="Agrotech">Agrotech</option>
                                        <option value="Logística">Logística</option>
                                        <option value="IA / Machine Learning">IA / Machine Learning</option>
                                        <option value="Web3 / Crypto">Web3 / Crypto</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                    <TrendingUp className="absolute left-3 top-3.5 text-zinc-600" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <Calendar size={16} className="text-zinc-500" />
                                    Ano de Fundação
                                </label>
                                <input
                                    type="number"
                                    name="foundation_year"
                                    value={formData.foundation_year}
                                    onChange={handleChange}
                                    placeholder="2024"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <AlignLeft size={16} className="text-zinc-500" />
                                Pitch / Descrição
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Descreva o problema que resolve, tecnologia usada, e tração atual..."
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Globe size={16} className="text-zinc-500" />
                                Website URL (Opcional)
                            </label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" />
                        Métricas Chave (Opcional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <DollarSign size={16} className="text-zinc-500" />
                                MRR Atual (R$)
                            </label>
                            <input
                                name="mrr"
                                value={formData.mrr}
                                onChange={handleChange}
                                placeholder="0,00"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Users size={16} className="text-zinc-500" />
                                Tamanho da Equipe
                            </label>
                            <input
                                type="number"
                                name="team_size"
                                value={formData.team_size}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Deal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" />
                        Detalhes da Oferta
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Briefcase size={16} className="text-zinc-500" />
                                Tipo de Negócio
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                            >
                                <option value="sale">Venda Total (Exit)</option>
                                <option value="investment">Rodada de Investimento</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <DollarSign size={16} className="text-zinc-500" />
                                {formData.type === 'sale' ? 'Valor de Venda (R$)' : 'Valuation / Valor Buscado (R$)'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-zinc-500">R$</span>
                                <input
                                    type="text"
                                    name="ask_price"
                                    required
                                    value={formData.ask_price}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        </div>

                        {formData.type === 'investment' && (
                            <div className="col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <PieChart size={16} className="text-zinc-500" />
                                    Equity Oferecido (%)
                                </label>
                                <input
                                    type="number"
                                    name="equity_percentage"
                                    required={formData.type === 'investment'}
                                    value={formData.equity_percentage}
                                    onChange={handleChange}
                                    placeholder="Ex: 10"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : 'Salvar Alterações'}
                    </button>
                </div>

            </form>
        </div>
    )
}
