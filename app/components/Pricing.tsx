"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Pricing({ ctaLink }: { ctaLink?: string }) {
    return (
        <section className="py-24 border-b border-[#1a1a1a] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1160px] mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#d4d4d4] text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        OFERTA EXCLUSIVA DE LANÇAMENTO
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                    >
                        Torne-se um <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">4C Member</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#d0d0d0] text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Acesso antecipado com condições especiais para os primeiros membros.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-lg mx-auto bg-[#0f0f0f] border border-[#2a2a2a] rounded-[32px] p-6 md:p-10 relative group hover:border-white/20 transition-all duration-300"
                >
                    {/* Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-white/10 whitespace-nowrap z-20">
                        30 Vagas Disponíveis
                    </div>

                    <div className="text-center mb-8 mt-4 md:mt-0">
                        <div className="text-[#888] text-sm font-bold uppercase tracking-wider mb-3">Plano Mensal Membro</div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg text-[#666] line-through mb-1 font-medium">R$ 189,90</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-extrabold text-white">R$ 59</span>
                                <span className="text-2xl font-bold text-[#d0d0d0]">,90</span>
                            </div>
                        </div>
                        <div className="text-[#888] text-sm mt-3">cobrado mensalmente</div>
                    </div>

                    <ul className="space-y-4 mb-10">
                        {[
                            "Acesso às Trilhas (Creator, Builder, Founder)",
                            "Marketplace 4C Jobs Ilimitado",
                            "Comunidade de Networking & Lives",
                            "Selo Founder no perfil",
                            "Playbooks e Materiais de Apoio"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-[#e0e0e0] text-sm md:text-base">
                                <div className="w-5 h-5 mt-0.5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="leading-tight">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={ctaLink || "/application"}
                        className="block w-full text-center bg-white text-black font-extrabold text-lg py-4 rounded-xl hover:bg-[#eaeaea] hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-white/5"
                    >
                        QUERO MINHA VAGA
                    </Link>

                    <div className="text-center mt-4 text-xs text-[#666]">
                        Processo de seleção com IA. Apenas perfis qualificados.
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
