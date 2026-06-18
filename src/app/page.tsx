"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Shell ──
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import { WebGLScene } from "@/components/webgl/Scene";

// ── Sections ──
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSphere } from "@/components/sections/SkillsSphere";
import { LeetCodeHeatmap } from "@/components/ui/LeetCodeHeatmap";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ContactFooter } from "@/components/sections/ContactFooter";

// ── Global overlays ──
import { AdarshAIWidget } from "@/components/ui/AdarshAIWidget";
import { TerminalOverride } from "@/components/ui/TerminalOverride";

// ── Sounds ──
import { useCyberSounds } from "@/hooks/useCyberSounds";

import { useTerminal } from "@/context/TerminalContext";
import { motion } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { playClick, playWarpSpeed } = useCyberSounds();
  const { isTerminalActive } = useTerminal();

  // Wire click sound globally
  useEffect(() => {
    const handler = () => playClick();
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [playClick]);

  // Sync Lenis smooth scroll with GSAP ScrollTrigger & Scroll Velocity check
  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll trigger velocity check for playing warp-speed sound
    let throttleWarp = false;
    const scrollTriggerInstance = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        if (velocity > 2800 && !throttleWarp) {
          playWarpSpeed();
          throttleWarp = true;
          setTimeout(() => {
            throttleWarp = false;
          }, 2200);
        }
      },
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      scrollTriggerInstance.kill();
    };
  }, [loading, playWarpSpeed]);

  return (
    <main className="relative min-h-screen bg-cinematic-dark text-foreground selection:bg-white selection:text-black">
      {/* Cinematic animated grain/noise overlay */}
      <div 
        className="fixed inset-[-200%] pointer-events-none z-[999] opacity-[0.04] noise-overlay" 
        aria-hidden="true" 
      />

      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Fade/Hide entire Cinematic UI when Terminal is active */}
      <motion.div
        animate={{
          opacity: isTerminalActive ? 0 : 1,
          pointerEvents: isTerminalActive ? "none" : "auto",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full min-h-screen"
      >
        {/* Ambient WebGL background */}
        <WebGLScene />

        {/* ── Cinematic Preloader ── */}
        <AnimatePresence mode="wait">
          {loading && (
            <Preloader key="preloader" onComplete={() => setLoading(false)} />
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="relative z-10">
          {!loading && <Navbar />}

          {/* Hero receives isLoaded to gate GSAP entrance */}
          <HeroSection isLoaded={!loading} />

          <AboutSection />
          <SkillsSphere />
          <LeetCodeHeatmap />
          <ProjectsSection />
          <ExperienceTimeline />
          <ContactFooter />
        </div>

        {/* ── Global overlays ── */}
        <AdarshAIWidget />
      </motion.div>

      {/* Terminal Override is rendered outside the main wrapper so it stays active */}
      <TerminalOverride />
    </main>
  );
}
