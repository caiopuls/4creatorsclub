'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void
    maxFiles?: number
    initialImages?: string[]
}

export function ImageUpload({ onUploadComplete, maxFiles = 5, initialImages = [] }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [previews, setPreviews] = useState<string[]>(initialImages)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setPreviews(initialImages)
        }
    }, [initialImages])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        if (previews.length + files.length > maxFiles) {
            alert(`Máximo de ${maxFiles} imagens permitidas.`)
            return
        }

        setUploading(true)
        const uploadedUrls: string[] = []
        const newPreviews: string[] = []

        try {
            for (const file of files) {
                // Create preview immediately
                const objectUrl = URL.createObjectURL(file)
                newPreviews.push(objectUrl)

                // Upload to Supabase
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('portfolio') // Make sure this bucket exists!
                    .upload(filePath, file)

                if (uploadError) {
                    throw uploadError
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath)

                uploadedUrls.push(publicUrl)
            }

            setPreviews(prev => [...prev, ...newPreviews])
            onUploadComplete(uploadedUrls)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Erro ao fazer upload da imagem.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    ) : (
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                            <Upload size={20} />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-white">Clique para fazer upload</p>
                        <p className="text-sm text-zinc-500">JPG, PNG ou WEBP (Max {maxFiles} fotos)</p>
                    </div>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            {/* Note: Real removal logic would need to handle removing from 'uploadedUrls' too, which is complex with just onUploadComplete. 
                                For MVP, we just append. Advanced version would manage full state here. 
                            */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
