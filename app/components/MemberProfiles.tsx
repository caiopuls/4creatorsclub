"use client";

import { motion } from "framer-motion";
import { User, Hammer, Briefcase, Users, Video, Zap, Code, PenTool, TrendingUp, Building2 } from "lucide-react";

interface Profile {
    title: string;
    description: string;
    icon: React.ReactNode;
    tags: string[];
    gradient: string;
    borderColor: string;
}

const profiles: Profile[] = [
    {
        title: "Creators",
        description: "A voz e a face do digital. Aqueles que dominam a atenção e constroem comunidades engajadas.",
        icon: <Video className="w-8 h-8" />,
        tags: ["Criação de Conteúdo", "Mídia Orgânica", "Influencers", "UGC Creators", "Storytelling"],
        gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
        borderColor: "group-hover:border-pink-500/50"
    },
    {
        title: "Builders",
        description: "Os arquitetos dos bastidores. Profissionais que transformam ideias em produtos e serviços reais.",
        icon: <Hammer className="w-8 h-8" />,
        tags: ["Prestadores de Serviço", "Freelancers", "Gestores de Tráfego", "Desenvolvedores", "Editores & Designers"],
        gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
        borderColor: "group-hover:border-blue-500/50"
    },
    {
        title: "Founders",
        description: "Os visionários do negócio. Empreendedores que constroem empresas, agências e impérios.",
        icon: <Building2 className="w-8 h-8" />,
        tags: ["Empresários", "Donos de Agência", "Infoprodutores", "Líderes", "Strategists"],
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
        borderColor: "group-hover:border-amber-500/50"
    }
];

export default function MemberProfiles() {
    return (
        <section className="py-24 border-b border-[#1a1a1a] bg-[#050505] relative overflow-hidden">
            {/* Background Texture similar to Hero */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen"
                    style={{ animation: 'pulse 8s infinite' }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen"
                    style={{ animation: 'pulse 8s infinite reverse' }}
                />
            </div>

            <div className="max-w-[1160px] mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-extrabold mb-6"
                    >
                        Quem é o <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Membro 4C?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[#d0d0d0] text-lg max-w-2xl mx-auto"
                    >
                        Nosso ecossistema foi desenhado para unir as três forças fundamentais do mercado digital.
                        Se você se encaixa em um destes perfis, seu lugar é aqui.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {profiles.map((profile, idx) => (
                        <motion.div
                            key={profile.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`group relative bg-[#0f0f0f] border border-[#222] ${profile.borderColor} rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="inline-flex p-3 rounded-2xl bg-[#1a1a1a] text-white border border-[#333] group-hover:border-white/30 transition-colors">
                                        {profile.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                                        {profile.title}
                                    </h3>
                                </div>

                                <p className="text-[#a0a0a0] mb-8 leading-relaxed text-base group-hover:text-[#d4d4d4] transition-colors">
                                    {profile.description}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {profile.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1.5 text-xs font-medium text-[#888] bg-[#151515] border border-[#2a2a2a] rounded-lg group-hover:text-white group-hover:border-white/20 group-hover:bg-white/5 transition-all"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
