"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface HeroProps {
  onOpenModal: () => void;
}

const kpiItems = [
  "Conteúdos gravados · Marketing Orgânico",
  "Viralização · formatos e cases reais de creators",
  "Monetização · SAAS e Infoprodutos",
  "Negócio · estrutura e operação",
  "Networking · creators e especialistas",
  "Softwares exclusivos · descontos e acesso",
];

export default function Hero({ onOpenModal }: HeroProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number | null = null;
    let scrollX = 0;
    let singleSetWidth = 0;

    const calculateWidth = () => {
      if (container.children.length === 0) return false;
      
      const firstChild = container.children[0] as HTMLElement;
      if (!firstChild || firstChild.offsetWidth === 0) return false;
      
      const itemWidth = firstChild.offsetWidth;
      const gap = 12; // gap-3 = 12px
      singleSetWidth = kpiItems.length * (itemWidth + gap);
      return true;
    };

    const scroll = () => {
      if (singleSetWidth === 0) {
        if (!calculateWidth()) {
          animationId = requestAnimationFrame(scroll);
          return;
        }
      }

      scrollX += 0.4;
      
      if (scrollX >= singleSetWidth) {
        scrollX = 0;
      }
      
      container.scrollLeft = scrollX;
      animationId = requestAnimationFrame(scroll);
    };

    const initScroll = () => {
      if (calculateWidth()) {
        container.scrollLeft = 0;
        scrollX = 0;
        animationId = requestAnimationFrame(scroll);
      } else {
        setTimeout(initScroll, 100);
      }
    };

    // Inicia após um delay para garantir renderização
    const timeoutId = setTimeout(initScroll, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <header className="relative py-16 md:py-24 lg:py-32 overflow-hidden border-b border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-4 md:px-5 relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#bdbdbd] uppercase tracking-wider text-[10px] md:text-xs font-bold text-center mb-2"
        >
          Lista de espera gratuita
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-center mb-4 md:mb-6"
        >
          Clube privado para{" "}
          <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            creators
          </span>{" "}
          do mercado digital
        </motion.h1>

        {/* Lead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center text-sm md:text-base lg:text-lg text-[#dadada] mb-6 md:mb-8 px-2"
        >
          O <strong>4Creators Club</strong> reúne creators, editores, designers e empresários com um objetivo comum:{" "}
          <strong>viralizar</strong>, construir <strong>autoridade</strong> e transformar audiência em{" "}
          <strong>receita</strong>.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-3 mb-8 md:mb-12 lg:mb-16"
        >
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 border border-white/20 rounded-full px-6 py-3 md:px-8 md:py-4 bg-gradient-to-b from-white to-[#e8e8e8] text-black font-extrabold text-sm md:text-base tracking-wide hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-white/10 cursor-pointer"
          >
            COMEÇAR AGORA
          </button>
        </motion.div>

        {/* KPI Scrolling Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-full mx-auto"
        >
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-4 md:p-6">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-scroll scroll-smooth hide-scrollbar pb-2"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'auto'
              }}
            >
                {[...kpiItems, ...kpiItems, ...kpiItems, ...kpiItems].map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 md:px-4 md:py-3 rounded-xl border border-dashed border-[#2a2a2a] text-[#e9e9e9] whitespace-nowrap text-xs md:text-sm font-medium flex-shrink-0"
                  >
                    <strong>{item}</strong>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swoosh effect */}
      <div className="absolute -left-[15%] -right-[15%] -bottom-[18%] h-[280px] rounded-[50%] bg-gradient-to-t from-white/[0.28] to-transparent blur-3xl opacity-40 pointer-events-none" />
    </header>
  );
}
