'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Instagram, Youtube, Twitter, Facebook, Linkedin, HelpCircle, DollarSign, Image as ImageIcon, PlusCircle, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NICHES = [
    "Tecnologia", "Lifestyle", "Beleza", "Moda", "Fitness", "Saúde", "Negócios", "Finanças",
    "Educação", "Entretenimento", "Humor", "Games", "Viagens", "Gastronomia", "Decoração",
    "Maternidade", "Pets", "Carros", "Esportes", "Música", "Arte & Design", "Fotografia"
]

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'tiktok', label: 'TikTok', icon: ({ size }: { size: number }) => <span style={{ fontSize: size, fontWeight: 'bold' }}>Tk</span> },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
]

export default function NewMediaKitPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [pdfFile, setPdfFile] = useState<File | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        pitch: '',
        niche: '',
        location: '',
        media_kit_pdf: '',
    })

    const [socials, setSocials] = useState([
        { platform: 'instagram', handle: '', followers: '', engagement: '' }
    ])

    const [rates, setRates] = useState([
        { title: 'Combo 3 Stories', description: 'Sequência narrativa', price: '' },
        { title: 'Reels (60s)', description: 'Video curto vertical - Collab', price: '' }
    ])

    const handleAddSocial = () => {
        if (socials.length < 5) {
            setSocials([...socials, { platform: 'instagram', handle: '', followers: '', engagement: '' }])
        }
    }

    const handleRemoveSocial = (index: number) => {
        setSocials(socials.filter((_, i) => i !== index))
    }

    const handleAddRate = () => {
        setRates([...rates, { title: '', description: '', price: '' }])
    }

    const handleRemoveRate = (index: number) => {
        setRates(rates.filter((_, i) => i !== index))
    }

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setPdfFile(null)
            return
        }
        setPdfFile(e.target.files[0])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Upload PDF if exists
            let pdfUrl = ''
            if (pdfFile) {
                setUploading(true)
                const fileExt = pdfFile.name.split('.').pop()
                const fileName = `${user.id}-${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('media-kits')
                    .upload(fileName, pdfFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('media-kits')
                    .getPublicUrl(fileName)

                pdfUrl = publicUrl
                setUploading(false)
            }

            // Calculate derived stats for the main card (simplified logic)
            const mainFollowers = socials[0]?.followers || '0'
            const mainEngagement = socials[0]?.engagement || '0%'
            const startPrice = rates[0]?.price ? `R$ ${rates[0].price}` : 'Sob Consulta'

            // 2. Create Creator Profile
            const { data: creator, error: creatorError } = await supabase
                .from('creators')
                .insert({
                    user_id: user.id,
                    name: formData.name, // Ideally fetch this from user profile? Using input for now
                    niche: formData.niche,
                    location: formData.location,
                    pitch: formData.pitch,
                    media_kit_pdf: pdfUrl,
                    total_followers: mainFollowers,
                    avg_engagement: mainEngagement,
                    start_price: startPrice
                })
                .select()
                .single()

            if (creatorError) throw creatorError

            // 3. Insert Socials
            if (socials.length > 0) {
                const { error: socialsError } = await supabase
                    .from('creator_socials')
                    .insert(socials.map(s => ({
                        creator_id: creator.id,
                        platform: s.platform,
                        handle: s.handle,
                        followers: s.followers,
                        engagement: s.engagement
                    })))
                if (socialsError) throw socialsError
            }

            // 4. Insert Rates
            if (rates.length > 0) {
                const { error: ratesError } = await supabase
                    .from('creator_rates')
                    .insert(rates.map(r => ({
                        creator_id: creator.id,
                        title: r.title,
                        description: r.description,
                        price: r.price
                    })))
                if (ratesError) throw ratesError
            }

            router.push('/dashboard/creators')

        } catch (error) {
            console.error('Error creating media kit:', error)
            alert('Erro ao criar mídia kit. Tente novamente.')
        } finally {
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] pb-20">
            <div className="max-w-3xl mx-auto px-4 pt-8">
                <Link href="/dashboard/creators" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
                    <ArrowLeft size={16} />
                    Voltar para o Marketplace
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Configure seu Mídia Kit</h1>
                        <p className="text-zinc-400">Essas informações ficarão visíveis para marcas e founders.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info */}
                    <section className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-sm">1</span>
                            Sobre Você
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome Público</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#151515] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Como você quer ser chamado"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Bio Curta (Pitch)</label>
                                <textarea
                                    rows={3}
                                    required
                                    className="w-full bg-[#151515] border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Ex: Especialista em reviews de tecnologia com foco em produtividade..."
                                    value={formData.pitch}
                                    onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Nicho Principal</label>
                                    <select
                                        required
                                        className="w-full bg-[#151515] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.niche}
                                        onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        {NICHES.map(niche => (
                                            <option key={niche} value={niche}>{niche}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Localização</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#151515] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Cidade, UF"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Mídia Kit (PDF)</label>
                                <div className="border border-dashed border-zinc-800 bg-[#151515] rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:border-blue-500/50 hover:bg-[#1a1a1a] transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handlePdfUpload}
                                    />
                                    <Upload size={32} className={`mb-3 ${pdfFile ? 'text-blue-500' : 'text-zinc-600'}`} />
                                    {pdfFile ? (
                                        <span className="text-blue-400 font-medium">{pdfFile.name}</span>
                                    ) : (
                                        <>
                                            <span className="font-medium text-zinc-400">Clique para fazer upload do PDF</span>
                                            <span className="text-xs mt-1">Recomendado até 10MB</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Metrics */}
                    <section className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 text-sm">2</span>
                            Métricas & Redes
                        </h2>

                        <div className="space-y-6">
                            {socials.map((social, idx) => (
                                <div key={idx} className="p-4 bg-[#151515] rounded-xl border border-zinc-800 relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSocial(idx)}
                                            className="text-zinc-500 hover:text-red-500 p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs text-zinc-500 mb-1 block">Plataforma</label>
                                            <select
                                                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm"
                                                value={social.platform}
                                                onChange={(e) => {
                                                    const newSocials = [...socials]
                                                    newSocials[idx].platform = e.target.value
                                                    setSocials(newSocials)
                                                }}
                                            >
                                                {SOCIAL_PLATFORMS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 mb-1 block">Usuário/Handle</label>
                                            <input
                                                type="text"
                                                placeholder="@usuario"
                                                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm"
                                                value={social.handle}
                                                onChange={(e) => {
                                                    const newSocials = [...socials]
                                                    newSocials[idx].handle = e.target.value
                                                    setSocials(newSocials)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-zinc-500 mb-1 block">Seguidores</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: 100k"
                                                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm"
                                                value={social.followers}
                                                onChange={(e) => {
                                                    const newSocials = [...socials]
                                                    newSocials[idx].followers = e.target.value
                                                    setSocials(newSocials)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 mb-1 block">Engajamento</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: 4.5%"
                                                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm"
                                                value={social.engagement}
                                                onChange={(e) => {
                                                    const newSocials = [...socials]
                                                    newSocials[idx].engagement = e.target.value
                                                    setSocials(newSocials)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {socials.length < 5 && (
                                <button
                                    type="button"
                                    onClick={handleAddSocial}
                                    className="w-full p-4 bg-[#151515] rounded-xl border border-zinc-800 border-dashed flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-900 transition-colors"
                                >
                                    <PlusCircle size={20} />
                                    <span className="text-sm">Adicionar Outra Rede</span>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm">3</span>
                            Tabela de Preços
                        </h2>

                        <div className="space-y-4">
                            {rates.map((rate, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-[#151515] rounded-xl border border-zinc-800 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRate(idx)}
                                            className="text-zinc-500 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-2 md:mt-0">
                                        <DollarSign size={18} />
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Nome do Formato (Ex: Reels)"
                                            className="w-full bg-transparent border-none p-0 text-white font-bold placeholder:text-zinc-600 focus:ring-0"
                                            value={rate.title}
                                            onChange={(e) => {
                                                const newRates = [...rates]
                                                newRates[idx].title = e.target.value
                                                setRates(newRates)
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Descrição (Ex: Vídeo até 60s)"
                                            className="w-full bg-transparent border-none p-0 text-xs text-zinc-500 placeholder:text-zinc-700 focus:ring-0"
                                            value={rate.description}
                                            onChange={(e) => {
                                                const newRates = [...rates]
                                                newRates[idx].description = e.target.value
                                                setRates(newRates)
                                            }}
                                        />
                                    </div>
                                    <div className="relative w-full md:w-32 shrink-0">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                                        <input
                                            type="text"
                                            className="w-full bg-black border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-white font-bold text-right"
                                            placeholder="0,00"
                                            value={rate.price}
                                            onChange={(e) => {
                                                const newRates = [...rates]
                                                newRates[idx].price = e.target.value
                                                setRates(newRates)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddRate}
                                className="w-full p-4 bg-[#151515] rounded-xl border border-zinc-800 border-dashed flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-900 transition-colors"
                            >
                                <PlusCircle size={16} />
                                <span className="text-sm font-bold">Adicionar Formato Personalizado</span>
                            </button>
                        </div>
                    </section>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {!loading ? <Save size={20} /> : <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {uploading ? 'Enviando PDF...' : loading ? 'Salvando...' : 'Publicar Mídia Kit'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
