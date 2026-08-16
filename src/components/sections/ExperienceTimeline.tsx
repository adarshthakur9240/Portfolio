"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

// ═══════════════════════════════════════════════════════════════════
// CERTIFICATIONS DATA — full list
// ═══════════════════════════════════════════════════════════════════
const CERTS = [
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    tag: "ORACLE · CLOUD · AI",
    year: "2025",
  },
  {
    title: "AI for You: Training and Assessment",
    tag: "ORACLE · AI",
    year: "2025",
  },
  {
    title: "Building AI Voice Agents for Production",
    tag: "DEEPLEARNING.AI · VOICE",
    year: "2025",
  },
  {
    title: "Introduction to Large Language Models",
    tag: "GOOGLE CLOUD · LLM",
    year: "2025",
  },
  {
    title: "Introduction to Generative AI",
    tag: "GOOGLE · GENERATIVE AI",
    year: "2025",
  },
  {
    title: "Program Financial Planning with ClickUp",
    tag: "COURSERA · PROGRAM MGMT",
    year: "2025",
  },
  {
    title: "Generative AI with AWS",
    tag: "ANALYTICS VIDHYA · AWS",
    year: "2025",
  },
  {
    title: "Building Data Analyst AI Agent",
    tag: "ANALYTICS VIDHYA · DATA",
    year: "2025",
  },
  {
    title: "Foundations of Data Science",
    tag: "ANALYTICS VIDHYA · DATA SCIENCE",
    year: "2025",
  },
  {
    title: "HTML, CSS, and JavaScript for Web Developers",
    tag: "JOHNS HOPKINS UNIVERSITY · WEB",
    year: "2024",
  },
];

// ═══════════════════════════════════════════════════════════════════
// CERT CARD CONTENT — reused inside each ScrollStackItem
// ═══════════════════════════════════════════════════════════════════
function CertCardContent({
  cert,
  index,
}: {
  cert: (typeof CERTS)[number];
  index: number;
}) {
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      if (!glowRef.current) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glowRef.current.style.background = `radial-gradient(
      circle 200px at ${x}px ${y}px,
      rgba(255, 255, 255, 0.12),
      transparent 70%
    )`;
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  }, []);

  return (
    <div
      data-cert-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full bg-[#050505] border border-white/10 hover:border-white/25 transition-colors duration-500 p-8 md:p-10 overflow-hidden"
    >
      {/* Mouse-following glow overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-10 h-[1px] bg-white/15" />
      <div className="absolute top-0 left-0 w-[1px] h-10 bg-white/15" />
      <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-white/15" />
      <div className="absolute bottom-0 right-0 w-[1px] h-10 bg-white/15" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 h-full">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-3">
            {cert.tag}
          </span>
          <h4 className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tight text-neutral-200">
            {cert.title}
          </h4>
        </div>

        <div className="flex-shrink-0">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
            <span className="text-lg font-black text-neutral-500">
              {cert.year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXPERIENCE TIMELINE — main export
// ═══════════════════════════════════════════════════════════════════
export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const gdscRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const raw = headingRef.current.innerText;
        headingRef.current.innerHTML = raw
          .split("")
          .map(
            (c) =>
              `<span class="inline-block overflow-hidden"><span class="exp-char inline-block">${
                c === " " ? "&nbsp;" : c
              }</span></span>`
          )
          .join("");

        gsap.from(".exp-char", {
          y: 50,
          opacity: 0,
          duration: 0.85,
          stagger: 0.02,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      if (gdscRef.current) {
        gsap.from(gdscRef.current, {
          x: -100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gdscRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-20 z-10 overflow-hidden bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto overflow-hidden w-full">
        {/* ── Section Heading ── */}
        <div className="w-full flex justify-center overflow-hidden mb-20">
          <h2
            ref={headingRef}
            className="text-[clamp(2rem,6vw,6rem)] font-black uppercase tracking-tighter whitespace-nowrap text-center text-[#FAFAFA] w-full"
          >
            LEADERSHIP &amp; CERTIFICATIONS
          </h2>
        </div>

        {/* ── GDSC Leadership Card ── */}
        <div ref={gdscRef} className="relative mb-24 group mx-auto max-w-4xl">
          <div className="absolute -inset-1 bg-white rounded-none opacity-0 group-hover:opacity-[0.03] blur-xl transition-opacity duration-500" />
          <div className="relative bg-white/[0.02] p-10 md:p-16 border-l-4 border-white border-y border-r border-white/5 rounded-none">
            <h3 className="text-4xl md:text-6xl font-black mb-3 uppercase tracking-tight text-white">
              GDSC Core Web Lead
            </h3>
            <p className="text-xl md:text-2xl font-bold text-neutral-500 mb-8 uppercase tracking-widest">
              Google Developer Student Clubs
            </p>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              Core Team Member. Engineered full-stack features, successfully
              onboarding{" "}
              <span className="text-white font-bold">500+ students</span> and
              boosting participation by 40%. Led technical workshops for 200+
              attendees.
            </p>
          </div>
        </div>

        {/* ── Certifications Vault — Scroll Stack ── */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-2 text-center">
            [ THE VAULT — {CERTS.length} CERTIFICATIONS ]
          </span>
          <h3 className="text-3xl md:text-5xl font-black mb-4 text-center text-neutral-500 uppercase tracking-tighter">
            CERTIFICATIONS
          </h3>
        </div>

        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemScale={0.025}
          itemStackDistance={24}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.88}
          rotationAmount={0.5}
          blurAmount={0.6}
        >
          {CERTS.map((cert, i) => (
            <ScrollStackItem
              key={cert.title}
              itemClassName="!h-[220px] !p-0 !rounded-none !shadow-none !bg-transparent"
            >
              <CertCardContent cert={cert} index={i} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}