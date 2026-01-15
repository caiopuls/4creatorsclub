"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Zap, Lock } from "lucide-react";

interface SubModule {
    title: string;
}

interface Module {
    title: string;
    description: string;
    icon: string;
    subModules: SubModule[];
    color: string;
}

const freeGroupBenefits: Module[] = [
    {
        title: "NETWORKING DE ALTO NÍVEL",
        description: "Conecte-se com empresários, founders e creators que estão construindo o futuro.",
        icon: "🤝",
        color: "text-green-500",
        subModules: [
            { title: "Troca de experiências reais" },
            { title: "Acesso a parceiros estratégicos" },
            { title: "Ambiente de crescimento" },
            { title: "Conexões valiosas" }
        ]
    },
    {
        title: "OPORTUNIDADES & NEGÓCIOS",
        description: "Encontre novos clientes, feche projetos e faça parcerias estratégicas.",
        icon: "💼",
        color: "text-blue-500",
        subModules: [
            { title: "Oferta de serviços digitais" },
            { title: "Encontre sócios" },
            { title: "Troca de experiências" },
            { title: "Novos negócios" }
        ]
    },
    {
        title: "INSIGHTS DE MERCADO",
        description: "Fique por dentro das tendências e estratégias que estão funcionando agora.",
        icon: "🧠",
        color: "text-amber-500",
        subModules: [
            { title: "Análises de mercado" },
            { title: "Estratégias de growth" },
            { title: "Ferramentas e IA" },
            { title: "Discussões exclusivas" }
        ]
    },
    {
        title: "VISIBILIDADE",
        description: "Destaque-se na comunidade e construa sua autoridade.",
        icon: "🚀",
        color: "text-purple-500",
        subModules: [
            { title: "Compartilhe seus cases" },
            { title: "Seja reconhecido" },
            { title: "Construa reputação" }
        ]
    }
];

export default function BenefitsFree() {
    return (
        <section className="py-24 border-b border-[#1a1a1a] bg-[#080808]">
            <div className="max-w-[1000px] mx-auto px-5">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#d4d4d4] text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        O Que Você Encontra no Grupo
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold mb-6"
                    >
                        Acesso exclusivo a oportunidades
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#d0d0d0] text-lg max-w-2xl mx-auto"
                    >
                        O ambiente certo para quem quer crescer, fechar negócios e estar à frente no digital.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {freeGroupBenefits.map((module, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="border border-[#222] bg-[#0c0c0c] rounded-2xl overflow-hidden p-6 md:p-8 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-2xl ${module.color}`}>
                                    {module.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white flex-1">
                                    {module.title}
                                </h3>
                            </div>

                            <p className="text-[#888] text-sm mb-6 min-h-[40px]">
                                {module.description}
                            </p>

                            <div className="space-y-3">
                                {module.subModules.map((sub, subIdx) => (
                                    <div key={subIdx} className="flex items-center gap-3 p-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
                                        <Zap className="w-4 h-4 text-[#444]" />
                                        <span className="text-[#d4d4d4] text-sm font-medium">
                                            {sub.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
