"use client";

import { motion } from "framer-motion";

interface Level {
  emoji: string;
  level: string;
  trailName: string;
  objective: string;
  examples: string[];
}

const levels: Level[] = [
  {
    emoji: "🧩",
    level: "Nível 1 – Criar",
    trailName: "O Jogo da Atenção",
    objective: "Dominar o orgânico, entender narrativa e viralização",
    examples: ["Storytelling", "hooks", "formatos", "copy", "mídia orgânica"],
  },
  {
    emoji: "⚙️",
    level: "Nível 2 – Construir",
    trailName: "O Jogo da Execução",
    objective: "Aprender ferramentas digitais e criar produtos",
    examples: ["IA aplicada", "vibe-code", "landing pages", "SaaS"],
  },
  {
    emoji: "💰",
    level: "Nível 3 – Lucrar",
    trailName: "O Jogo do Dinheiro",
    objective: "Aprender a monetizar, vender e escalar",
    examples: ["Vendas", "monetização", "parcerias", "lançamentos", "MRR"],
  },
  {
    emoji: "🚀",
    level: "Nível 4 – Expandir",
    trailName: "O Jogo da Liberdade",
    objective: "Construir marca, equipe e negócios duradouros",
    examples: ["Liderança", "produtividade", "branding pessoal", "networking", "equipe"],
  },
];

export default function Benefits() {
  return (
    <section className="py-20 border-b border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-3"
        >
          Sua jornada em 4 níveis
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#d0d0d0] max-w-2xl mb-12"
        >
          Conteúdos gravados e lives para cada nível, além de grupos de networking para acelerar seus resultados.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6">
          {levels.map((level, idx) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                  {level.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#a9a9a9] mb-1">{level.level}</div>
                  <h3 className="text-xl font-bold mb-2">{level.trailName}</h3>
                </div>
              </div>
              <p className="text-[#c9c9c9] text-sm leading-relaxed mb-4">{level.objective}</p>
              <div>
                <div className="text-xs text-[#a9a9a9] mb-2">Exemplos de conteúdo:</div>
                <div className="flex flex-wrap gap-2">
                  {level.examples.map((example, exampleIdx) => (
                    <span
                      key={exampleIdx}
                      className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#d0d0d0]"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
