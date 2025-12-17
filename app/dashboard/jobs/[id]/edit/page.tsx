'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { ImageUpload } from '../../../_components/ImageUpload'
import {
    ArrowLeft, Loader2, DollarSign, Calendar, Type, Tag, Signal,
    Briefcase, AlignLeft, Clock, Image as ImageIcon, Box, List, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { Toast } from '../../../_components/Toast'

export default function EditJobPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()
    const jobId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showToast, setShowToast] = useState(false)

    // Job Data State
    const [job, setJob] = useState<any>(null)

    // Form State (Unified/Split)
    // Freelancing States
    const [mode, setMode] = useState<'single' | 'plans'>('single')
    const [freelanceData, setFreelanceData] = useState({
        title: '',
        description: '',
        job_type: 'design',
        level: '0-1',
        images: [] as string[]
    })
    const [singleData, setSingleData] = useState({
        format: 'project',
        value: '',
        deadline_type: 'date',
        deadline: '',
        duration_number: '',
        duration_unit: 'dias'
    })
    // Plans
    type Plan = {
        id: string
        title: string
        price: string
        description: string
        delivery_number: string
        delivery_unit: string
        topics: string[]
    }
    const [plans, setPlans] = useState<Plan[]>([])

    // Hiring State
    const [hiringData, setHiringData] = useState({
        title: '',
        description: '',
        job_type: 'design',
        level: '0-1',
        format: 'one-off',
        deadline_type: 'date',
        duration_text: '',
        value_min: '',
        value_max: '',
        deadline: '',
        images: [] as string[]
    })

    // --- UTILS ---
    const formatCurrency = (val: number | null) => {
        if (!val) return ''
        return val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    }
    const parseCurrency = (value: string) => {
        return value ? parseFloat(value.replace(/[^\d,]/g, '').replace('.', '').replace(',', '.')) : 0
    }
    const handleCurrencyChange = (val: string, setter: any, field: string) => {
        if (val === '') {
            setter((prev: any) => ({ ...prev, [field]: '' }))
            return
        }
        const clean = val.replace(/\D/g, '')
        const formatted = (parseInt(clean) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        setter((prev: any) => ({ ...prev, [field]: formatted }))
    }

    // --- FETCH DATA ---
    useEffect(() => {
        async function fetchJob() {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('id', jobId)
                    .single()

                if (error) throw error

                // Security Check
                const { data: { user } } = await supabase.auth.getUser()
                if (!user || data.owner_id !== user.id) {
                    router.push('/dashboard')
                    return
                }

                setJob(data)

                // Populate State based on type
                if (data.listing_type === 'freelancing') {
                    setFreelanceData({
                        title: data.title,
                        description: data.description,
                        job_type: data.job_type,
                        level: data.level,
                        images: data.images || []
                    })

                    if (data.plans && data.plans.length > 0) {
                        setMode('plans')
                        setPlans(data.plans.map((p: any) => ({
                            id: Math.random().toString(36).substr(2, 9),
                            title: p.title,
                            price: formatCurrency(p.price),
                            description: p.description,
                            delivery_number: p.delivery?.split(' ')[0] || '',
                            delivery_unit: p.delivery?.split(' ')[1] || 'dias',
                            topics: p.topics || []
                        })))
                    } else {
                        setMode('single')
                        setSingleData({
                            format: data.format,
                            value: formatCurrency(data.value_min), // assuming fixed price means min=max
                            deadline_type: data.deadline_type,
                            deadline: data.deadline ? data.deadline.split('T')[0] : '',
                            duration_number: data.duration_text ? data.duration_text.split(' ')[0] : '',
                            duration_unit: data.duration_text ? data.duration_text.split(' ')[1] : 'dias'
                        })
                    }
                } else {
                    // Hiring
                    setHiringData({
                        title: data.title,
                        description: data.description,
                        job_type: data.job_type,
                        level: data.level,
                        format: data.format,
                        deadline_type: data.deadline_type,
                        duration_text: data.duration_text || '',
                        value_min: formatCurrency(data.value_min),
                        value_max: formatCurrency(data.value_max),
                        deadline: data.deadline ? data.deadline.split('T')[0] : '',
                        images: data.images || []
                    })
                }

                setLoading(false)
            } catch (err) {
                console.error(err)
                setError('Erro ao carregar job')
                setLoading(false)
            }
        }
        fetchJob()
    }, [jobId])


    // --- HANDLERS (Freelancing) ---
    // Plans Handlers
    const addPlan = () => setPlans(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), title: '', price: '', description: '', delivery_number: '', delivery_unit: 'dias', topics: [''] }])
    const removePlan = (index: number) => setPlans(prev => prev.filter((_, i) => i !== index))
    const updatePlan = (index: number, field: keyof Plan, value: any) => setPlans(prev => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n })
    const updateTopic = (pIdx: number, tIdx: number, val: string) => setPlans(prev => { const n = [...prev]; n[pIdx].topics[tIdx] = val; return n })
    const addTopic = (pIdx: number) => setPlans(prev => { const n = [...prev]; n[pIdx].topics.push(''); return n })
    const removeTopic = (pIdx: number, tIdx: number) => setPlans(prev => { const n = [...prev]; n[pIdx].topics = n[pIdx].topics.filter((_, i) => i !== tIdx); return n })

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            let payload: any = {}

            if (job.listing_type === 'freelancing') {
                payload = {
                    title: freelanceData.title,
                    description: freelanceData.description,
                    job_type: freelanceData.job_type,
                    level: freelanceData.level,
                    images: freelanceData.images
                }

                if (mode === 'single') {
                    const price = parseCurrency(singleData.value)
                    if (!price) throw new Error('Valor inválido')

                    let finalDeadline = null
                    let finalDurationText = ''
                    if (singleData.deadline_type === 'date') finalDeadline = new Date(singleData.deadline).toISOString()
                    else if (singleData.deadline_type === 'duration') finalDurationText = `${singleData.duration_number} ${singleData.duration_unit}`

                    payload = { ...payload, format: singleData.format, value_min: price, value_max: price, is_fixed_price: true, deadline: finalDeadline, deadline_type: singleData.deadline_type, duration_text: finalDurationText, plans: [] } // Clear plans if single
                } else {
                    // Plans validation
                    if (plans.length === 0) throw new Error('Adicione um plano')
                    let minPrice = Infinity
                    const formattedPlans = plans.map(p => {
                        const price = parseCurrency(p.price)
                        if (price < minPrice) minPrice = price
                        return {
                            title: p.title,
                            price: price,
                            description: p.description,
                            delivery: `${p.delivery_number} ${p.delivery_unit}`,
                            topics: p.topics.filter(t => t.trim() !== '')
                        }
                    })
                    payload = { ...payload, format: 'project', value_min: minPrice, value_max: minPrice, deadline_type: 'duration', plans: formattedPlans }
                }
            } else {
                // Hiring
                const min = parseCurrency(hiringData.value_min)
                const max = parseCurrency(hiringData.value_max)
                let finalDeadline = null
                if (hiringData.deadline_type === 'date' && hiringData.deadline) finalDeadline = new Date(hiringData.deadline).toISOString()

                payload = {
                    title: hiringData.title,
                    description: hiringData.description,
                    job_type: hiringData.job_type,
                    level: hiringData.level,
                    format: hiringData.format,
                    value_min: min,
                    value_max: max,
                    is_fixed_price: !!(min && !max) || (!!min && !!max && min === max),
                    deadline: finalDeadline,
                    deadline_type: hiringData.deadline_type,
                    duration_text: hiringData.duration_text,
                    images: hiringData.images
                }
            }

            const { error: updateError } = await supabase.from('jobs').update(payload).eq('id', jobId)
            if (updateError) throw updateError

            setShowToast(true)
            setTimeout(() => {
                router.back()
                router.refresh()
            }, 1000)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro ao salvar')
        } finally {
            setSaving(false)
        }
    }


    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>

    if (!job) return <div className="text-white">Job não encontrado</div>

    const isFreelancing = job.listing_type === 'freelancing'

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Toast message="Alterações salvas!" isVisible={showToast} onClose={() => setShowToast(false)} />

            <Link href="/dashboard/my-assets" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
                <ArrowLeft size={16} className="mr-2" /> Voltar
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Editar {isFreelancing ? 'Serviço' : 'Vaga'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* --- FREELANCING FORM --- */}
                {isFreelancing && (
                    <>
                        <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 space-y-6">
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Título</label>
                                <input value={freelanceData.title} onChange={e => setFreelanceData(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-zinc-300 text-sm font-medium mb-1 block">Categoria</label>
                                    <select value={freelanceData.job_type} onChange={e => setFreelanceData(p => ({ ...p, job_type: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                        <option value="design">Design</option>
                                        <option value="dev">Desenvolvimento</option>
                                        <option value="traffic">Tráfego</option>
                                        <option value="copy">Copywriting</option>
                                        <option value="social">Social Media</option>
                                        <option value="other">Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-zinc-300 text-sm font-medium mb-1 block">Experiência</label>
                                    <select value={freelanceData.level} onChange={e => setFreelanceData(p => ({ ...p, level: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                        <option value="0-1">0 a 1 ano</option>
                                        <option value="1-3">1 a 3 anos</option>
                                        <option value="3-5">3 a 5 anos</option>
                                        <option value="5+">Mais de 5 anos</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Descrição</label>
                                <textarea value={freelanceData.description} onChange={e => setFreelanceData(p => ({ ...p, description: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white h-32 resize-none" required />
                            </div>
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Imagens</label>
                                <ImageUpload onUploadComplete={urls => setFreelanceData(p => ({ ...p, images: [...p.images, ...urls] }))} maxFiles={3} />
                            </div>
                        </div>

                        <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
                            <button type="button" onClick={() => setMode('single')} className={`px-6 py-2 rounded-lg text-sm font-medium transition ${mode === 'single' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Projeto Único</button>
                            <button type="button" onClick={() => setMode('plans')} className={`px-6 py-2 rounded-lg text-sm font-medium transition ${mode === 'plans' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Planos</button>
                        </div>

                        {mode === 'single' && (
                            <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-zinc-300 text-sm font-medium mb-1 block">Modelo</label>
                                        <select value={singleData.format} onChange={e => setSingleData(p => ({ ...p, format: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                            <option value="project">Por Projeto</option>
                                            <option value="hourly">Por Hora</option>
                                            <option value="monthly">Mensal</option>
                                            <option value="yearly">Anual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-zinc-300 text-sm font-medium mb-1 block">Valor (R$)</label>
                                        <input value={singleData.value} onChange={e => handleCurrencyChange(e.target.value, setSingleData, 'value')} placeholder="0,00" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-zinc-300 text-sm font-medium mb-1 block">Tipo de Prazo</label>
                                        <select value={singleData.deadline_type} onChange={e => setSingleData(p => ({ ...p, deadline_type: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                            <option value="date">Data</option>
                                            <option value="duration">Duração</option>
                                            <option value="flexible">Flexível</option>
                                        </select>
                                    </div>
                                    {singleData.deadline_type === 'date' && (
                                        <input type="date" value={singleData.deadline} onChange={e => setSingleData(p => ({ ...p, deadline: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white [&::-webkit-calendar-picker-indicator]:invert" />
                                    )}
                                    {singleData.deadline_type === 'duration' && (
                                        <div className="flex gap-2">
                                            <input value={singleData.duration_number} onChange={e => setSingleData(p => ({ ...p, duration_number: e.target.value }))} placeholder="7" className="w-20 bg-black border border-zinc-800 rounded-lg p-3 text-white" />
                                            <select value={singleData.duration_unit} onChange={e => setSingleData(p => ({ ...p, duration_unit: e.target.value }))} className="flex-1 bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                                <option value="dias">Dias</option>
                                                <option value="semanas">Semanas</option>
                                                <option value="meses">Meses</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {mode === 'plans' && (
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <h3 className="text-white font-bold">Planos</h3>
                                    <button type="button" onClick={addPlan} className="text-blue-400 text-sm">+ Adicionar</button>
                                </div>
                                {plans.map((plan, idx) => (
                                    <div key={plan.id} className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4 relative">
                                        <button type="button" onClick={() => removePlan(idx)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400">Remover</button>
                                        <input value={plan.title} onChange={e => updatePlan(idx, 'title', e.target.value)} placeholder="Nome do Pacote" className="bg-transparent border-b border-zinc-700 text-white font-bold w-full outline-none pb-2 text-lg" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={plan.price} onChange={e => {
                                                const val = e.target.value;
                                                if (val === '') updatePlan(idx, 'price', '');
                                                else {
                                                    const clean = val.replace(/\D/g, '')
                                                    const formatted = (parseInt(clean) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                                    updatePlan(idx, 'price', formatted)
                                                }
                                            }} placeholder="R$ 0,00" className="bg-black border border-zinc-800 rounded p-2 text-white" />
                                            <div className="flex gap-1">
                                                <input value={plan.delivery_number} onChange={e => updatePlan(idx, 'delivery_number', e.target.value)} placeholder="Prazo" className="bg-black border border-zinc-800 rounded p-2 text-white w-20" />
                                                <select value={plan.delivery_unit} onChange={e => updatePlan(idx, 'delivery_unit', e.target.value)} className="bg-black border border-zinc-800 rounded p-2 text-white flex-1">
                                                    <option value="dias">Dias</option>
                                                    <option value="semanas">Semanas</option>
                                                </select>
                                            </div>
                                        </div>
                                        <textarea value={plan.description} onChange={e => updatePlan(idx, 'description', e.target.value)} placeholder="Descrição" className="w-full bg-black border border-zinc-800 rounded p-2 text-white" />
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-2">ITENS INCLUSOS</p>
                                            {plan.topics.map((topic, tIdx) => (
                                                <div key={tIdx} className="flex gap-2 mb-2">
                                                    <input value={topic} onChange={e => updateTopic(idx, tIdx, e.target.value)} className="flex-1 bg-black/50 border border-zinc-800 rounded p-1 text-white text-sm" />
                                                    <button type="button" onClick={() => removeTopic(idx, tIdx)} className="text-zinc-500">×</button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addTopic(idx)} className="text-xs text-blue-400">+ Item</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* --- HIRING FORM --- */}
                {!isFreelancing && (
                    <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 space-y-6">
                        <div>
                            <label className="text-zinc-300 text-sm font-medium mb-1 block">Título da Vaga</label>
                            <input value={hiringData.title} onChange={e => setHiringData(p => ({ ...p, title: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Categoria</label>
                                <select value={hiringData.job_type} onChange={e => setHiringData(p => ({ ...p, job_type: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                    <option value="design">Design</option>
                                    <option value="dev">Desenvolvimento</option>
                                    <option value="traffic">Tráfego</option>
                                    <option value="copy">Copywriting</option>
                                    <option value="social">Social Media</option>
                                    <option value="other">Outros</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Nível</label>
                                <select value={hiringData.level} onChange={e => setHiringData(p => ({ ...p, level: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                    <option value="0-1">0 a 1 ano</option>
                                    <option value="1-3">1 a 3 anos</option>
                                    <option value="3-5">3 a 5 anos</option>
                                    <option value="5+">Mais de 5 anos</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-zinc-300 text-sm font-medium mb-1 block">Descrição</label>
                            <textarea value={hiringData.description} onChange={e => setHiringData(p => ({ ...p, description: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white h-32 resize-none" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Formato</label>
                                <select value={hiringData.format} onChange={e => setHiringData(p => ({ ...p, format: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white">
                                    <option value="fixed">Preço Fixo</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="one-off">Pontual</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Prazo / Duração</label>
                                <select value={hiringData.deadline_type} onChange={e => setHiringData(p => ({ ...p, deadline_type: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white mb-2">
                                    <option value="date">Data Limite</option>
                                    <option value="duration">Duração</option>
                                    <option value="flexible">Flexível</option>
                                </select>
                                {hiringData.deadline_type === 'date' && (
                                    <input type="date" value={hiringData.deadline} onChange={e => setHiringData(p => ({ ...p, deadline: e.target.value }))} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white [&::-webkit-calendar-picker-indicator]:invert" />
                                )}
                                {hiringData.deadline_type === 'duration' && (
                                    <input value={hiringData.duration_text} onChange={e => setHiringData(p => ({ ...p, duration_text: e.target.value }))} placeholder="Ex: 2 semanas" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Valor Mín (R$)</label>
                                <input value={hiringData.value_min} onChange={e => handleCurrencyChange(e.target.value, setHiringData, 'value_min')} placeholder="0,00" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" />
                            </div>
                            <div>
                                <label className="text-zinc-300 text-sm font-medium mb-1 block">Valor Máx (R$)</label>
                                <input value={hiringData.value_max} onChange={e => handleCurrencyChange(e.target.value, setHiringData, 'value_max')} placeholder="Opcional" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" />
                            </div>
                        </div>
                    </div>
                )}


                <button type="submit" disabled={saving} className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="animate-spin" /> : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    )
}
