"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ═══════════════════════════════════════════════════════════════════
// CERTIFICATIONS DATA
// ═══════════════════════════════════════════════════════════════════
const CERTS = [
  {
    title: "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    tag: "CLOUD · AI",
    year: "2025",
  },
  {
    title: "DeepLearning.AI: Building AI Voice Agents",
    tag: "DEEP LEARNING · VOICE",
    year: "2024",
  },
  {
    title: "Google Cloud: Intro to Generative AI",
    tag: "GCP · GENERATIVE AI",
    year: "2024",
  },
];

// ═══════════════════════════════════════════════════════════════════
// FLOATING CERT CARD — with mouse-following radial glow border
// ═══════════════════════════════════════════════════════════════════
function CertCard({
  cert,
  index,
}: {
  cert: (typeof CERTS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Mouse-following glow border effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !glowRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      data-cert-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cert-card relative w-full max-w-2xl mx-auto cursor-default group"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card body */}
      <div
        className="relative bg-white/[0.015] border border-white/5 group-hover:border-white/20 transition-all duration-500 p-8 md:p-12 rounded-none overflow-hidden"
        style={{
          transform: "rotateX(2deg) rotateY(0deg)",
          transition: "transform 0.4s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.style.transform =
            index % 2 === 0
              ? "rotateX(-2deg) rotateY(3deg)"
              : "rotateX(-2deg) rotateY(-3deg)");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "rotateX(2deg) rotateY(0deg)";
        }}
      >
        {/* Mouse-following glow overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-[1px] bg-white/15 group-hover:bg-white/40 transition-colors duration-500" />
        <div className="absolute top-0 left-0 w-[1px] h-12 bg-white/15 group-hover:bg-white/40 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-white/15 group-hover:bg-white/40 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-white/15 group-hover:bg-white/40 transition-colors duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            {/* Tag */}
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-3">
              {cert.tag}
            </span>

            {/* Title */}
            <h4 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight text-neutral-300 group-hover:text-white transition-colors duration-300">
              {cert.title}
            </h4>
          </div>

          {/* Year badge */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 border border-white/10 group-hover:border-white/30 rounded-none flex items-center justify-center transition-all duration-500 group-hover:bg-white/[0.03]">
              <span className="text-2xl font-black text-neutral-500 group-hover:text-white transition-colors duration-300">
                {cert.year}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-800 group-hover:bg-white/30 transition-colors duration-500" />
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
      // ── Section heading letter stagger ──
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

      // ── GDSC card slides in from left ──
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

      // ── Cert cards: alternating slide-in from left/right ──
      const certCards = document.querySelectorAll(".cert-card");
      certCards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;

        gsap.from(card, {
          x: fromLeft ? -150 : 150,
          y: 60,
          opacity: 0,
          rotateY: fromLeft ? -8 : 8,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });
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

        {/* ── Certifications Vault ── */}
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-2 text-center">
            [ THE VAULT ]
          </span>
          <h3 className="text-3xl md:text-5xl font-black mb-16 text-center text-neutral-500 uppercase tracking-tighter">
            CERTIFICATIONS
          </h3>
        </div>

        {/* ── Floating 3D Cert Cards ── */}
        <div className="flex flex-col gap-8">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
