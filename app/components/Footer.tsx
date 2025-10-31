"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[#1a1a1a]">
      <div className="max-w-[1160px] mx-auto px-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="https://i.ibb.co/7djtqYqZ/logo-1.png" alt="4Creators Club" width="120" height="auto" loading="lazy" decoding="async"/>
          </div>
          <p className="text-xs text-[#a9a9a9]">
            Junte-se a dezenas de empresários e creators de sucesso.
          </p>
          <div className="text-sm text-[#bdbdbd] mt-2">
            © {currentYear} 4Creators Club. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}



