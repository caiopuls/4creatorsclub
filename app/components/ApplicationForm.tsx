"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ApplicationFormProps {
    redirectUrl: string;
}

export default function ApplicationForm({ redirectUrl }: ApplicationFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        instagram: "",
        currentStatus: "",
        goal: "",
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState(0);

    const analysisSteps = [
        "Analisando perfil...",
        "Verificando nicho e mercado...",
        "Calculando potencial de crescimento...",
        "Validando disponibilidade de vagas...",
        "PERFIL APROVADO!"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const startAnalysis = async () => {
        setStep(4); // Move to analysis view
        setIsAnalyzing(true);

        try {
            await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        } catch (error) {
            console.error("Error saving application:", error);
            // Continue with simulation even if save fails, to not block the user
        }
    };

    useEffect(() => {
        if (isAnalyzing) {
            let currentProgress = 0;

            const simulateProgress = () => {
                if (currentProgress >= 100) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1000);
                    return;
                }

                // Random increment between 0.5 and 2
                const increment = Math.random() * 1.5 + 0.5;
                currentProgress = Math.min(currentProgress + increment, 100);
                setAnalysisProgress(currentProgress);

                // Update steps logic inline to keep sync
                if (currentProgress < 20) setAnalysisStep(0);
                else if (currentProgress < 45) setAnalysisStep(1);
                else if (currentProgress < 75) setAnalysisStep(2);
                else if (currentProgress < 95) setAnalysisStep(3);
                else setAnalysisStep(4);

                // Random delay logic
                let delay = Math.random() * 80 + 20; // Normal speed: 20-100ms

                // 5% chance of a "thinking" pause (longer delay)
                if (Math.random() < 0.05) {
                    delay = Math.random() * 800 + 400; // Pause: 400-1200ms
                }

                setTimeout(simulateProgress, delay);
            };

            simulateProgress();
        }
    }, [isAnalyzing, redirectUrl]);

    return (
        <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111] border border-[#222] p-8 rounded-2xl shadow-2xl"
                    >
                        <div className="mb-6">
                            <span className="text-xs font-bold text-[#666] uppercase tracking-wider">Passo 1 de 3</span>
                            <h2 className="text-2xl font-bold mt-2">Vamos conhecer você</h2>
                            <p className="text-[#888] text-sm mt-1">Preencha seus dados para iniciar a aplicação.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">Nome Completo</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">WhatsApp</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={!formData.name || !formData.email || !formData.phone}
                                className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-[#eee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Próximo ›
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111] border border-[#222] p-8 rounded-2xl shadow-2xl"
                    >
                        <div className="mb-6">
                            <span className="text-xs font-bold text-[#666] uppercase tracking-wider">Passo 2 de 3</span>
                            <h2 className="text-2xl font-bold mt-2">Sobre seu momento</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">Qual seu @ no Instagram?</label>
                                <input
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors"
                                    placeholder="@seuuser"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">Você já tem um negócio digital?</label>
                                <select
                                    name="currentStatus"
                                    value={formData.currentStatus}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="comecando">Ainda não, estou começando</option>
                                    <option value="iniciante">Sim, mas faturo pouco</option>
                                    <option value="intermediario">Sim, já vivo do digital</option>
                                    <option value="avancado">Sim, quero escalar</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={prevStep}
                                className="text-[#888] font-medium hover:text-white transition-colors"
                            >
                                ‹ Voltar
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!formData.instagram || !formData.currentStatus}
                                className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-[#eee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Próximo ›
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111] border border-[#222] p-8 rounded-2xl shadow-2xl"
                    >
                        <div className="mb-6">
                            <span className="text-xs font-bold text-[#666] uppercase tracking-wider">Passo 3 de 3</span>
                            <h2 className="text-2xl font-bold mt-2">Objetivo</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#ccc] mb-1.5">O que você busca no 4Creators Club?</label>
                                <textarea
                                    name="goal"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white focus:border-white/50 focus:outline-none transition-colors h-32 resize-none"
                                    placeholder="Ex: Quero aprender a monetizar minha audiência..."
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={prevStep}
                                className="text-[#888] font-medium hover:text-white transition-colors"
                            >
                                ‹ Voltar
                            </button>
                            <button
                                onClick={startAnalysis}
                                disabled={!formData.goal}
                                className="bg-gradient-to-r from-white to-gray-200 text-black font-bold px-8 py-3 rounded-lg hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/10"
                            >
                                Enviar Aplicação
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="mb-8 relative inline-block">
                            {/* Ring animation */}
                            <div className="w-24 h-24 border-4 border-[#333] border-t-white rounded-full animate-spin mx-auto" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xl">
                                {Math.round(analysisProgress)}%
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 animate-pulse">
                            {analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}
                        </h2>
                        <p className="text-[#666] text-sm">Aguarde, não feche essa página...</p>

                        {analysisProgress === 100 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 text-green-400 font-bold bg-green-400/10 py-2 px-4 rounded-full inline-block"
                            >
                                Redirecionando...
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
