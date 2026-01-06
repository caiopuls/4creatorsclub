'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, Briefcase, LayoutGrid, LogOut, Home, User, Menu, Settings, X, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Notifications } from './Notifications'

export function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { label: 'Início', href: '/dashboard', icon: Home },
        { label: 'Startups', href: '/dashboard/startups', icon: Rocket },
        { label: 'Serviços', href: '/dashboard/jobs', icon: Briefcase },
        { label: 'Creators', href: '/dashboard/creators', icon: Users },
        { label: 'Meus Projetos', href: '/dashboard/my-assets', icon: LayoutGrid },
    ]

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img
                            src="https://i.ibb.co/7djtqYqZ/logo-1.png"
                            alt="4Creators Club"
                            className="h-8 w-auto"
                            loading="lazy"
                            decoding="async"
                        />

                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isActive
                                        ? 'bg-zinc-800 text-white'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Right Side */}
                <div className="flex cursor-pointer items-center gap-4">
                    <Notifications />

                    <div className="h-8 w-px bg-zinc-800 hidden md:block" />

                    <div
                        className="relative hidden md:block"
                        onMouseEnter={() => setIsProfileOpen(true)}
                        onMouseLeave={() => setIsProfileOpen(false)}
                    >
                        <button
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="h-8 cursor-pointer w-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                                <User size={16} />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden transition-all z-50 ${isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <Link
                                href="/dashboard/profile/edit"
                                className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <Settings size={16} />
                                Editar Perfil
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors border-t border-zinc-800"
                            >
                                <LogOut size={16} />
                                Sair
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-zinc-950/95 backdrop-blur-sm p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-10 duration-200 md:hidden">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`p-4 rounded-xl text-lg font-bold transition-all flex items-center gap-3 ${isActive
                                        ? 'bg-zinc-800 text-white shadow-lg'
                                        : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={24} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="h-px w-full bg-zinc-800 my-2" />

                    <div className="flex flex-col gap-2">
                        <Link
                            href="/dashboard/profile/edit"
                            className="p-4 rounded-xl text-lg font-bold bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900 hover:text-white flex items-center gap-3 transition-all"
                        >
                            <Settings size={24} />
                            Editar Perfil
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="p-4 rounded-xl text-lg font-bold bg-red-900/10 text-red-400 hover:bg-red-900/20 flex items-center gap-3 transition-all border border-red-900/20"
                        >
                            <LogOut size={24} />
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
