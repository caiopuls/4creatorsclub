import { Header } from './_components/Header'
import { DashboardFooter } from './_components/DashboardFooter'

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans flex flex-col">
            <Header />
            <main className="w-full flex-1">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
            <DashboardFooter />
        </div>
    )
}
