"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const kpiItems = [
    "Conteúdos gravados · Marketing Orgânico",
    "Viralização · formatos e cases reais de creators",
    "Monetização · SAAS e Infoprodutos",
    "Negócio · estrutura e operação",
    "Networking · creators e especialistas",
    "Softwares exclusivos · descontos e acesso",
];

const words = ["creators", "founders", "builders"];

interface HeroProps {
    ctaLink?: string;
    title?: React.ReactNode;
    subtitle?: string;
    badgeText?: string;
    kpiItems?: string[];
}

export default function Hero({ ctaLink, title, subtitle, badgeText, kpiItems: customKpiItems }: HeroProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
                const items = customKpiItems || kpiItems;
                singleSetWidth = items.length * (firstChild.offsetWidth + 12);
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
                    {badgeText || "Vagas Limitadas: Membro 4C Club"}
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-center text-white"
                >
                    {title || (
                        <>
                            Clube privado para<br className="md:hidden" />{" "}
                            <span className="inline-flex flex-col h-[1.1em] overflow-hidden justify-end pb-1 min-w-[5ch] md:min-w-[6ch]">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={words[index]}
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -40, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
                                    >
                                        {words[index]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>{" "}
                            do digital
                        </>
                    )}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl text-[#b0b0b0] text-sm md:text-lg mb-8 md:mb-10 leading-relaxed px-4"
                >
                    {subtitle || "O ecossistema definitivo para quem quer fazer negócios sólidos. Aprenda com experts, conecte-se com empresas e escale seus resultados."}
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 mb-16 w-full md:w-auto px-5 md:px-0"
                >
                    <Link
                        href={ctaLink || "/application"}
                        className="inline-flex justify-center items-center gap-2 bg-white text-black text-sm md:text-base font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-white/10 w-full md:w-auto"
                    >
                        QUERO SER UM MEMBRO
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
                            {[...(customKpiItems || kpiItems), ...(customKpiItems || kpiItems), ...(customKpiItems || kpiItems)].map((item, idx) => (
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
