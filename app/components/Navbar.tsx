"use client";

import { motion } from "framer-motion";

interface NavbarProps { }

import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-[#090909]/80 backdrop-blur-xl border-b border-[#1a1a1a]"
    >
      <div className="max-w-[1160px] mx-auto px-4 md:px-5 flex items-center justify-between py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="https://i.ibb.co/7djtqYqZ/logo-1.png" alt="4Creators Club" className="w-20 md:w-[120px] h-auto" loading="lazy" decoding="async" />
        </div>
        <Link
          href="/application"
          className="inline-flex items-center gap-1.5 md:gap-2.5 border border-[#2a2a2a] rounded-full px-3 py-2 md:px-5 md:py-3.5 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm font-bold text-xs md:text-sm hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          Aplicar agora
        </Link>
      </div>
    </motion.nav>
  );
}
