"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Marketplace de Jobs",
        description: "Conecte-se com marcas e clientes em busca de negócios. Oportunidades reais de delegar ou vender seu serviço.",
        icon: "💼",
    },
    {
        title: "Marketplace de Startups",
        description: "Encontre sócios, invista ou entre para o time de projetos em estágio inicial com alto potencial.",
        icon: "🚀",
    },
    {
        title: "Networking Curado",
        description: "Acesso a um grupo exclusivo de empresários e creators selecionados a dedo.",
        icon: "🤝",
    },
    {
        title: "Curso 4Creators",
        description: "Acesso completo a todas as trilhas: Audiência, Construção, Vendas e Escala.",
        icon: "🎓",
        status: "Em desenvolvimento",
    },
];

export default function Ecosystem() {
    return (
        <section className="py-20 border-b border-[#1a1a1a] bg-[#0c0c0c]">
            <div className="max-w-[1160px] mx-auto px-5">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold mb-6"
                    >
                        Muito mais que um curso
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#d0d0d0] text-lg max-w-2xl mx-auto"
                    >
                        O 4Creators Club é um ecossistema completo para quem quer viver do digital.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
                        >
                            {feature.status && (
                                <div className="absolute top-4 right-4 md:top-5 md:right-5 bg-yellow-500/10 text-yellow-500 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-500/20 backdrop-blur-sm z-10">
                                    {feature.status}
                                </div>
                            )}
                            <div className="text-5xl mb-6">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-[#a0a0a0] leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
