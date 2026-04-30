"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSphere } from "@/components/sections/SkillsSphere";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { WebGLScene } from "@/components/webgl/Scene";

import { useCyberSounds } from "@/hooks/useCyberSounds";
import { useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { playClick } = useCyberSounds();

  useEffect(() => {
    const handleGlobalClick = () => {
      playClick();
    };
    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, [playClick]);

  return (
    <main className="relative min-h-screen bg-cinematic-dark text-foreground selection:bg-neon-cyan selection:text-black nebula-gradient">
      <CustomCursor />
      <WebGLScene />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="relative z-10">
        {!loading && <Navbar />}
        <HeroSection />
        <AboutSection />
        <SkillsSphere />
        <ProjectsSection />
        <ExperienceTimeline />
        <ContactFooter />
      </div>
    </main>
  );
}
