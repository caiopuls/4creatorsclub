"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

const kpiItems = [
    "Conteúdos gravados · Marketing Orgânico",
    "Viralização · formatos e cases reais de creators",
    "Monetização · SAAS e Infoprodutos",
    "Negócio · estrutura e operação",
    "Networking · creators e especialistas",
    "Softwares exclusivos · descontos e acesso",
];

export default function Hero() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationId: number | null = null;
        let scrollX = 0;
        let singleSetWidth = 0;

        // Auto-scroll logic (simplified from previous version)
        const scroll = () => {
            if (container.children.length > 0) {
                const firstChild = container.children[0] as HTMLElement;
                singleSetWidth = kpiItems.length * (firstChild.offsetWidth + 12);
            }

            scrollX += 0.5;
            if (scrollX >= singleSetWidth && singleSetWidth > 0) {
                scrollX = 0;
            }
            container.scrollLeft = scrollX;
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <header className="relative pt-16 pb-20 md:pt-24 md:pb-20 overflow-hidden border-b border-[#1a1a1a]">
            {/* Animated Gradient Background */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    background: "linear-gradient(45deg, #1a1a1a, #333333, #000000, #1a1a1a)",
                    backgroundSize: "400% 400%",
                    animation: "gradientOrbits 15s ease infinite"
                }}
            />
            <style jsx>{`
        @keyframes gradientOrbits {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>

            {/* Content */}
            <div className="max-w-[1160px] mx-auto px-4 md:px-5 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#d4d4d4] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6"
                >
                    Vagas Limitadas: Founder 4C
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-center mb-4 md:mb-6"
                >
                    <span
                        className="inline-block bg-clip-text text-transparent"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #888888 50%, #ffffff 65%, #ffffff 100%)',
                            backgroundSize: '300% 100%',
                            animation: 'shimmer 10s ease-in-out infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundPosition: '0% 50%'
                        }}
                    >
                        Clube privado para{" "}
                        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                            creators e founders
                        </span>{" "}
                        digital
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl text-[#b0b0b0] text-base md:text-lg mb-10 leading-relaxed"
                >
                    O ecossistema definitivo para quem quer fazer negócios sólidos.
                    Aprenda com experts, conecte-se com empresas e escale seus resultados.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 mb-16 w-full md:w-auto"
                >
                    <Link
                        href="/application"
                        className="inline-flex justify-center items-center gap-2 bg-white text-black text-base font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-white/10"
                    >
                        QUERO SER UM FOUNDER
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>

                {/* KPI Tickler */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-full max-w-full overflow-hidden border-t border-[#222] pt-8"
                >
                    <p className="text-xs text-[#666] uppercase tracking-widest font-bold mb-4">O que você vai acessar</p>
                    <div className="relative w-full overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-hidden whitespace-nowrap"
                        >
                            {[...kpiItems, ...kpiItems, ...kpiItems].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 rounded-lg bg-[#111] border border-[#222] text-[#888] text-xs font-medium"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black to-transparent pointer-events-none" />
                        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none" />
                    </div>
                </motion.div>

            </div>
        </header>
    );
}
