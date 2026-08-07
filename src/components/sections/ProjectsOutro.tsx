"use client";

import { useEffect, useRef, useMemo, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { MagneticPull } from "@/components/ui/MagneticPull";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════
// SUBTLE PARTICLE ACCENT — reuses the AbstractNodes aesthetic
// from HeroSection so it stays visually consistent
// ═══════════════════════════════════════════════════════════════════
function OutroNodes({ count = 60 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x += delta * 0.015;
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
          size={0.025}
          transparent
          opacity={0.08}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function OutroWireframe() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.07;
      meshRef.current.rotation.y += delta * 0.11;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={4}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#FAFAFA"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </Float>
  );
}

function OutroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Suspense fallback={null}>
          <OutroWireframe />
          <OutroNodes count={60} />
          <ambientLight intensity={0.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAILTO HELPER — reuses the exact same pattern as HeroSection
// ═══════════════════════════════════════════════════════════════════
function buildMailtoHref() {
  const mailSubject = encodeURIComponent(
    "Interview Invitation: Software Engineering Opportunity - Adarsh Singh"
  );
  const mailBody = encodeURIComponent(`Hi Adarsh,

I've reviewed your portfolio and was impressed by your technical work. We would like to invite you for an interview to discuss potential opportunities.

Are you available for a chat during the upcoming week?

Best regards,
[Recruiter Name]`);
  return `mailto:singhadadarsh9240@gmail.com?subject=${mailSubject}&body=${mailBody}`;
}

// ═══════════════════════════════════════════════════════════════════
// PROJECTS OUTRO
// ═══════════════════════════════════════════════════════════════════
export function ProjectsOutro() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headline1Ref = useRef<HTMLHeadingElement>(null);
  const body1Ref = useRef<HTMLParagraphElement>(null);
  const body1ItalicRef = useRef<HTMLParagraphElement>(null);
  const headline2Ref = useRef<HTMLHeadingElement>(null);
  const body2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

  const mailtoHref = buildMailtoHref();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      if (prefersReducedMotion) {
        gsap.from(
          [
            labelRef.current,
            headline1Ref.current,
            body1Ref.current,
            body1ItalicRef.current,
            headline2Ref.current,
            body2Ref.current,
            ctaRowRef.current,
          ],
          { opacity: 0, duration: 0.6, stagger: 0.1, scrollTrigger: trigger }
        );
        return;
      }

      // Split-Type word-by-word reveal for the two big headlines
      const splitH1 = new SplitType(headline1Ref.current!, { types: "words" });
      const splitH2 = new SplitType(headline2Ref.current!, { types: "words" });

      gsap.set([...(splitH1.words ?? []), ...(splitH2.words ?? [])], {
        y: 60,
        opacity: 0,
        rotateX: -20,
        transformOrigin: "50% 0%",
        transformPerspective: 600,
      });

      gsap.set(
        [
          labelRef.current,
          body1Ref.current,
          body1ItalicRef.current,
          body2Ref.current,
          ctaRowRef.current,
        ],
        { y: 40, opacity: 0 }
      );

      // Label
      gsap.to(labelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      // Headline 1 words
      gsap.to(splitH1.words ?? [], {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.15,
        scrollTrigger: trigger,
      });

      // Body 1
      gsap.to(body1Ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.5,
        scrollTrigger: trigger,
      });

      // Italic / muted body
      gsap.to(body1ItalicRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.65,
        scrollTrigger: trigger,
      });

      // Headline 2 words
      gsap.to(splitH2.words ?? [], {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.055,
        delay: 0.85,
        scrollTrigger: trigger,
      });

      // Body 2
      gsap.to(body2Ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 1.1,
        scrollTrigger: trigger,
      });

      // CTA row — spring-like back ease
      gsap.to(ctaRowRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 1.3,
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects-outro"
      className="relative py-28 md:py-40 px-6 md:px-16 lg:px-24 bg-[#050505] overflow-hidden z-10"
    >
      {/* Subtle animated particle background (desktop only) */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none">
        <OutroCanvas />
      </div>

      {/* Thin separator from the section above */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Line 1 — mono system label */}
        <p
          ref={labelRef}
          className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500 mb-8"
        >
          SYSTEM_LOG // END_OF_DEMO_REEL
        </p>

        {/* Line 2 — first big headline */}
        <h2
          ref={headline1Ref}
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-[#FAFAFA] mb-10"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          That&apos;s just the highlight reel, btw.
        </h2>

        {/* Line 3 — body */}
        <p
          ref={body1Ref}
          className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-5"
        >
          There&apos;s a whole GitHub full of stuff I didn&apos;t have the heart
          to cut &mdash; side projects, chaos experiments, 2am &ldquo;let&apos;s
          see if this works&rdquo; commits.
        </p>

        {/* Line 4 — italic / muted */}
        <p
          ref={body1ItalicRef}
          className="text-neutral-600 text-base md:text-lg italic leading-relaxed max-w-xl mb-20"
        >
          Go check it out. I&apos;ll wait. (no seriously, block out like 20
          minutes, it&apos;s a whole vibe)
        </p>

        {/* Visual divider */}
        <div className="w-16 h-px bg-white/15 mb-20" aria-hidden="true" />

        {/* Line 5 — second big headline */}
        <h2
          ref={headline2Ref}
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-[#FAFAFA] mb-10"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Okay so now that you&apos;ve seen what I can build &mdash;{" "}
          <br className="hidden sm:block" />
          let&apos;s just skip to the part where we talk about what I can build
          for{" "}
          <span className="relative inline-block">
            <span className="relative z-10">YOU.</span>
            <span
              className="absolute bottom-1 left-0 w-full h-[4px] bg-white/20"
              aria-hidden="true"
            />
          </span>
        </h2>

        {/* Line 6 — playful/confident body */}
        <p
          ref={body2Ref}
          className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-16"
        >
          Fair warning: I will not be ghosted. I will find your recruiting
          inbox. I will follow up. Politely. Relentlessly. Like a
          well-optimized cron job.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRowRef} className="flex flex-wrap items-center gap-5">
          {/* VIEW GITHUB */}
          <MagneticPull strength={0.3}>
            <a
              id="outro-github-btn"
              href="https://github.com/adarshthakur9240"
              target="_blank"
              rel="noopener noreferrer"
              className="outro-cta-btn inline-flex items-center gap-3 px-10 py-5 border-2 border-white/20 text-[#FAFAFA] rounded-none font-black uppercase tracking-[0.2em] text-sm bg-transparent hover:bg-[#FAFAFA] hover:text-[#050505] hover:border-[#FAFAFA] transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234C5.662 21.128 4.967 19 4.967 19c-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.52 11.52 0 0 1 12 6.803a11.52 11.52 0 0 1 3.006.404c2.29-1.552 3.296-1.23 3.296-1.23.653 1.652.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.621-5.48 5.921.43.37.814 1.096.814 2.21v3.278c0 .32.19.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              VIEW GITHUB
            </a>
          </MagneticPull>

          {/* LET'S TALK */}
          <MagneticPull strength={0.3}>
            <a
              id="outro-letstalk-btn"
              href={mailtoHref}
              target="_self"
              className="outro-cta-btn inline-flex items-center gap-3 px-10 py-5 border-2 border-white/20 text-[#FAFAFA] rounded-none font-black uppercase tracking-[0.2em] text-sm bg-transparent hover:bg-[#FAFAFA] hover:text-[#050505] hover:border-[#FAFAFA] transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              LET&apos;S TALK
            </a>
          </MagneticPull>
        </div>
      </div>

      {/*
        Idle breathing animation on the CTA buttons.
        Very subtle scale 1→1.02, paused on hover.
        Automatically skipped when the OS reports prefers-reduced-motion.
      */}
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .outro-cta-btn {
            animation: outro-btn-breathe 2.8s ease-in-out infinite;
          }
          .outro-cta-btn:hover {
            animation-play-state: paused;
          }
        }

        @keyframes outro-btn-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}
