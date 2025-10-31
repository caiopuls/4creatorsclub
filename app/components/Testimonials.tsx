"use client";

import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Lucas Silva",
    role: "Creator & CEO",
    text: "O 4C Club mudou minha estratégia de conteúdo. Em 3 meses, consegui aumentar meu alcance orgânico em 400%.",
  },
  {
    name: "Ana Costa",
    role: "Editora Digital",
    text: "Os cases reais de creators são incríveis. Finalmente entendi como criar conteúdo que realmente converte.",
  },
  {
    name: "Pedro Santos",
    role: "Marketing Expert",
    text: "Networking de alto nível e estratégias de monetização que valem ouro. Meu faturamento triplicou.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 border-b border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-3 text-center"
        >
          O que dizem nossos membros
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#d0d0d0] text-center mb-12"
        >
          Juntos, construindo o futuro do marketing digital
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[22px] p-6"
            >
              <div className="mb-4">
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-[#a9a9a9]">{testimonial.role}</div>
              </div>
              <p className="text-[#d0d0d0] text-sm leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
