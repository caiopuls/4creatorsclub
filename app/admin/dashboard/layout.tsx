import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#090909] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col fixed h-full bg-[#0c0c0c]">
                {/* Logo */}
                <div className="mb-10">
                    <span className="text-xl font-extrabold tracking-tight">4C <span className="text-[#666]">Admin</span></span>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Overview</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/applications"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors"
                    >
                        <FileText size={20} />
                        <span className="font-medium">Aplicações</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors"
                    >
                        <Users size={20} />
                        <span className="font-medium">Usuários</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/config"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Configurações</span>
                    </Link>
                </nav>

                {/* Footer */}
                <div className="pt-6 border-t border-[#1a1a1a]">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-900/10 text-[#888] hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
