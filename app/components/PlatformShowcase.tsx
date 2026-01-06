"use client";

import { motion } from "framer-motion";
import { Check, Shield, Zap, DollarSign, Users } from "lucide-react";

const features = [
    {
        title: "Para Builders",
        subtitle: "Monetize sem limites",
        description: "Ofereça seus serviços na vitrine mais qualificada do mercado. Sem taxas de 'freelancer' e sem intermediários.",
        benefits: [
            "Fique com 100% do valor dos projetos",
            "Negocie direto com os Founders",
            "Sem limites de clientes ou ganhos",
            "Portfólio visível para a elite do digital"
        ],
        gradient: "from-blue-500/20 to-blue-600/5",
        border: "border-blue-500/30",
        icon: <Zap className="w-6 h-6 text-blue-400" />
    },
    {
        title: "Para Founders",
        subtitle: "Contrate a Elite",
        description: "Acesso direto a uma base curada de profissionais validados. Esqueça processos seletivos demorados.",
        benefits: [
            "Sem taxas escondidas de contratação",
            "Profissionais validados pela comunidade",
            "Acesso rápido a Designers, Devs e Editores",
            "Pague apenas a assinatura do clube"
        ],
        gradient: "from-amber-500/20 to-amber-600/5",
        border: "border-amber-500/30",
        icon: <Shield className="w-6 h-6 text-amber-400" />
    },
    {
        title: "Para Creators",
        subtitle: "Marketing de Influência Real",
        description: "Um espaço dedicado para marcas encontrarem você. Profissionalize sua carreira e feche publicidades.",
        benefits: [
            "Vitrine de Mídia Kit exclusiva",
            "Conexão direta com marcas e empresas",
            "Venda publis e UGC sem agenciamento abusivo",
            "Networking com outros creators"
        ],
        gradient: "from-pink-500/20 to-pink-600/5",
        border: "border-pink-500/30",
        icon: <Users className="w-6 h-6 text-pink-400" />
    }
];

export default function PlatformShowcase() {
    return (
        <section className="py-24 border-b border-[#1a1a1a] bg-[#050505] relative overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1280px] mx-auto px-5 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#d4d4d4] text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            4C Marketplace
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-extrabold mb-6"
                        >
                            O Mercado Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                                Sem Taxas Abusivas
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[#a0a0a0] text-lg max-w-2xl leading-relaxed"
                        >
                            Uma plataforma proprietária feita para gerar negócios reais entre os membros.
                            Builders vendem, Founders contratam, Creators influenciam.
                            Tudo isso incluso na sua assinatura.
                        </motion.p>
                    </div>

                    {/* Mockup Preview Area (Abstract) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#0a0a0a] rounded-2xl border border-[#222] shadow-2xl overflow-hidden flex items-center justify-center group"
                    >
                        {/* Decorative UI elements mimicking a dashboard */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]" />
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* Abstract Cards Floating */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/4 left-1/4 w-64 h-40 bg-[#151515] rounded-xl border border-[#333] shadow-xl p-4 flex flex-col gap-3 opacity-60 md:opacity-100"
                        >
                            <div className="w-1/2 h-4 bg-[#333] rounded animate-pulse" />
                            <div className="w-3/4 h-3 bg-[#222] rounded" />
                            <div className="mt-auto flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                                <div className="flex-1 h-8 bg-[#222] rounded-lg" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="relative z-10 w-80 h-48 bg-[#1a1a1a] rounded-xl border border-[#444] shadow-2xl p-5 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center">
                                <div className="w-24 h-6 bg-[#333] rounded" />
                                <div className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-xs font-bold">R$ 5.000,00</div>
                            </div>
                            <div className="w-full h-px bg-[#333]" />
                            <div className="space-y-2">
                                <div className="w-full h-3 bg-[#2a2a2a] rounded" />
                                <div className="w-5/6 h-3 bg-[#2a2a2a] rounded" />
                            </div>
                            <div className="mt-auto w-full h-10 bg-white text-black font-bold rounded-lg flex items-center justify-center text-sm">
                                Aplicar para Projeto
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute bottom-1/4 right-1/4 w-64 h-40 bg-[#151515] rounded-xl border border-[#333] shadow-xl p-4 flex flex-col gap-3 opacity-60 md:opacity-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-500/20" />
                                <div className="space-y-1">
                                    <div className="w-24 h-4 bg-[#333] rounded" />
                                    <div className="w-16 h-3 bg-[#222] rounded" />
                                </div>
                            </div>
                            <div className="mt-2 w-full h-16 bg-[#222] rounded-lg border border-[#333] flex items-center justify-center text-[#444] text-xs">
                                Mídia Kit Preview
                            </div>
                        </motion.div>

                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className={`group relative h-full bg-[#0a0a0a] border ${feature.border} rounded-3xl p-8 overflow-hidden hover:bg-[#0f0f0f] transition-all duration-300`}
                        >
                            {/* Hover Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-6 w-12 h-12 rounded-xl bg-[#151515] border border-[#333] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-1 text-white">{feature.title}</h3>
                                <p className="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">{feature.subtitle}</p>

                                <p className="text-[#a0a0a0] mb-8 leading-relaxed">
                                    {feature.description}
                                </p>

                                <ul className="mt-auto space-y-3">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[#d4d4d4]">
                                            <Check className="w-5 h-5 text-white/40 shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
