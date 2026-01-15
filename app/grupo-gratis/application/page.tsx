"use client";

import ApplicationForm from "../../components/ApplicationForm";
import Link from "next/link";

export default function GrupoGratisApplicationPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
            </div>

            <nav className="p-6 relative z-10 flex justify-center border-b border-[#1a1a1a]">
                <Link href="/grupo-gratis">
                    <img src="https://i.ibb.co/7djtqYqZ/logo-1.png" alt="4Creators Club" className="w-24 opacity-80" />
                </Link>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <ApplicationForm redirectUrl="https://chat.whatsapp.com/FjfHYbParqg6ZdMuozAeVI?mode=hqrt2" />
            </div>
        </main>
    );
}
