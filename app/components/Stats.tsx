"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

const stats: Stat[] = [
  { label: "Startups Cadastradas", value: "12", prefix: "+ " },
  { label: "Freelancers Ativos", value: "38", prefix: "+ " },
  { label: "Vagas Abertas", value: "120", prefix: "+ " },
  { label: "Conteúdos Gravados", value: "50", prefix: "+ " },
];

function AnimatedCounter({ value, prefix, suffix }: { value: string; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const target = parseInt(value);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-extrabold">
      {prefix}{Math.floor(count)}{suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 border-b border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-[#dedede] opacity-90 text-sm mb-2">{stat.label}</div>
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
