"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";
import { MagneticPull } from "@/components/ui/MagneticPull";
import { FiDownload, FiArrowDown } from "react-icons/fi";
import gsap from "gsap";

interface HeroSectionProps {
  isLoaded?: boolean;
}

const HERO_NAME = "ADARSH SINGH";

const BADGES = [
  { label: "B.Tech IT @ JSS", meta: "CGPA: 7.54" },
  { label: "LeetCode Knight", meta: "Peak 1868 · More than 600 Problem Solved" },
  { label: "GDSC Core Web Lead", meta: "Google Developer Student Clubs" },
];

export function HeroSection({ isLoaded = false }: HeroSectionProps) {
  const { playWhoosh, playHover } = useCyberSounds();

  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);

  // Scramble state
  const [displayText, setDisplayText] = useState(HERO_NAME);
  const [scrambleDone, setScrambleDone] = useState(false);

  // Name container Parallax states
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 22, mass: 0.6 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // 1. Name Scramble Decryption Effect
  useEffect(() => {
    if (!isLoaded) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$/%_";
    const target = HERO_NAME;
    let iterations = 0;

    const interval = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return target[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterations += 0.8;

      if (iterations >= target.length) {
        clearInterval(interval);
        setDisplayText(target);
        setScrambleDone(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isLoaded]);

  // 2. GSAP character reveal entrance (runs after scramble completes)
  useEffect(() => {
    if (!isLoaded || !scrambleDone || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Letters slot up from hidden container
      gsap.from(".hero-char", {
        y: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.02,
        ease: "power4.out",
        clearProps: "all",
      });

      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          clearProps: "all",
        });
      }

      if (badgesRef.current) {
        gsap.from(Array.from(badgesRef.current.children), {
          opacity: 0,
          y: 15,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.5,
          clearProps: "all",
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 15,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.7,
          clearProps: "all",
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [isLoaded, scrambleDone]);

  // 3. Mouse spotlight mask movement
  useEffect(() => {
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const layer = maskLayerRef.current;
        const section = sectionRef.current;
        if (!layer || !section) return;

        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const mask = `radial-gradient(circle 260px at ${x}px ${y}px, black 20%, transparent 75%)`;
        layer.style.webkitMaskImage = mask;
        (layer.style as unknown as { maskImage: string }).maskImage = mask;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 4. Parallax shift listener
  useEffect(() => {
    const handleParallax = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30; // -15px to 15px
      const y = (e.clientY / innerHeight - 0.5) * 30; // -15px to 15px
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleParallax, { passive: true });
    return () => window.removeEventListener("mousemove", handleParallax);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-32 pb-10 z-10 bg-[#050505]"
    >
      <motion.div
        ref={wrapperRef}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="text-center w-full max-w-7xl mx-auto flex flex-col items-center"
      >
        {/* Name: Base layer + White reveal layer + Parallax container */}
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="relative mb-10 cursor-crosshair select-none whitespace-nowrap w-full flex justify-center"
        >
          {/* Base: Dimmed Gray Name */}
          <h1
            aria-label={HERO_NAME}
            className="text-[9.5vw] font-black tracking-tighter leading-none text-neutral-800 text-center uppercase"
          >
            {displayText.split("").map((char, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden"
                style={{ lineHeight: "0.9" }}
              >
                <span
                  className="hero-char inline-block"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h1>

          {/* Spotlight layer: revealed by mouse radial mask */}
          <div
            ref={maskLayerRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none flex justify-center items-center"
            style={{ WebkitMaskImage: "none" }}
          >
            <h1 className="text-[9.5vw] font-black tracking-tighter leading-none text-white text-center uppercase">
              {displayText.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
          </div>
        </motion.div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-neutral-400 font-medium tracking-tight mb-16 max-w-2xl"
        >
          Architecting <span className="text-white font-bold">High-Throughput AI</span> &amp; Distributed Systems.
        </p>

        {/* Monochromatic Badges */}
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-4 mb-16">
          {BADGES.map((b) => (
            <div
              key={b.label}
              onMouseEnter={playHover}
              className="px-6 py-3 rounded-none bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-default"
            >
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                {b.label}
              </span>
              <span className="text-xs text-neutral-600 group-hover:text-neutral-400 ml-2 transition-colors">
                / {b.meta}
              </span>
            </div>
          ))}
        </div>

        {/* Monochromatic Magnetic CTA */}
        <div ref={ctaRef}>
          <MagneticPull strength={0.3}>
            <a
              href="/Adarsh_Singh_Software_Engineer_2027.pdf"
              download
              onClick={playWhoosh}
              onMouseEnter={playHover}
              className="group inline-flex items-center gap-3 px-10 py-5 border border-white/10 hover:border-white text-white rounded-none font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 relative overflow-hidden bg-white/[0.01] hover:bg-white/[0.04] interactive"
            >
              <span className="relative z-10">Download Résumé</span>
              <FiDownload className="relative z-10 text-xl group-hover:translate-y-0.5 transition-transform" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </a>
          </MagneticPull>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown className="text-white text-xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
