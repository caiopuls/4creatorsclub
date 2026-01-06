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

export default function Hero() {
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
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#0a0a0a]">
            {/* Background Pattern - White Smoke Dots */}
            <div className="absolute inset-0 z-0 opacity-[0.1]"
                style={{
                    backgroundImage: 'radial-gradient(#f5f5f5 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />
            {/* Gradient Overlay for Fade */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90" />

            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent opacity-20" />

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-5 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase">
                        Membro 4C Club
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-center text-white"
                >
                    Clube privado para<br className="md:hidden" />{" "}
                    <span className="inline-flex flex-col h-[1.1em] overflow-hidden justify-end pb-1 min-w-[5ch] md:min-w-[6ch]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={words[index]}
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -40, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-gradient-to-r from-blue-400 via-white to-blue-200 bg-clip-text text-transparent"
                            >
                                {words[index]}
                            </motion.span>
                        </AnimatePresence>
                    </span>{" "}
                    do digital
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-[#d2d2d2] text-center max-w-2xl text-lg md:text-xl leading-relaxed"
                >
                    Aprenda a construir audiência, criar produtos e escalar negócios.
                    Tudo o que você precisa em um único ecossistema.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
                >
                    <Link
                        href="#pricing"
                        className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-center"
                    >
                        Quero ser membro
                    </Link>
                    <Link
                        href="https://wa.me/5548991195678"
                        target="_blank"
                        className="w-full md:w-auto px-8 py-4 bg-transparent border border-[#333] text-white font-bold rounded-lg hover:bg-white/5 transition-colors text-center"
                    >
                        Falar com consultor
                    </Link>
                </motion.div>

                {/* KPI Ticker - Updated margin and colors */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-20 w-full overflow-hidden border-t border-b border-white/5 bg-black/20 backdrop-blur-sm"
                >
                    <div className="flex relative" ref={scrollContainerRef}>
                        <div className="flex animate-scroll whitespace-nowrap py-4">
                            {/* Content filled by JS auto-scroll or just static map if we prefer simple marquee */}
                            {[...kpiItems, ...kpiItems, ...kpiItems].map((item, idx) => (
                                <div key={idx} className="inline-flex items-center mx-6 text-sm md:text-base text-[#666] font-medium uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-4"></span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
