import { Header } from './_components/Header'

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
            <Header />
            <main className="min-h-[calc(100vh-64px)] w-full">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
