'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastType = 'success' | 'error'

interface ToastProps {
    message: string
    type?: ToastType
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border backdrop-blur-md ${type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-200'
                            : 'bg-red-500/10 border-red-500/20 text-red-200'
                        }`}
                >
                    {type === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    <span className="font-medium text-lg">{message}</span>
                    <button onClick={onClose} className="ml-4 hover:opacity-70">
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
