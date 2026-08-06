"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCyberSounds } from "@/hooks/useCyberSounds";

interface TelemetryLine {
  label: string;
  value: string;
}

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  techStack: string;
  systemCheck: string;
  telemetry: TelemetryLine[];
}

const PROJECTS: Project[] = [
  {
    title: "Auroth",
    subtitle: "Autonomous Multi-Agent GitHub Issue Resolver",
    description:
      "Rust-based async agent-orchestration state machine that autonomously plans, codes, tests, and opens production GitHub PRs end-to-end — achieving a 100% resolve rate with automatic 3-attempt retry logic and multi-provider LLM failover.",
    image: "/projects/Auroth.png",
    link: "https://auroth.vercel.app/",
    techStack: "Rust / Axum / Next.js / PostgreSQL / Redis / E2B",
    systemCheck: "SYS_INIT // AUTONOMOUS AGENT ONLINE",
    telemetry: [
      { label: "Benchmark Resolve Rate", value: "100%" },
      { label: "LLM Failover Providers", value: "4" },
      { label: "Auto-Retry Logic", value: "3 attempts" },
    ],
  },
  {
    title: "Isolyth",
    subtitle: "Sandboxed MCP Tool Server for AI Agents",
    description:
      "Production-grade MCP tool server enabling AI agents to safely execute real-world tools via a WASM-sandboxed (wasmtime) engine enforcing memory limits, instruction fueling, and wall-clock timeouts — hardened against SSRF and path-traversal.",
    image: "/projects/Isolyth.png",
    link: "https://isolyth.vercel.app/",
    techStack: "Python / WASM (wasmtime) / Redis / PostgreSQL / Docker",
    systemCheck: "SYS_INIT // WASM SANDBOX SECURED",
    telemetry: [
      { label: "Throughput", value: "535–600 req/s" },
      { label: "Error Rate", value: "0%" },
      { label: "Sandbox Overhead", value: "15–30ms" },
    ],
  },
  {
    title: "Multi-Agent Orchestrator",
    subtitle: "LangGraph System with Human Governance",
    description:
      "Supervisor-worker multi-agent engine coordinating 4 specialized agents (Research, Analysis, Writer, Human-Review) with PostgreSQL-backed checkpointing for full crash-recovery and a human-in-the-loop escalation mechanism.",
    image: "/projects/Multi-Agent%20Orchestrator.png",
    link: "https://multi-agent-orchestration-system-ui.vercel.app/",
    techStack: "Python / LangGraph / PostgreSQL / Redis / Celery / FastAPI / Next.js",
    systemCheck: "SYS_INIT // SUPERVISOR-WORKER MESH LIVE",
    telemetry: [
      { label: "Autonomous Task Completion", value: "100%" },
      { label: "Crash-Recovery Rate", value: "100%" },
      { label: "Escalation Accuracy", value: "0% false-positive" },
    ],
  },
  {
    title: "OckhamGrid",
    subtitle: "Algorithmic Intelligence Platform",
    description:
      "Autonomous, secure, and sub-millisecond AI AST Engine built with Zero-Trust Sandboxing to automate complex codebase refactoring and PR merges.",
    image: "/projects/OckhamGrid.png",
    link: "https://ockham-grid.vercel.app/",
    techStack: "AI AST Engine / Zero-Trust Sandbox / Live Telemetry",
    systemCheck: "SYS_INIT // AUTONOMOUS ENGINE ONLINE",
    telemetry: [
      { label: "Cloud Savings", value: "$142K+" },
      { label: "CPU Hrs Reclaimed", value: "3,820h" },
      { label: "Sandbox Pass Rate", value: "99.8%" },
    ],
  },
  {
    title: "Vyzrox",
    subtitle: "Next-Gen Architecture",
    description:
      "High-performance distributed system architecture designed for absolute scale and reliability.",
    image: "/projects/Vyzrox.png",
    link: "https://vyzrox.vercel.app/",
    techStack: "Next.js / WebGL / Distributed Systems / Rust / WebAssembly",
    systemCheck: "SYS_INIT // NO CLOUD // NO LATENCY",
    telemetry: [
      { label: "Peak Performance", value: "Sub-Millisecond" },
      { label: "System Architecture", value: "Distributed / No Cloud" },
    ],
  },
  {
    title: "Q-Ecosystem",
    subtitle: "B2B SaaS Platform",
    description:
      "Architected 4 micro-apps via Turborepo monorepo. Enforced strict PostgreSQL Row Level Security (RLS) and Role-Based Access Control (RBAC) multi-tenant infrastructure.",
    image: "/projects/q-ecosystem.png",
    link: "https://www.qrento.in",
    techStack: "Turborepo / Next.js / PostgreSQL / Prisma / Tailwind",
    systemCheck: "SYS_INIT // SECURE B2B PORTAL DEPLOYED",
    telemetry: [
      { label: "p99 Latency", value: "< 80ms" },
      { label: "FCP Speed Index", value: "< 200ms" },
      { label: "Service Uptime", value: "99.9%" },
    ],
  },
  {
    title: "AI Resume Builder",
    subtitle: "Generative Platform",
    description:
      "Delivered sub-second first-token latency with streaming LLM completions. Slashed server-side PDF rendering memory consumption by 40% using optimized canvas pipelines.",
    image: "/projects/resume-builder.png",
    link: "https://ai-resume-builder-theta-azure.vercel.app",
    techStack: "Next.js / Gemini AI / Canvas / Node.js",
    systemCheck: "SYS_INIT // GENERATIVE AI PIPELINE",
    telemetry: [
      { label: "First Token", value: "< 1.0s" },
      { label: "ATS Extract Accuracy", value: "92%" },
      { label: "Node Heap Delta", value: "−40%" },
    ],
  },
  {
    title: "PawAlert",
    subtitle: "Gov-Tech Infrastructure",
    description:
      "Scaled Node.js clustered socket gateways to handle massive concurrent WebSocket connections. Re-architected PostGIS geospatial indexing for zero data loss webhook ingestion.",
    image: "/projects/pawalert.png",
    link: "https://www.pawalert.in",
    techStack: "Node.js / WebSockets / PostGIS / Redis",
    systemCheck: "SYS_INIT // GOV-TECH GATEWAY ONLINE",
    telemetry: [
      { label: "Active WebSockets", value: "5,000+" },
      { label: "PostGIS Latency", value: "sub-50ms" },
      { label: "Sync Staleness", value: "−80%" },
    ],
  },
];

// Sequential typewriter terminal line reveal component
function TypewriterLine({
  text,
  active,
  delay = 0,
  className = "text-neutral-400",
  speed = 12,
}: {
  text: string;
  active: boolean;
  delay?: number;
  className?: string;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      return;
    }

    let timer: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      let i = 0;
      setDisplayedText("");
      timer = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(timer);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
    };
  }, [text, active, delay, speed]);

  return (
    <div className={`font-mono text-[11px] md:text-xs tracking-wider leading-relaxed ${className}`}>
      {displayedText}
      {active && displayedText.length < text.length && (
        <span className="animate-pulse bg-[#FAFAFA] w-1 h-3.5 inline-block ml-1 align-middle" />
      )}
    </div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { playWhoosh, playHover } = useCyberSounds();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = sectionRefs.current;
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, index) => {
      if (!section) return;

      const img = section.querySelector(".project-img");
      if (!img) return;

      // Pin the section and scale the background image down from 1.3 to 1.0
      const anim = gsap.fromTo(img,
        { scale: 1.3 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            onToggle: (self) => {
              if (self.isActive) {
                setActiveIndex(index);
              }
            },
          },
        }
      );

      if (anim.scrollTrigger) {
        triggers.push(anim.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} id="projects" className="relative bg-[#050505] w-full z-20">
      {/* Vertically stacked full-screen sections */}
      {PROJECTS.map((project, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={project.title}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="relative w-full h-screen overflow-hidden border-b border-[#FAFAFA]/10 bg-[#050505]"
          >
            {/* Massive background image container with explore cursor trigger */}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="explore"
              onClick={playWhoosh}
              onMouseEnter={playHover}
              className="absolute inset-0 block w-full h-full overflow-hidden"
            >
              <div className="relative w-full h-full bg-[#050505]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="project-img object-cover w-full h-full scale-[1.3] opacity-30 hover:opacity-45 transition-opacity duration-700"
                />
                {/* Heavy monochromatic overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-[#050505]/80 pointer-events-none" />
              </div>
            </a>

            {/* Brutalist Content Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Project Identity & Copy */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block">
                    PROJECT // 0{index + 1}
                  </span>

                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.h3
                          initial={{ y: "100%" }}
                          animate={{ y: "0%" }}
                          exit={{ y: "-100%" }}
                          transition={{ type: "spring", stiffness: 280, damping: 24 }}
                          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none text-[#FAFAFA] whitespace-nowrap"
                        >
                          {project.title}
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-sm font-mono uppercase tracking-widest text-[#FAFAFA]">
                    <TypewriterLine text={project.subtitle} active={isActive} delay={300} className="text-[#FAFAFA]" />
                  </div>

                  <div className="border-l border-[#FAFAFA]/10 pl-6 py-2">
                    <div className="text-sm md:text-base text-neutral-400 leading-relaxed font-mono">
                      <TypewriterLine text={project.description} active={isActive} delay={600} className="text-neutral-400" />
                    </div>
                  </div>

                  <div className="pointer-events-auto mt-4 inline-block">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playWhoosh}
                      onMouseEnter={playHover}
                      className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#FAFAFA] border-b border-[#FAFAFA]/25 hover:border-[#FAFAFA] transition-colors pb-1 interactive"
                    >
                      LAUNCH PROTOTYPE ↗
                    </a>
                  </div>
                </div>

                {/* Right Column: Typewriter Terminal Telemetry */}
                <div className="lg:col-span-5 flex justify-end">
                  <div className="w-full max-w-[420px] bg-[#050505] border border-[#FAFAFA]/15 p-5 font-mono space-y-4 pointer-events-auto select-none rounded-none">
                    {/* Terminal Header */}
                    <div className="flex justify-between items-center border-b border-[#FAFAFA]/10 pb-2 text-[9px] text-neutral-500 uppercase tracking-[0.2em]">
                      <span>SYS_TELEMETRY // 0{index + 1}</span>
                      <span>STATUS: RUNNING</span>
                    </div>

                    {/* Sequential Terminal Log Rows */}
                    <div className="space-y-3">
                      <TypewriterLine
                        text={project.systemCheck}
                        active={isActive}
                        delay={900}
                        className="text-neutral-500"
                        speed={8}
                      />
                      <TypewriterLine
                        text={`CORE_STACK: ${project.techStack}`}
                        active={isActive}
                        delay={1200}
                        className="text-neutral-300"
                        speed={10}
                      />
                      
                      <div className="border-t border-[#FAFAFA]/10 my-3 pt-3 space-y-2">
                        {project.telemetry.map((t, i) => (
                          <div key={t.label} className="flex justify-between items-center text-xs">
                            <TypewriterLine
                              text={`> ${t.label}`}
                              active={isActive}
                              delay={1500 + i * 250}
                              className="text-neutral-400"
                              speed={10}
                            />
                            <TypewriterLine
                              text={t.value}
                              active={isActive}
                              delay={1700 + i * 250}
                              className="text-[#FAFAFA] font-bold"
                              speed={10}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
