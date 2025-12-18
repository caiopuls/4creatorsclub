"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Ecosystem from "./components/Ecosystem";

export default function Home() {

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
      <Navbar />
      <Hero />
      <Stats />
      <Benefits />
      <Ecosystem />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}