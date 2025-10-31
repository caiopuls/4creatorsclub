"use client";

import { motion } from "framer-motion";

interface CTAProps {
  onOpenModal: () => void;
}

export default function CTA({ onOpenModal }: CTAProps) {
  return (
    <section className="py-20 border-b border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-3"
        >
          Ficou alguma dúvida?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#d0d0d0] mb-8 max-w-2xl mx-auto"
        >
          Fale conosco ou entre na lista de espera agora mesmo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 border border-[#2a2a2a] rounded-full px-6 py-4 bg-[#0c0c0c] font-bold hover:border-white/30 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          >
            Entrar na lista agora
          </button>
          <a
            href="https://wa.me/5551992615201"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 rounded-full px-6 py-4 bg-gradient-to-b from-white to-[#e8e8e8] text-black font-extrabold hover:brightness-105 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          >
            Falar com suporte ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
