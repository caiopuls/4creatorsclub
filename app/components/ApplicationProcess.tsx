"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: FileText,
        title: "1. Preencha o Formulário",
        description: "Informe seus dados para identificarmos seu perfil de negócio."
    },
    {
        icon: Cpu,
        title: "2. Análise de I.A.",
        description: "Nossa inteligência artificial analisa seu fit com o grupo em segundos."
    },
    {
        icon: CheckCircle,
        title: "3. Aprovação & Acesso",
        description: "Se aprovado, você recebe o link exclusivo do grupo imediatamente."
    }
];

export default function ApplicationProcess() {
    return (
        <section className="py-20 border-b border-[#111] bg-[#050505]">
            <div className="max-w-[1000px] mx-auto px-5">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Vagas Limitadas
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-[#ededed] mb-4"
                    >
                        Como funciona a seleção?
                    </motion.h2>
                    <p className="text-[#a0a0a0] max-w-xl mx-auto">
                        Para manter a qualidade do networking, utilizamos um processo rigoroso e automatizado.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[24px] left-[16%] right-[16%] h-[2px] bg-[#222] z-0" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[#25D366] mb-6 shadow-lg shadow-black/50">
                                <step.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-[#888] leading-relaxed max-w-[250px]">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 p-6 rounded-2xl bg-[#0a0a0a] border border-[#222] text-center max-w-2xl mx-auto"
                >
                    <p className="text-[#d4d4d4] text-sm md:text-base">
                        <strong className="text-[#25D366]">Atenção:</strong> Devido à alta procura, as vagas podem fechar a qualquer momento sem aviso prévio. Se o botão estiver ativo, aproveite.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
