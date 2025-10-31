"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  handle: z.string().optional(),
  whatsapp: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        const result = await response.json();
        setErrorMessage(result.error || "Erro ao enviar. Tente novamente.");
        setSubmitStatus("error");
      }
    } catch (error) {
      setErrorMessage("Erro de rede. Verifique sua conexão.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[26px] shadow-2xl max-w-2xl w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-[#2a2a2a] bg-[#0c0c0c] rounded-xl hover:bg-[#1a1a1a] transition-colors text-xl cursor-pointer"
              >
                ×
              </button>

              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-extrabold mb-2">Entrar na lista de espera</h2>
                  <p className="text-sm text-[#a9a9a9]">Avisaremos por email/WhatsApp quando abrirem vagas.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm text-[#bfbfbf] mb-2">
                        Nome *
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Seu nome"
                        {...register("name")}
                        className="w-full px-4 py-4 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="handle" className="block text-sm text-[#bfbfbf] mb-2">
                        Instagram (opcional)
                      </label>
                      <input
                        id="handle"
                        type="text"
                        placeholder="@seuuser"
                        {...register("handle")}
                        className="w-full px-4 py-4 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm text-[#bfbfbf] mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="voce@email.com"
                        {...register("email")}
                        className="w-full px-4 py-4 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm text-[#bfbfbf] mb-2">
                        WhatsApp (opcional)
                      </label>
                      <input
                        id="whatsapp"
                        type="tel"
                        placeholder="(DDD) 90000-0000"
                        {...register("whatsapp")}
                        className="w-full px-4 py-4 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] text-white focus:border-white/40 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-b from-white to-[#e9e9e9] text-black font-extrabold rounded-2xl hover:brightness-105 active:scale-98 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Enviando..." : "Garantir meu lugar"}
                  </button>

                  {submitStatus === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-green-400 font-medium"
                    >
                      ✅ Sucesso! Cadastro enviado.
                    </motion.p>
                  )}

                  {submitStatus === "error" && errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-red-400 font-medium"
                    >
                      ❌ {errorMessage}
                    </motion.p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
