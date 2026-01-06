"use client";

import { motion } from "framer-motion";
import { BookOpen, Lock } from "lucide-react";

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

const curriculum: Module[] = [
  {
    title: "MÓDULO ONBOARDING",
    description: "Os primeiros passos para alinhar expectativas e começar com o pé direito.",
    icon: "🔰",
    color: "text-green-500",
    subModules: [
      { title: "Boas-vindas e visão do projeto" },
      { title: "Acesso às plataformas" },
      { title: "Apresentação estratégica" },
      { title: "Playbooks iniciais" }
    ]
  },
  {
    title: "TRILHA CREATOR",
    description: "Para quem quer viralizar, crescer rápido e ganhar dinheiro com criação de conteúdo.",
    icon: "🧩",
    color: "text-pink-500",
    subModules: [
      { title: "Fundamentos da Atenção" },
      { title: "Storytelling e Narrativa" },
      { title: "Estruturas de Conteúdo Viral" },
      { title: "Hooks e Copy" },
      { title: "Edição com Santiago (Pro)" },
      { title: "Monetização da Audiência" }
    ]
  },
  {
    title: "TRILHA TECH & SAAS BUILDER",
    description: "Para quem quer criar produtos, SaaS, automações e negócios digitais em escala.",
    icon: "⚙️",
    color: "text-blue-500",
    subModules: [
      { title: "Seja um Builder" },
      { title: "Ferramentas e Ambiente" },
      { title: "Automação e IA" },
      { title: "Landing Pages que vendem" },
      { title: "Construindo Seu Primeiro SaaS" },
      { title: "De MVP a produto escalável" }
    ]
  },
  {
    title: "TRILHA FOUNDER & NEGÓCIOS",
    description: "Para quem quer criar uma empresa sólida.",
    icon: "💰",
    color: "text-amber-500",
    subModules: [
      { title: "Alinhamento Estratégico" },
      { title: "Finanças para Negócios" }
    ]
  }
];

export default function Benefits() {
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
            Conteúdo Programático
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold mb-6"
          >
            O que você vai aprender na prática
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#d0d0d0] text-lg max-w-2xl mx-auto"
          >
            Acesso total às 3 trilhas fundamentais do digital + onboarding estratégico.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {curriculum.map((module, idx) => (
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
                <div className="flex items-center justify-between text-xs font-bold text-[#666] uppercase tracking-wider mb-2">
                  <span>Módulos</span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <Lock size={10} />
                    Em desenvolvimento
                  </span>
                </div>
                {module.subModules.map((sub, subIdx) => (
                  <div key={subIdx} className="flex items-center gap-3 p-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
                    <BookOpen className="w-4 h-4 text-[#444]" />
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
