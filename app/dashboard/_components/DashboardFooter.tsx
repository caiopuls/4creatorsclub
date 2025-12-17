import Link from 'next/link'

export function DashboardFooter() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-black py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-zinc-500 text-sm">
                    © {new Date().getFullYear()} 4Creators Club. Todos os direitos reservados.
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        href="/termos-de-uso"
                        target="_blank"
                        className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                        Termos de Uso
                    </Link>
                    <Link
                        href="/politica-de-privacidade"
                        target="_blank"
                        className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                        Política de Privacidade
                    </Link>
                    <Link
                        href="https://wa.me/5551992615201"
                        target="_blank"
                        className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                        Suporte
                    </Link>
                </div>
            </div>
        </footer>
    )
}
