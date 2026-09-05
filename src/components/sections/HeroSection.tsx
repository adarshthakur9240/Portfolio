"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";
import { MagneticPull } from "@/components/ui/MagneticPull";
import { FiDownload } from "react-icons/fi";
import RotatingText from "@/components/RotatingText";
import { Vampiro_One, Black_Ops_One } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const vampiroOne = Vampiro_One({ weight: "400", subsets: ["latin"], display: "swap" });
const blackOpsOne = Black_Ops_One({ weight: "400", subsets: ["latin"], display: "swap" });

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════
// 3D WIREFRAME TORUS — continuous rotation behind hero text
// ═══════════════════════════════════════════════════════════════════
function WireframeTorus() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;
      meshRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={3.2}>
        <torusGeometry args={[1, 0.4, 36, 72]} />
        <meshBasicMaterial
          color="#FAFAFA"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ABSTRACT NODES — scattered points with slow rotation
// ═══════════════════════════════════════════════════════════════════
function AbstractNodes({ count = 90 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x += delta * 0.025;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FAFAFA"
          size={0.03}
          transparent
          opacity={0.12}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HERO CANVAS — wraps WebGL background
// ═══════════════════════════════════════════════════════════════════
function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <WireframeTorus />
          <AbstractNodes count={90} />
          <ambientLight intensity={0.15} />
        </Suspense>
      </Canvas>
    </div>
  );
}

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
  { label: "B.TECH IT @ JSS", meta: "CGPA 7.56" },
  { label: "LEETCODE KNIGHT", meta: "Peak 1868 · 650+ Solved" },
  { label: "GDSC CORE WEB LEAD", meta: "GDSC" },
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
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Scroll-out: Hero content fades + scales down as section exits viewport.
  // Desktop only + respects prefers-reduced-motion.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const mobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile) return; // leave mobile untouched

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,      // slight lag for weighted feel
      },
    });

    tl.to(content, {
      opacity: 0,
      // Scale is a depth cue; skip it for reduced-motion users
      ...(reducedMotion ? {} : { scale: 0.92 }),
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nameChars = HERO_NAME.split("");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20 pb-10 z-10 bg-[#050505]"
    >
      {/* ── 3D WebGL Background ── */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ x: bgParallaxX, y: bgParallaxY }}
        >
          <HeroCanvas />
        </motion.div>
      )}

      {/* ── Content Layer ── */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            ref={contentRef}
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
                className={`text-[12vw] md:text-[12vw] font-black tracking-tighter leading-[0.85] text-neutral-800 text-center uppercase ${vampiroOne.className}`}
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
                  className={`text-[12vw] md:text-[12vw] font-black tracking-tighter leading-[0.85] text-white text-center uppercase ${vampiroOne.className}`}
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
              {BADGES.map((b, i) => {
                /* ── Per-badge shape config ── */
                const badgeShapes = [
                  {
                    /* Badge 0: top-right corner clipped, bracket label prefix */
                    clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                    px: "px-5 py-3",
                    border: "border-2 border-white/15",
                    labelPrefix: "[ ",
                    labelSuffix: " ]",
                  },
                  {
                    /* Badge 1: bottom-left corner clipped, wider */
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                    px: "px-7 py-4",
                    border: "border-2 border-white/15",
                    labelPrefix: "",
                    labelSuffix: "",
                  },
                  {
                    /* Badge 2: left accent bar instead of full border, no clip */
                    clipPath: "none",
                    px: "px-5 py-3",
                    border: "border-l-4 border-l-white/60 border-t border-t-white/10 border-r border-r-white/10 border-b border-b-white/10",
                    labelPrefix: "",
                    labelSuffix: "",
                  },
                ];
                const shape = badgeShapes[i];
                return (
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
                      scale: 1.1,
                      color: "#050505",
                      boxShadow: "6px 6px 0px 0px #FAFAFA",
                      transition: { duration: 0.15 },
                    }}
                    onMouseEnter={playHover}
                    className={`relative ${shape.px} rounded-none bg-white/[0.02] ${shape.border} cursor-default group overflow-hidden`}
                    style={{
                      color: "#FAFAFA",
                      clipPath: shape.clipPath !== "none" ? shape.clipPath : undefined,
                    }}
                  >
                    {/* Scanline hover fill — diagonal hatch, appears on group-hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                      style={{
                        background:
                          "repeating-linear-gradient(-45deg, #FAFAFA 0px, #FAFAFA 1px, transparent 1px, transparent 6px)",
                      }}
                    />
                    {/* Solid white base fill — also appears on hover under the hatch */}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-white/80"
                    />
                    <span className={`relative z-10 text-xs uppercase tracking-[0.15em] group-hover:text-black transition-colors duration-150 ${blackOpsOne.className}`}>
                      {shape.labelPrefix}{b.label}{shape.labelSuffix}
                    </span>
                    <span className={`relative z-10 text-[10px] text-neutral-400 group-hover:text-neutral-700 ml-2 transition-colors duration-150 ${blackOpsOne.className}`}>
                      / {b.meta}
                    </span>
                  </motion.div>
                );
              })}
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
                {/* DOWNLOAD RÉSUMÉ — top-right corner clipped, Black Ops One, scanline hover */}
                <a
                  href="/Adarsh_Singh_Software_Engineer_2027.pdf"
                  download
                  onClick={playWhoosh}
                  onMouseEnter={playHover}
                  className={`hero-cta-btn group inline-flex items-center gap-3 px-10 py-5 border-2 border-white/20 text-white rounded-none uppercase tracking-[0.2em] text-sm relative overflow-hidden bg-transparent transition-colors duration-[0ms] ${blackOpsOne.className}`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}
                >
                  {/* Scanline hover fill */}
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(-45deg, #FAFAFA 0px, #FAFAFA 1px, transparent 1px, transparent 6px)",
                    }}
                  />
                  <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-white/85" />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-150">Download Résumé</span>
                  <FiDownload className="relative z-10 text-xl group-hover:translate-y-0.5 group-hover:text-black transition-all duration-150" />
                </a>
              </MagneticPull>

              {/* HIRE ME — bottom-left corner clipped, Black Ops One, scanline hover */}
              <motion.a
                href={mailtoHref}
                target="_self"
                className={`relative flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white tracking-[0.2em] text-sm overflow-hidden group ${blackOpsOne.className}`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                }}
                whileHover={{ scale: 1.05, boxShadow: "6px 6px 0px 0px #FAFAFA" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Scanline hover fill */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(-45deg, #FAFAFA 0px, #FAFAFA 1px, transparent 1px, transparent 6px)",
                  }}
                />
                <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-white/85" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-150 flex items-center gap-3">
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