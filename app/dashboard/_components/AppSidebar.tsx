'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, Briefcase, PlusCircle, User, LayoutGrid, LogOut, Home, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const items = [
    {
        title: 'Início',
        url: '/dashboard',
        icon: Home,
    },
    {
        title: 'Jobs',
        url: '/dashboard/jobs',
        icon: Briefcase,
    },
    {
        title: 'Startups',
        url: '/dashboard/startups',
        icon: Rocket,
    },
    {
        title: 'Meus Projetos',
        url: '/dashboard/my-assets',
        icon: LayoutGrid,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden md:flex flex-col bg-black border-r border-zinc-900">
            <div className="h-16 flex items-center px-6 border-b border-zinc-900">
                <span className="text-xl font-bold tracking-tighter text-white">4C Jobs</span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.url || (item.url !== '/jobs' && pathname.startsWith(item.url))

                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-white text-black'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.title}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-zinc-900">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 w-full rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </div>
        </aside>
    )
}
