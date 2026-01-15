"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroFree from "../components/HeroFree"; // Changed
import Stats from "../components/Stats";
import BenefitsFree from "../components/BenefitsFree";
import ApplicationProcess from "../components/ApplicationProcess";
// import ClubSummary from "../components/ClubSummary"; // Removed
import Testimonials from "../components/Testimonials";
import FlashyCTA from "../components/FlashyCTA"; // Added
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function GrupoGratisHome() {

    // Track page view
    useEffect(() => {
        const sessionId = sessionStorage.getItem("sessionId") ||
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("sessionId", sessionId);

        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId,
                pagePath: window.location.pathname,
            }),
        }).catch(() => { }); // Ignorar erros silenciosamente
    }, []);

    return (
        <main className="relative min-h-screen bg-[#0a0a0a] text-[#ededed]">
            <Navbar ctaLink="/grupo-gratis/application" />
            <HeroFree ctaLink="/grupo-gratis/application" />

            <Stats
                items={[
                    { label: "Membros no Grupo", value: "850", prefix: "+ " },
                    { label: "Oportunidades Geradas", value: "140", prefix: "+ " },
                    { label: "Nichos Diferentes", value: "45", prefix: "+ " },
                    { label: "Custo de Entrada", value: "", prefix: "Gratuito", suffix: "" },
                ]}
            />

            <BenefitsFree />

            <ApplicationProcess />

            {/* Removed ClubSummary */}

            <Testimonials />

            <FlashyCTA ctaLink="/grupo-gratis/application" />

            <CTA ctaLink="/grupo-gratis/application" />
            <Footer />
        </main>
    );
}
