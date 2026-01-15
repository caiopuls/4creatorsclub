"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroFree({ ctaLink }: { ctaLink?: string }) {
    return (
        <header className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden border-b border-[#003300] bg-black">
            {/* Animated Gradient Background - Green/Black */}
            <div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    background: "radial-gradient(circle at 50% 50%, #004d00 0%, #000000 70%)",
                }}
            />

            {/* Floating WhatsApp Icons */}
            <FloatingIcons />

            {/* Content */}
            <div className="max-w-[1160px] mx-auto px-4 md:px-5 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-900/10 backdrop-blur-md text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(0,255,0,0.1)]"
                >
                    Comunidade Exclusiva para Empresários
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight text-center text-white mb-6"
                >
                    Grupo 4C Club<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                        100% GRÁTIS
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl text-gray-400 text-lg md:text-xl mb-10 leading-relaxed px-4"
                >
                    Entre agora para o ecossistema que vai mudar o seu jogo.
                    Networking, insights e oportunidades de negócio todos os dias.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-5 md:px-0"
                >
                    <Link
                        href={ctaLink || "/grupo-gratis/application"}
                        className="inline-flex justify-center items-center gap-2 bg-[#25D366] text-black text-sm sm:text-lg font-bold px-6 py-4 rounded-full hover:bg-[#20bd5a] transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.4)] w-full md:w-auto whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        ENTRAR NO GRUPO AGORA
                    </Link>
                    <div className="mt-4 text-xs text-[#666] max-w-sm mx-auto flex items-center gap-1.5 justify-center">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Análise de perfil via IA. Apenas selecão dos melhores.
                    </div>
                </motion.div>

            </div>
        </header >
    );
}

function FloatingIcons() {
    // Generate random positions and delays for icons
    const icons = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        size: 30 + Math.random() * 40
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {icons.map((icon) => (
                <motion.div
                    key={icon.id}
                    className="absolute text-[#00A884] opacity-20 blur-sm"
                    initial={{
                        x: `${icon.x}vw`,
                        y: `${icon.y}vh`,
                        rotate: 0
                    }}
                    animate={{
                        y: [`${icon.y}vh`, `${(icon.y + 50) % 100}vh`],
                        rotate: 360,
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: icon.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: icon.delay
                    }}
                    style={{ width: icon.size, height: icon.size }}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
