'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '../../../_components/ImageUpload'
import {
    ArrowLeft, Loader2, DollarSign, Calendar, Type, Tag, Signal,
    Briefcase, AlignLeft, Clock, Image as ImageIcon, Box, List, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { Toast } from '../../../_components/Toast'

export default function NewFreelancingPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showToast, setShowToast] = useState(false)

    // Form Mode: 'single' (Project) or 'plans' (Packaged Services)
    const [mode, setMode] = useState<'single' | 'plans'>('single')

    // Single Mode Data
    const [singleData, setSingleData] = useState({
        title: '',
        description: '',
        job_type: 'design',
        level: '0-1',
        format: 'project',
        value: '', // Masked value
        deadline_type: 'date',
        deadline: '',
        duration_number: '',
        duration_unit: 'dias',
        images: [] as string[]
    })

    // Plans Mode Data
    type Plan = {
        id: string
        title: string
        price: string // Masked value
        description: string
        delivery_number: string
        delivery_unit: string
        topics: string[]
    }

    const [plans, setPlans] = useState<Plan[]>([
        { id: 'basic', title: 'Básico', price: '', description: '', delivery_number: '', delivery_unit: 'dias', topics: [''] },
        { id: 'pro', title: 'Profissional', price: '', description: '', delivery_number: '', delivery_unit: 'dias', topics: [''] },
        { id: 'expert', title: 'Expert', price: '', description: '', delivery_number: '', delivery_unit: 'dias', topics: [''] }
    ])

    // Common Data
    const [commonData, setCommonData] = useState({
        title: '',
        description: '', // General description
        job_type: 'design',
        level: '0-1',
        images: [] as string[] // Portfolio
    })

    // --- Currency Mask Utility ---
    const formatCurrency = (value: string) => {
        const clean = value.replace(/\D/g, '')
        const number = clean ? parseInt(clean, 10) / 100 : 0
        return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const parseCurrency = (value: string) => {
        return value ? parseFloat(value.replace(/[^\d,]/g, '').replace('.', '').replace(',', '.')) : 0
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any, field: string) => {
        let val = e.target.value
        // If user is deleting, handle empty
        if (val === '') {
            setter((prev: any) => ({ ...prev, [field]: '' }))
            return
        }
        // Basic mask logic: keep only numbers, format
        const clean = val.replace(/\D/g, '')
        const formatted = (parseInt(clean) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        setter((prev: any) => ({ ...prev, [field]: formatted }))
    }
    // -----------------------------

    // --- Plans Management ---
    const addPlan = () => {
        setPlans(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            price: '',
            description: '',
            delivery_number: '',
            delivery_unit: 'dias',
            topics: ['']
        }])
    }

    const removePlan = (index: number) => {
        setPlans(prev => prev.filter((_, i) => i !== index))
    }

    const updatePlan = (index: number, field: keyof Plan, value: any) => {
        setPlans(prev => {
            const newPlans = [...prev]
            newPlans[index] = { ...newPlans[index], [field]: value }
            return newPlans
        })
    }

    const updateTopic = (planIndex: number, topicIndex: number, value: string) => {
        setPlans(prev => {
            const newPlans = [...prev]
            const newTopics = [...newPlans[planIndex].topics]
            newTopics[topicIndex] = value
            newPlans[planIndex].topics = newTopics
            return newPlans
        })
    }

    const addTopic = (planIndex: number) => {
        setPlans(prev => {
            const newPlans = [...prev]
            newPlans[planIndex].topics.push('')
            return newPlans
        })
    }

    const removeTopic = (planIndex: number, topicIndex: number) => {
        setPlans(prev => {
            const newPlans = [...prev]
            newPlans[planIndex].topics = newPlans[planIndex].topics.filter((_, i) => i !== topicIndex)
            return newPlans
        })
    }
    // ------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            let payload: any = {
                owner_id: user.id,
                title: commonData.title,
                description: commonData.description,
                listing_type: 'freelancing',
                job_type: commonData.job_type,
                level: commonData.level,
                images: commonData.images,
                is_fixed_price: true // Actually depends on plan vs single, but keeping consistent schema
            }

            if (mode === 'single') {
                const price = parseCurrency(singleData.value)
                if (!price) throw new Error('Informe o valor do serviço.')

                let finalDeadline = null
                let finalDurationText = ''

                if (singleData.deadline_type === 'date') {
                    if (!singleData.deadline) throw new Error('Informe a data de entrega.')
                    finalDeadline = new Date(singleData.deadline).toISOString()
                } else if (singleData.deadline_type === 'duration') {
                    if (!singleData.duration_number) throw new Error('Informe a duração (número).')
                    finalDurationText = `${singleData.duration_number} ${singleData.duration_unit}`
                }

                payload = {
                    ...payload,
                    format: singleData.format,
                    value_min: price,
                    value_max: price,
                    deadline: finalDeadline,
                    deadline_type: singleData.deadline_type,
                    duration_text: finalDurationText
                }
            } else {
                // Plans Mode
                // Validation
                if (plans.length === 0) throw new Error('Adicione pelo menos um plano.')

                // Get lowest price for search sorting
                let minPrice = Infinity
                const formattedPlans = plans.map(p => {
                    const pPrice = parseCurrency(p.price)
                    if (!pPrice) throw new Error(`O plano "${p.title || 'Sem título'}" precisa de um valor.`)
                    if (pPrice < minPrice) minPrice = pPrice

                    return {
                        title: p.title,
                        price: pPrice,
                        description: p.description,
                        delivery: `${p.delivery_number} ${p.delivery_unit}`,
                        topics: p.topics.filter(t => t.trim() !== '')
                    }
                })

                payload = {
                    ...payload,
                    format: 'project', // Default for plans
                    value_min: minPrice !== Infinity ? minPrice : 0,
                    value_max: minPrice !== Infinity ? minPrice : 0, // Should maybe be max price? keeping simple for now
                    deadline_type: 'duration', // implies plans have durations
                    plans: formattedPlans
                }
            }

            const { error: insertError } = await supabase.from('jobs').insert(payload)
            if (insertError) throw insertError

            // Show success toast and redirect
            setShowToast(true)
            setTimeout(() => {
                router.push('/dashboard/jobs?type=freelancing')
                router.refresh()
            }, 2000)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao criar serviço')
            setLoading(false)
        } finally {
            // setLoading(false) // Moved to catch block for immediate feedback on error
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Toast
                message="Serviço publicado com sucesso!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <Link
                href="/dashboard/jobs?type=freelancing"
                className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Serviços
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Oferecer Serviço</h1>
                <p className="text-zinc-400">Descreva o serviço que você oferece para potenciais clientes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* --- Main Info --- */}
                <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" />
                        Informações Principais
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                            <Type size={16} className="text-zinc-500" />
                            Título do Serviço
                        </label>
                        <input
                            required
                            value={commonData.title}
                            onChange={e => setCommonData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Ex: Identidade Visual Completa"
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Tag size={16} className="text-zinc-500" />
                                Categoria
                            </label>
                            <select
                                value={commonData.job_type}
                                onChange={e => setCommonData(prev => ({ ...prev, job_type: e.target.value }))}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                            >
                                <option value="design">Design</option>
                                <option value="dev">Desenvolvimento</option>
                                <option value="traffic">Tráfego</option>
                                <option value="copy">Copywriting</option>
                                <option value="social">Social Media</option>
                                <option value="other">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Signal size={16} className="text-zinc-500" />
                                Experiência
                            </label>
                            <select
                                value={commonData.level}
                                onChange={e => setCommonData(prev => ({ ...prev, level: e.target.value }))}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                            >
                                <option value="0-1">0 a 1 ano</option>
                                <option value="1-3">1 a 3 anos</option>
                                <option value="3-5">3 a 5 anos</option>
                                <option value="5+">Mais de 5 anos</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                            <AlignLeft size={16} className="text-zinc-500" />
                            Descrição Geral
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={commonData.description}
                            onChange={e => setCommonData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descreva seu serviço..."
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                            <ImageIcon size={16} className="text-zinc-500" />
                            Portfólio / Imagens
                        </label>
                        <ImageUpload
                            onUploadComplete={(urls) => setCommonData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))}
                            maxFiles={3}
                        />
                    </div>
                </div>

                {/* --- Mode Selector --- */}
                <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
                    <button
                        type="button"
                        onClick={() => setMode('single')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'single' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Projeto Único
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('plans')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'plans' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Planos / Pacotes
                    </button>
                </div>

                {/* --- Single Mode Inputs --- */}
                {mode === 'single' && (
                    <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                            <DollarSign size={20} className="text-blue-500" />
                            Preço e Prazo
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <Briefcase size={16} className="text-zinc-500" />
                                    Modelo de Cobrança
                                </label>
                                <select
                                    value={singleData.format}
                                    onChange={e => setSingleData(prev => ({ ...prev, format: e.target.value }))}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                                >
                                    <option value="project">Por Projeto</option>
                                    <option value="hourly">Por Hora</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="yearly">Anual</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <DollarSign size={16} className="text-zinc-500" />
                                    Valor (R$)
                                </label>
                                <input
                                    required
                                    value={singleData.value}
                                    onChange={e => handleCurrencyChange(e, setSingleData, 'value')}
                                    placeholder="0,00"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Clock size={16} className="text-zinc-500" />
                                Prazo de Entrega
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    value={singleData.deadline_type}
                                    onChange={e => setSingleData(prev => ({ ...prev, deadline_type: e.target.value }))}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                                >
                                    <option value="date">Data Específica</option>
                                    <option value="duration">Duração</option>
                                    <option value="flexible">À Combinar</option>
                                </select>

                                {singleData.deadline_type === 'date' && (
                                    <input
                                        required
                                        type="date"
                                        value={singleData.deadline}
                                        onChange={e => setSingleData(prev => ({ ...prev, deadline: e.target.value }))}
                                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none hover:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                                    />
                                )}

                                {singleData.deadline_type === 'duration' && (
                                    <div className="flex gap-2">
                                        <input
                                            required
                                            type="number"
                                            value={singleData.duration_number}
                                            onChange={e => setSingleData(prev => ({ ...prev, duration_number: e.target.value }))}
                                            placeholder="Ex: 7"
                                            className="w-24 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none"
                                        />
                                        <select
                                            value={singleData.duration_unit}
                                            onChange={e => setSingleData(prev => ({ ...prev, duration_unit: e.target.value }))}
                                            className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                                        >
                                            <option value="dias">Dias</option>
                                            <option value="semanas">Semanas</option>
                                            <option value="meses">Meses</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Plants Mode Inputs --- */}
                {mode === 'plans' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Box size={24} className="text-blue-500" />
                                Seus Planos
                            </h3>
                            <button type="button" onClick={addPlan} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2">
                                <Box size={16} /> Adicionar Plano
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {plans.map((plan, index) => (
                                <div key={plan.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative group hover:border-zinc-700 transition-all">
                                    <button
                                        type="button"
                                        onClick={() => removePlan(index)}
                                        className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        Remover
                                    </button>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                            <Type size={14} />
                                            <span className="text-xs font-medium uppercase">Nome do Plano</span>
                                        </div>
                                        <input
                                            value={plan.title}
                                            onChange={e => updatePlan(index, 'title', e.target.value)}
                                            placeholder="Nome do Plano (Ex: Básico)"
                                            className="w-full bg-transparent border-b border-zinc-700 pb-2 text-lg font-bold text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                                        />

                                        <div className="relative">
                                            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1">
                                                <DollarSign size={14} />
                                                Valor
                                            </label>
                                            <span className="absolute left-3 top-8 text-zinc-500 text-sm">R$</span>
                                            <input
                                                value={plan.price}
                                                onChange={e => {
                                                    let val = e.target.value
                                                    if (val === '') {
                                                        updatePlan(index, 'price', '')
                                                        return
                                                    }
                                                    const clean = val.replace(/\D/g, '')
                                                    const formatted = (parseInt(clean) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                                    updatePlan(index, 'price', formatted)
                                                }}
                                                placeholder="0,00"
                                                className="w-full bg-black border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1">
                                                <AlignLeft size={14} />
                                                Descrição
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={plan.description}
                                                onChange={e => updatePlan(index, 'description', e.target.value)}
                                                placeholder="Breve descrição..."
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1">
                                                <Clock size={14} />
                                                Prazo
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={plan.delivery_number}
                                                    onChange={e => updatePlan(index, 'delivery_number', e.target.value)}
                                                    placeholder="Prazo"
                                                    className="w-20 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                                />
                                                <select
                                                    value={plan.delivery_unit}
                                                    onChange={e => updatePlan(index, 'delivery_unit', e.target.value)}
                                                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none appearance-none"
                                                >
                                                    <option value="dias">Dias</option>
                                                    <option value="semanas">Semanas</option>
                                                    <option value="meses">Meses</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                <List size={14} />
                                                O que está incluso:
                                            </label>
                                            {plan.topics.map((topic, tIndex) => (
                                                <div key={tIndex} className="flex gap-2">
                                                    <input
                                                        value={topic}
                                                        onChange={e => updateTopic(index, tIndex, e.target.value)}
                                                        placeholder="Item incluso..."
                                                        className="flex-1 bg-black/50 border border-zinc-800 rounded px-2 py-1 text-sm text-white outline-none focus:border-zinc-600"
                                                    />
                                                    <button type="button" onClick={() => removeTopic(index, tIndex)} className="text-zinc-600 hover:text-red-400 cursor-pointer">
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addTopic(index)}
                                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                                            >
                                                + Adicionar Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 flex items-center gap-2">
                        <CheckCircle size={20} className="text-red-500" />
                        {error}
                    </div>
                )}

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-white/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Publicando...
                            </>
                        ) : 'Publicar Serviço'}
                    </button>
                </div>

            </form>
        </div>
    )
}
