'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '../../_components/ImageUpload'
import { ArrowLeft, Loader2, DollarSign, Calendar, Type, Tag, Signal, Briefcase, AlignLeft, Clock, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function NewJobPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        listing_type: 'hiring',
        job_type: 'design', // Default value from select
        level: 'junior', // Default value
        format: 'one-off',
        deadline_type: 'date',
        duration_text: '',
        value_min: '',
        value_max: '',
        fixed_value: '',
        deadline: '',
        images: [] as string[]
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            // Validate values
            const min = formData.value_min ? parseFloat(formData.value_min.replace(/\D/g, '')) / 100 : null
            const max = formData.value_max ? parseFloat(formData.value_max.replace(/\D/g, '')) / 100 : null

            if (!min && !max) {
                throw new Error('Informe pelo menos um valor estimado.')
            }

            // Deadline logic
            let finalDeadline = null
            if (formData.deadline_type === 'date' && formData.deadline) {
                finalDeadline = new Date(formData.deadline).toISOString()
            }

            const { error: insertError } = await supabase.from('jobs').insert({
                owner_id: user.id,
                title: formData.title,
                description: formData.description,
                listing_type: formData.listing_type,
                job_type: formData.job_type,
                level: formData.level,
                format: formData.format,
                value_min: min,
                value_max: max,
                is_fixed_price: !!(min && !max) || (!!min && !!max && min === max),
                deadline: finalDeadline,
                deadline_type: formData.deadline_type,
                duration_text: formData.duration_text,
                images: formData.images
            })

            if (insertError) throw insertError

            router.push('/dashboard/jobs')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao criar job')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Currency input mask helper could be added here, but keeping it simple with raw input for now or HTML5 number
    // User wanted "Valor ou faixa".

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/dashboard/jobs"
                className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Jobs
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Publicar Nova Oportunidade</h1>
                <p className="text-zinc-400">Preencha os detalhes para encontrar o talento ideal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" />
                        Sobre o Job
                    </h3>

                    <div className="grid gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Type size={16} className="text-zinc-500" />
                                Título do Job
                            </label>
                            <input
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: Landing Page para SaaS B2B"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                    <Tag size={16} className="text-zinc-500" />
                                    Categoria
                                </label>
                                <select
                                    name="job_type"
                                    value={formData.job_type}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none appearance-none"
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
                                    Nível Esperado
                                </label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none appearance-none"
                                >
                                    <option value="junior">Júnior</option>
                                    <option value="pleno">Pleno</option>
                                    <option value="senior">Sênior</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listing Type Toggle */}
                <div className="bg-zinc-800 p-1 rounded-lg flex mb-8">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, listing_type: 'hiring' }))}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.listing_type === 'hiring' ? 'bg-zinc-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Quero Contratar (Vaga)
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, listing_type: 'freelancing' }))}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.listing_type === 'freelancing' ? 'bg-zinc-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Oferecer Serviço (Freelancer)
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <AlignLeft size={20} className="text-blue-500" />
                        Detalhes e Prazo
                    </h3>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                            <AlignLeft size={16} className="text-zinc-500" />
                            Descrição Completa
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva o escopo, requisitos e expectativas..."
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Briefcase size={16} className="text-zinc-500" />
                                Formato de Contratação
                            </label>
                            <select
                                name="format"
                                value={formData.format}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none appearance-none"
                            >
                                <option value="fixed">Preço Fixo</option>
                                <option value="monthly">Freelancer Mensal (Recorrente)</option>
                                <option value="one-off">Projeto Pontual</option>
                            </select>
                        </div>

                        {/* Flex Deadline Input */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <Clock size={16} className="text-zinc-500" />
                                Prazo / Deadline
                            </label>
                            <div className="flex gap-2 mb-2">
                                <select
                                    name="deadline_type"
                                    value={formData.deadline_type}
                                    onChange={handleChange}
                                    className="bg-black border border-zinc-800 rounded-lg px-2 py-2 text-sm text-white focus:ring-2 focus:ring-white/20 outline-none"
                                >
                                    <option value="date">Data Específica</option>
                                    <option value="duration">Duração (Dias/Meses)</option>
                                    <option value="flexible">Flexível / Sem Prazo</option>
                                </select>
                            </div>

                            {formData.deadline_type === 'date' && (
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none hover:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                                    />
                                </div>
                            )}

                            {formData.deadline_type === 'duration' && (
                                <input
                                    type="text"
                                    name="duration_text"
                                    value={formData.duration_text}
                                    onChange={handleChange}
                                    placeholder="Ex: Em até 30 dias"
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                />
                            )}

                            {formData.deadline_type === 'flexible' && (
                                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-500 italic">
                                    Sem prazo definido
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <ImageIcon size={20} className="text-blue-500" />
                        Imagens / Referências
                    </h3>
                    <ImageUpload
                        onUploadComplete={(urls) => setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))}
                        maxFiles={3}
                    />
                </div>

                {/* Budget */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <DollarSign size={20} className="text-blue-500" />
                        Orçamento
                    </h3>
                    <p className="text-sm text-zinc-500">Jobs sem valor definido não são permitidos. Dê uma estimativa justa.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <DollarSign size={16} className="text-zinc-500" />
                                Valor Mínimo (R$)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-zinc-500">R$</span>
                                <input
                                    type="text"
                                    name="value_min"
                                    value={formData.value_min}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    required
                                    className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1">
                                <DollarSign size={16} className="text-zinc-500" />
                                Valor Máximo (R$)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-zinc-500">R$</span>
                                <input
                                    type="text"
                                    name="value_max"
                                    value={formData.value_max}
                                    onChange={handleChange}
                                    placeholder="opcional"
                                    className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                />
                            </div>
                        </div>
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
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Publicar Oportunidade'}
                    </button>
                </div>

            </form>
        </div>
    )
}
