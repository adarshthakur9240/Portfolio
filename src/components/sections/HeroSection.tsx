"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";
import { MagneticPull } from "@/components/ui/MagneticPull";
import { FiDownload } from "react-icons/fi";
import RotatingText from "@/components/RotatingText";
import dynamic from "next/dynamic";

// ── Phase 2: 3D Hero Scene — lazy-loaded, no SSR ──
const DynamicHeroScene = dynamic(
  () => import("@/components/webgl/HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => null }
);



// ═══════════════════════════════════════════════════════════════════
// CHARACTER-LEVEL SPRING ANIMATION VARIANT
// ═══════════════════════════════════════════════════════════════════
const charContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const charVariant = {
  hidden: {
    y: 120,
    opacity: 0,
    rotateX: -25,
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
      mass: 0.9,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════
interface HeroSectionProps {
  isLoaded?: boolean;
}

const HERO_NAME = "ADARSH SINGH";

const BADGES = [
  { label: "B.TECH IT @ JSS", meta: "CGPA 7.54" },
  { label: "LEETCODE KNIGHT", meta: "Peak 1868 · 600+ Solved" },
  { label: "GDSC CORE WEB LEAD", meta: "Google DSC" },
];

export function HeroSection({ isLoaded = false }: HeroSectionProps) {
  const mailSubject = encodeURIComponent("Interview Invitation: Software Engineering Opportunity - Adarsh Singh");
  const mailBody = encodeURIComponent(`Hi Adarsh,

I've reviewed your portfolio and was impressed by your technical work. We would like to invite you for an interview to discuss potential opportunities.

Are you available for a chat during the upcoming week?

Best regards,
[Recruiter Name]`);
  const mailtoHref = `mailto:singhadadarsh9240@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  const { playWhoosh, playHover } = useCyberSounds();

  const sectionRef = useRef<HTMLElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 45, damping: 22, mass: 0.7 };
  const parallaxX = useSpring(mouseX, springCfg);
  const parallaxY = useSpring(mouseY, springCfg);
  const bgParallaxX = useTransform(parallaxX, (v) => -v * 1.8);
  const bgParallaxY = useTransform(parallaxY, (v) => -v * 1.8);

  // Mobile check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mouse spotlight mask
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
        const mask = `radial-gradient(circle 300px at ${x}px ${y}px, black 15%, transparent 70%)`;
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

  // Parallax listener
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 50);
      mouseY.set((e.clientY / innerHeight - 0.5) * 35);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const nameChars = HERO_NAME.split("");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20 pb-10 z-10 bg-[#050505]"
    >
      {/* ── Phase 2: 3D Hero Scene ──
          Parallax wrapper only active on desktop; HeroScene handles its own
          mobile / low-end / prefers-reduced-motion guards internally. */}
      <motion.div
        className="absolute inset-0 z-0"
        style={!isMobile ? { x: bgParallaxX, y: bgParallaxY } : undefined}
      >
        <DynamicHeroScene />
      </motion.div>

      {/* ── Content Layer ── */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center w-full max-w-7xl mx-auto flex flex-col items-center"
          >
            {/* ════════════════════════════════════════════════════
                MASSIVE NAME — 12vw, character-by-character spring
               ════════════════════════════════════════════════════ */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              className="relative mb-4 cursor-crosshair select-none w-full"
            >
              {/* Base: dimmed layer */}
              <motion.h1
                variants={charContainerVariant}
                initial="hidden"
                animate="visible"
                aria-label={HERO_NAME}
                className="text-[12vw] md:text-[12vw] font-black tracking-tighter leading-[0.85] text-neutral-800 text-center uppercase"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {nameChars.map((char, i) => (
                  <motion.span
                    key={i}
                    variants={charVariant}
                    className="inline-block"
                    style={{
                      whiteSpace: char === " " ? "pre" : "normal",
                      perspective: "600px",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Spotlight mask layer — pure white revealed by mouse */}
              <div
                ref={maskLayerRef}
                aria-hidden
                className="absolute inset-0 pointer-events-none flex justify-center items-center"
                style={{ WebkitMaskImage: "none" }}
              >
                <h1
                  className="text-[12vw] md:text-[12vw] font-black tracking-tighter leading-[0.85] text-white text-center uppercase"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {nameChars.map((char, i) => (
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

            {/* ════════════════════════════════════════════════════
                SUBTITLE
               ════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="flex flex-row items-center justify-center gap-3 text-lg sm:text-xl md:text-2xl font-medium mt-6 mb-8"
            >
              {/* Static Text - Forced to stay on one line */}
              <span className="text-gray-400 whitespace-nowrap">Architecting</span>
              
              {/* Quarantine Wrapper - Isolates the animation physics from the flex layout */}
              <div className="relative flex items-center h-[35px] sm:h-[45px] overflow-hidden">
                <RotatingText
                  texts={[
                    'High-Throughput AI',
                    'Distributed Systems',
                    'Sub-Millisecond APIs'
                  ]}
                  mainClassName="text-white font-bold whitespace-nowrap"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={3000}
                />
              </div>
            </motion.div>

            {/* ════════════════════════════════════════════════════
                FLOATING INTERACTIVE BADGES
                → Scale up, invert colors, brutalist shadow on hover
               ════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {BADGES.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.9 + i * 0.12,
                    type: "spring",
                    stiffness: 130,
                    damping: 16,
                  }}
                  whileHover={{
                    scale: 1.12,
                    backgroundColor: "#FAFAFA",
                    color: "#050505",
                    boxShadow: "8px 8px 0px 0px #FAFAFA",
                    transition: { duration: 0.15 },
                  }}
                  onMouseEnter={playHover}
                  className="px-6 py-3 rounded-none bg-white/[0.02] border-2 border-white/10 cursor-default group"
                  style={{ color: "#FAFAFA" }}
                >
                  <span className="text-xs font-black uppercase tracking-[0.15em] group-hover:text-black transition-colors duration-150">
                    {b.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 group-hover:text-neutral-700 ml-2 transition-colors duration-150">
                    / {b.meta}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* ════════════════════════════════════════════════════
                CTA BUTTONS — glitch-pulse border + instant invert
               ════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="flex flex-wrap justify-center items-center gap-5"
            >
              <MagneticPull strength={0.3}>
                <a
                  href="/Adarsh_Singh_Software_Engineer_2027.pdf"
                  download
                  onClick={playWhoosh}
                  onMouseEnter={playHover}
                  className="hero-cta-btn group inline-flex items-center gap-3 px-10 py-5 border-2 border-white/20 text-white rounded-none font-black uppercase tracking-[0.2em] text-sm relative overflow-hidden bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-[0ms]"
                >
                  <span className="relative z-10">Download Résumé</span>
                  <FiDownload className="relative z-10 text-xl group-hover:translate-y-0.5 transition-transform" />
                </a>
              </MagneticPull>

              <motion.a
                href={mailtoHref}
                target="_self"
                className="relative flex items-center justify-center w-[200px] h-[55px] border border-white/50 text-white font-bold tracking-[0.2em] text-sm overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Hover Background Fill */}
                <span className="absolute inset-0 w-full h-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0"></span>
                
                {/* Text */}
                <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-3">
                  HIRE ME 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
