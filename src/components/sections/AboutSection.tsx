"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariableProximity from "@/components/VariableProximity";

// ═══════════════════════════════════════════════════════════════════
// MARQUEE DATA
// ═══════════════════════════════════════════════════════════════════
const TECH_STACK = [
 "LLMs", "RAG Pipeline", "LangChain", "OpenAI API", "Google Gemini", 
  "VectorDB", "Prompt Engineering", "Agentic AI", "Hugging Face",

  // ⚡ High-Throughput Backend & Architecture (CTO Vibe)
  "Node.js", "Python", "WebSockets", "Microservices", "System Design", 
  "Distributed Systems", "Kafka", "gRPC", "GraphQL", "REST APIs",

  // 🗄️ Databases, ORMs & Caching
  "PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "Supabase", "Atlas Vector Search",

  // 🌐 Modern Frontend & 3D (The Eye-Candy)
  "Next.js 14", "React", "TypeScript", "Tailwind CSS", "WebGL", 
  "Three.js", "Framer Motion", "GSAP",

  // 🛠️ DevOps, Cloud & Tooling
  "Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Turborepo", "Git",

  // 🏆 Core CS (Flexing the LeetCode Knight Status)
  "C++", "Data Structures", "Algorithms", "Dynamic Programming"
];

// ═══════════════════════════════════════════════════════════════════
// STAGGER CONTAINER VARIANT
// ═══════════════════════════════════════════════════════════════════
const gridContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 16,
      mass: 0.8,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// INFINITE MARQUEE
// ═══════════════════════════════════════════════════════════════════
function TechMarquee() {
  const items = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="overflow-hidden w-full relative">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-6 whitespace-nowrap"
        style={{
          animation: "marquee-scroll 30s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center gap-2 text-sm md:text-base font-bold uppercase tracking-[0.15em] text-neutral-500 hover:text-white transition-colors duration-200 cursor-default py-2"
          >
            <span className="w-1.5 h-1.5 bg-neutral-600 rounded-none inline-block" />
            {tech}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// METRIC BENTO CARD — massive numbers with whileHover tilt
// ═══════════════════════════════════════════════════════════════════
function MetricCard({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{
        scale: 1.05,
        rotate: -1,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
      className={`relative bg-white/[0.015] border border-white/5 hover:border-white/25 transition-colors duration-300 p-6 md:p-8 rounded-none overflow-hidden cursor-default group ${className}`}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-white/20" />
      <div className="absolute top-0 left-0 w-[1px] h-8 bg-white/20" />
      <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-white/20" />
      <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-white/20" />

      {/* Massive number */}
      <div className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none text-white tracking-tight mb-2 group-hover:text-white transition-colors">
        {value}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
        {label}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ABOUT SECTION — High-impact 3-column recruiter bento grid
// ═══════════════════════════════════════════════════════════════════
export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  // ── GSAP scroll-exit: fade + scale as About scrolls out ────────────────────
  // STRICT RULE: this ref targets a plain <div> with NO Framer Motion props.
  // The inner motion.* elements (heading, grid cards) are untouched.
  // Mobile: effect disabled entirely (matches Hero behaviour).
  // prefers-reduced-motion: scale skipped, opacity still fades (not motion).
  const aboutExitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = containerRef.current;
    const wrapper = aboutExitRef.current;
    if (!section || !wrapper) return;

    const mobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile) return; // no scroll-fade on mobile — matches Hero guard

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    tl.to(wrapper, {
      opacity: 0,
      // Scale skipped under prefers-reduced-motion — matches Hero guard
      ...(reducedMotion ? {} : { scale: 0.95, transformOrigin: "center center" }),
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 md:py-32 px-4 md:px-12 lg:px-20 z-10 overflow-hidden bg-[#050505]"
    >
      {/* Plain GSAP wrapper — scrubs opacity/scale on scroll-out.
          NO Framer Motion props here. Inner motion.* elements are untouched. */}
      <div ref={aboutExitRef} style={{ willChange: "opacity, transform" }}>
      <div className="max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-600 mb-4 block">
            [ 01 / ABOUT ]
          </span>
          <div className="flex flex-col leading-none mb-10 z-10 relative">
            <VariableProximity
              label="BUILDING THE"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-black text-white tracking-tighter uppercase"
              fromFontVariationSettings="'wght' 300"
              toFontVariationSettings="'wght' 900"
              containerRef={containerRef}
              radius={200}
              falloff="linear"
            />
            <VariableProximity
              label="FUTURE STACK"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-black text-gray-600 tracking-tighter uppercase"
              fromFontVariationSettings="'wght' 300"
              toFontVariationSettings="'wght' 900"
              containerRef={containerRef}
              radius={200}
              falloff="linear"
            />
          </div>
        </motion.div>

        {/* ── 3-Column Bento Grid ── */}
        <motion.div
          ref={gridRef}
          variants={gridContainerVariant}
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {/* ─── Row 1 ─── */}

          {/* Bio Card — Spans 2 columns */}
          <motion.div
            variants={cardVariant}
            whileHover={{
              scale: 1.02,
              rotate: -0.5,
              transition: { type: "spring", stiffness: 300, damping: 15 },
            }}
            className="lg:col-span-2 relative bg-white/[0.015] border border-white/5 hover:border-white/25 transition-colors duration-300 p-8 md:p-10 rounded-none overflow-hidden flex flex-col justify-between min-h-[280px] cursor-default group"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-10 h-[1px] bg-white/20" />
            <div className="absolute top-0 left-0 w-[1px] h-10 bg-white/20" />
            <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-white/20" />
            <div className="absolute bottom-0 right-0 w-[1px] h-10 bg-white/20" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-5">
                BIO
              </span>
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-neutral-300 leading-relaxed max-w-2xl">
                I&apos;m a Final year B.Tech IT student at{" "}
                <span className="text-white font-bold">JSS Academy</span> and{" "}
                <span className="text-white font-bold">
                  GDSC Core Web Lead
                </span>
                . I don&apos;t just write code; I architect high-throughput
                distributed systems. From building ACID-safe transaction engines
                handling{" "}
                <span className="text-white font-black">10,000+ msgs/sec</span>{" "}
                to optimizing LLM pipelines that slash cloud costs by{" "}
                <span className="text-white font-black">$142K+</span>, I
                specialize in taking enterprise infrastructure from{" "}
                <span className="text-white font-black">0 to 1</span>.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-none animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Enterprise-Grade Full-Stack
              </span>
            </div>
          </motion.div>

          {/* Metric Card 1 — Top Right: 10K+ msgs/sec */}
          <MetricCard value="10K+" label="MSGS/SEC PROCESSED" />

          {/* ─── Row 2 ─── */}

          {/* Metric Card 2 — Bottom Left: LeetCode Peak */}
          <MetricCard value="1868" label="LEETCODE PEAK (KNIGHT)" />

          {/* Metric Card 3 — Bottom Center: Cloud Costs Saved */}
          <MetricCard value="$142K+" label="CLOUD COSTS SAVED" />

          {/* Metric Card 4 — Bottom Right: System Uptime */}
          <MetricCard value="99.99%" label="SYSTEM UPTIME ENGINEERED" />

          {/* ─── Row 3: Tech Marquee (Full Width) ─── */}
          <motion.div
            variants={cardVariant}
            className="lg:col-span-3 relative bg-white/[0.015] border border-white/5 hover:border-white/15 transition-colors duration-300 py-6 px-4 rounded-none overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-white/20" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-4 px-2">
              CORE STACK
            </span>
            <TechMarquee />
          </motion.div>
        </motion.div>
      </div> {/* max-w-6xl */}
      </div> {/* aboutExitRef GSAP wrapper */}
    </section>
  );
}
