'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface ImageCarouselProps {
    images: string[] | null | undefined
    alt: string
    className?: string
}

export function ImageCarousel({ images, alt, className = "aspect-video" }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // No images? Show placeholder
    if (!images || images.length === 0) {
        return (
            <div className={`bg-zinc-800 flex items-center justify-center text-zinc-600 ${className} rounded-t-xl overflow-hidden`}>
                <ImageIcon size={32} />
            </div>
        )
    }

    // Single image? Show it static
    if (images.length === 1) {
        return (
            <div className={`relative ${className} rounded-t-xl overflow-hidden`}>
                <img
                    src={images[0]}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        )
    }

    // Multiple images? Carousel logic
    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // Dots navigation
    const goToIndex = (idx: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex(idx)
    }

    return (
        <div className={`relative group ${className} rounded-t-xl overflow-hidden bg-black`}>

            <img
                src={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Gradient Overlay for Dots */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Controls */}
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
                <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => goToIndex(i, e)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
