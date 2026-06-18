"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CERTS = [
  {
    title: "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    glow: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.3)",
  },
  {
    title: "DeepLearning.AI: Building AI Voice Agents",
    glow: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.2)",
  },
  {
    title: "Google Cloud: Intro to Generative AI",
    glow: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.15)",
  },
];

export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const gdscRef = useRef<HTMLDivElement>(null);
  const certsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section heading letter stagger
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

      // GDSC card slides in from left
      if (gdscRef.current) {
        gsap.from(gdscRef.current, {
          x: -70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gdscRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Cert monoliths rise from bottom, staggered
      if (certsRef.current) {
        gsap.from(Array.from(certsRef.current.children), {
          y: 80,
          opacity: 0,
          scaleY: 0.6,
          transformOrigin: "bottom",
          duration: 0.9,
          stagger: 0.18,
          ease: "power4.out",
          scrollTrigger: {
            trigger: certsRef.current,
            start: "top 88%",
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
        <div className="w-full flex justify-center overflow-hidden mb-20">
          <h2
            ref={headingRef}
            className="text-[clamp(2rem,6vw,6rem)] font-black uppercase tracking-tighter whitespace-nowrap text-center text-[#FAFAFA] w-full"
          >
            LEADERSHIP &amp; CERTIFICATIONS
          </h2>
        </div>

        {/* GDSC Card */}
        <div ref={gdscRef} className="relative mb-32 group mx-auto max-w-4xl">
          {/* Subtle white ambient glow */}
          <div className="absolute -inset-1 bg-white rounded-none opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500" />
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
              <span className="text-white font-bold">500+ students</span>{" "}
              and boosting participation by 40%. Led technical workshops for
              200+ attendees.
            </p>
          </div>
        </div>

        {/* Certifications Vault */}
        <h3 className="text-3xl md:text-5xl font-black mb-16 text-center text-neutral-600 uppercase tracking-widest">
          THE VAULT
        </h3>

        <div
          ref={certsRef}
          className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-10"
        >
          {CERTS.map((cert) => (
            <div
              key={cert.title}
              className="relative w-full max-w-[340px] h-[430px] flex flex-col justify-end p-8 group cursor-default"
            >
              {/* Monochromatic border */}
              <div
                className="absolute inset-0 rounded-none border border-white/5 group-hover:border-white/25 transition-colors duration-500"
              />
              
              {/* Bottom line indicator */}
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 rounded-none bg-neutral-700 group-hover:bg-white transition-colors duration-500"
              />

              {/* Inner ambient bottom gradient */}
              <div
                className="absolute inset-1 rounded-none backdrop-blur-sm opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, ${cert.glow} 0%, transparent 60%)`,
                }}
              />

              {/* Monochromatic Content */}
              <div className="relative z-10">
                <div
                  className="w-12 h-12 mb-6 rounded-none border border-white/10 group-hover:border-white/40 flex items-center justify-center transition-colors duration-500"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-none bg-white animate-pulse"
                  />
                </div>
                <h4 className="text-2xl font-black leading-tight uppercase tracking-tight text-neutral-300 group-hover:text-white transition-colors duration-300">
                  {cert.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
