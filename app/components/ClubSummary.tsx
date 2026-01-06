"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const benefits = [
    { text: "Acesso total às 3 Trilhas (Creator, Builder, Founder)", highlight: true },
    { text: "Onboarding Estratégico & Playbooks", highlight: false },
    { text: "Acesso ao Marketplace 4C (Sem taxas)", highlight: true },
    { text: "Comunidade de Networking Qualificado", highlight: false },
    { text: "Descontos exclusivos em Softwares", highlight: true },
    { text: "Direito a Encontros e Lives exclusivas", highlight: false },
    { text: "Venda seus serviços sem intermediários", highlight: true },
    { text: "Contrate profissionais validados", highlight: false },
];

export default function ClubSummary() {
    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden border-b border-[#1a1a1a]">
            {/* Dots Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />

            <div className="max-w-[1000px] mx-auto px-5 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#d4d4d4] text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        Tudo Incluso em uma Assinatura
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold mb-4"
                    >
                        Em resumo: <span className="text-white">O que você recebe</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#888] text-lg max-w-xl mx-auto"
                    >
                        Um único investimento para acessar todo o ecossistema.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex items-center gap-4 p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 group
                                ${benefit.highlight
                                    ? 'bg-gradient-to-r from-blue-900/10 to-purple-900/10 border-blue-500/20 hover:border-blue-500/40'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110
                                ${benefit.highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                <Check className="w-4 h-4" />
                            </div>
                            <span className={`font-medium ${benefit.highlight ? 'text-white' : 'text-[#d4d4d4] group-hover:text-white'}`}>
                                {benefit.text}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
