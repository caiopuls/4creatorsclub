"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import MemberProfiles from "../components/MemberProfiles";
import PlatformShowcase from "../components/PlatformShowcase";
import Benefits from "../components/Benefits";
import ClubSummary from "../components/ClubSummary";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Pricing from "../components/Pricing";

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
            <Hero ctaLink="/grupo-gratis/application" />
            <Stats />
            <MemberProfiles />
            <PlatformShowcase />
            <Benefits />
            <ClubSummary />
            <Testimonials />
            <Pricing ctaLink="/grupo-gratis/application" />
            <CTA ctaLink="/grupo-gratis/application" />
            <Footer />
        </main>
    );
}
