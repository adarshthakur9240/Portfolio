"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import gsap from "gsap";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

// ==========================================
// 1. MAGNETIC BUTTON COMPONENT (Framer Motion)
// ==========================================
const MagneticButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null); // Fix: typed as HTMLDivElement

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative inline-flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 2. CINEMATIC PRELOADER (Framer Motion)
// ==========================================
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.5, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_40px_10px_rgba(34,211,238,0.7)]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute mt-16 text-xs tracking-[0.5em] text-cyan-500 uppercase font-mono"
      >
        Initiating System
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// 3. MAIN PORTFOLIO COMPONENT (GSAP + Sound Integration)
// ==========================================
export default function CinematicPortfolio() {
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textRef = useRef<HTMLHeadingElement>(null); // Fix: typed as HTMLHeadingElement

  // Initialize Sound
  useEffect(() => {
    audioRef.current = new Audio("/sounds/all-the-stars.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle Sound Toggle
  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled]);

  // Track Mouse for Custom Cursor & Background Glow
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // GSAP Text Reveal after Preloader
  useEffect(() => {
    if (!loading && textRef.current) {
      const el = textRef.current;
      const chars = el.innerText.split("");
      el.innerHTML = "";

      chars.forEach((char: string) => { // Fix: explicit string type for char
        const span = document.createElement("span");
        span.innerText = char;
        span.className = "inline-block opacity-0 translate-y-8";
        el.appendChild(span);
      });

      gsap.to(el.children, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.2,
      });
    }
  }, [loading]);

  // Fix: wrapped all JSX in a single root <div> — was missing the opening wrapper
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Custom Glow Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 rounded-full border border-cyan-500/30 bg-cyan-500/10 mix-blend-screen transition-transform duration-75"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
      />

      {/* Cinematic Preloader */}
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Main Content (Hidden until preloader completes) */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8"
        >
          {/* Sound Toggle (Top Right) */}
          <div className="absolute top-8 right-8 z-50">
            <MagneticButton onClick={() => setSoundEnabled(!soundEnabled)}>
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <span className="text-xs uppercase tracking-widest font-mono text-gray-400">
                  {soundEnabled ? "Sound: ON" : "Sound: OFF"}
                </span>
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </MagneticButton>
          </div>

          {/* Hero Content */}
          <div className="flex flex-col items-center text-center max-w-5xl">
            {/* GSAP Animated Massive Title */}
            <h1
              ref={textRef}
              className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
            >
              ADARSH SINGH
            </h1>

            {/* Framer Motion Animated Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-lg md:text-2xl text-gray-400 font-light mb-12 max-w-2xl"
            >
              Architecting{" "}
              <span className="text-cyan-400 font-medium">High-Throughput AI</span>{" "}
              &amp; Distributed Systems.
            </motion.p>

            {/* Magnetic CTA Action Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
              className="flex gap-6"
            >
              <MagneticButton>
                <div className="group flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-500 text-black font-semibold text-sm tracking-wide overflow-hidden relative">
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10">EXPLORE WORK</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </div>
              </MagneticButton>

              <MagneticButton>
                <div className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/5 hover:border-white/40 transition-colors">
                  DOWNLOAD RÉSUMÉ
                </div>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Background Ambient Glow tracking mouse */}
          <motion.div
            className="fixed inset-0 z-[-1] pointer-events-none opacity-20"
            animate={{
              background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.15), transparent 80%)`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}