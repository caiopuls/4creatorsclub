'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'

interface Notification {
    id: string
    type: 'application' | 'interest'
    title: string
    message: string
    created_at: string
    link: string
    read: boolean
}

export function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchNotifications() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch Applications for MY jobs
            const { data: jobApps } = await supabase
                .from('applications')
                .select(`
                    id, 
                    created_at, 
                    jobs!inner(title, owner_id),
                    applicant:profiles!applicant_id(full_name)
                `)
                .eq('jobs.owner_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            // 2. Fetch Interests for MY startups
            const { data: startupInterests } = await supabase
                .from('startup_interests')
                .select(`
                    id, 
                    created_at, 
                    message,
                    startups!inner(title, owner_id),
                    interested:profiles!interested_profile_id(full_name)
                `)
                .eq('startups.owner_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            // Normalize
            const normalizedApps: Notification[] = (jobApps || []).map((app: any) => ({
                id: app.id, // Using app ID as notif ID for now
                type: 'application',
                title: 'Nova Candidatura',
                message: `${app.applicant?.full_name} aplicou para "${app.jobs?.title}"`,
                created_at: app.created_at,
                link: '/dashboard/my-assets',
                read: false
            }))

            const normalizedInterests: Notification[] = (startupInterests || []).map((int: any) => ({
                id: int.id,
                type: 'interest',
                title: 'Novo Interesse',
                message: `${int.interested?.full_name} tem interesse em "${int.startups?.title}"`,
                created_at: int.created_at,
                link: `/dashboard/startups/${int.startups?.id}`, // Or a specific dashboard for interests
                read: false
            }))

            const all = [...normalizedApps, ...normalizedInterests].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            setNotifications(all)
            setUnreadCount(all.length) // Simplification: assume all fetched are "recent/unread" for this demo
        }

        fetchNotifications()

        // Close on click outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)

    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-white">Notificações</h3>
                        <span className="text-xs text-zinc-500">{unreadCount} novas</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif, i) => (
                                <Link
                                    key={`${notif.id}-${i}`}
                                    href={notif.link}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 hover:bg-zinc-800/50 transition-colors border-b border-zinc-900 last:border-0"
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'application' ? 'bg-blue-500' : 'bg-emerald-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm text-zinc-200 font-medium mb-0.5">{notif.title}</p>
                                            <p className="text-xs text-zinc-400 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-zinc-600 mt-1">
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                                Nenhuma notificação recente.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
