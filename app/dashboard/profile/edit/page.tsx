'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, User, Building2, Upload, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ImageUpload } from '../../_components/ImageUpload'

export default function EditProfilePage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        role: '',
        profile_type: 'freelancer', // freelancer | agency
        cnpj: '',
        company_name: '',
        years_experience: '',
        avatar_url: ''
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error

            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    bio: profile.bio || '',
                    role: profile.role || '',
                    profile_type: profile.profile_type || 'freelancer',
                    cnpj: profile.cnpj || '',
                    company_name: profile.company_name || '',
                    years_experience: profile.years_experience ? String(profile.years_experience) : '',
                    avatar_url: profile.avatar_url || ''
                })
            }
        } catch (error) {
            console.error('Error loading profile:', error)
            setMessage({ type: 'error', text: 'Erro ao carregar perfil.' })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const updates = {
                id: user.id,
                full_name: formData.full_name,
                bio: formData.bio,
                role: formData.role,
                profile_type: formData.profile_type,
                cnpj: formData.profile_type === 'agency' ? formData.cnpj : null,
                company_name: formData.profile_type === 'agency' ? formData.company_name : null,
                years_experience: formData.profile_type === 'freelancer' && formData.years_experience ? parseInt(formData.years_experience) : null,
                avatar_url: formData.avatar_url,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
            router.refresh()
            // Optional: redirect to view profile ??
        } catch (error: any) {
            console.error(error)
            setMessage({ type: 'error', text: error.message || 'Erro ao salvar perfil.' })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Editar Perfil</h1>
                <p className="text-zinc-400">Mantenha suas informações atualizadas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 py-4 border-b border-zinc-800 pb-8">
                    <div className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center relative group">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <User size={32} className="text-zinc-500" />
                        )}
                        <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center transition-all">
                            {/* Just visual overlay, actual upload is below */}
                            <Upload size={20} className="text-white opactiy-80" />
                        </div>
                    </div>
                    <div className="w-full max-w-xs">
                        <div className="text-sm text-zinc-400 text-center mb-2">Alterar Foto de Perfil</div>
                        {/* Reusing ImageUpload but capping at 1 file and handling it specifically */}
                        <ImageUpload
                            maxFiles={1}
                            onUploadComplete={(urls) => {
                                if (urls.length > 0) {
                                    setFormData(prev => ({ ...prev, avatar_url: urls[0] }))
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Account Type */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-zinc-300">Tipo de Perfil</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, profile_type: 'freelancer' }))}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${formData.profile_type === 'freelancer'
                                    ? 'bg-zinc-800 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            <User size={20} />
                            <div className="text-left">
                                <div className="font-medium">Freelancer</div>
                                <div className="text-xs opacity-70">Pessoa Física</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, profile_type: 'agency' }))}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${formData.profile_type === 'agency'
                                    ? 'bg-zinc-800 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            <Building2 size={20} />
                            <div className="text-left">
                                <div className="font-medium">Agência</div>
                                <div className="text-xs opacity-70">Pessoa Jurídica</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Conditional Fields */}
                <div className="grid gap-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-1 block">Nome Completo</label>
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-1 block">Cargo / Especialidade</label>
                        <input
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                            placeholder="Ex: Designer UI, Agência de Marketing..."
                        />
                    </div>

                    {formData.profile_type === 'agency' && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-1 block">Nome da Empresa / Razão Social</label>
                                <input
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                    placeholder="Nome da sua agência"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-1 block">CNPJ</label>
                                <input
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                        </>
                    )}

                    {formData.profile_type === 'freelancer' && (
                        <div>
                            <label className="text-sm font-medium text-zinc-300 mb-1 block">Anos de Experiência</label>
                            <input
                                name="years_experience"
                                type="number"
                                value={formData.years_experience}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none"
                                placeholder="Quantos anos de mercado?"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-1 block">Bio / Sobre</label>
                        <textarea
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none resize-none"
                            placeholder="Conte um pouco sobre você..."
                        />
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-200' : 'bg-red-900/20 border-red-800 text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : 'Salvar Alterações'}
                    </button>
                </div>

            </form>
        </div>
    )
}
