"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHIPS = [
  { text: "Scalability Expert", color: "text-white border-white/10" },
  { text: "AI Architect", color: "text-neutral-300 border-white/10" },
  { text: "Machine Shipper", color: "text-neutral-400 border-white/10" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading letter stagger
      if (headingRef.current) {
        const text = headingRef.current.innerText;
        headingRef.current.innerHTML = text
          .split("")
          .map(
            (c) =>
              `<span class="inline-block overflow-hidden"><span class="about-char inline-block">${
                c === " " ? "&nbsp;" : c
              }</span></span>`
          )
          .join("");

        gsap.from(".about-char", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.025,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Quote paragraph fade in
      if (quoteRef.current) {
        gsap.from(quoteRef.current, {
          opacity: 0,
          y: 30,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 88%",
            once: true,
          },
        });
      }

      // Chips stagger
      if (chipsRef.current) {
        gsap.from(Array.from(chipsRef.current.children), {
          opacity: 0,
          scale: 0.85,
          y: 16,
          duration: 0.65,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: chipsRef.current,
            start: "top 90%",
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
      id="about"
      className="relative py-32 px-4 md:px-20 z-10 overflow-hidden bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-500 p-8 md:p-16 rounded-none flex flex-col items-center text-center overflow-hidden w-full">
            <div className="w-full flex justify-center overflow-hidden mb-10">
              <h2
                ref={headingRef}
                className="text-[clamp(2rem,6vw,6rem)] font-black uppercase tracking-tighter whitespace-nowrap text-center text-[#FAFAFA] w-full"
              >
                Something About Me
              </h2>
            </div>

            <p
              ref={quoteRef}
              className="text-xl md:text-2xl font-medium text-neutral-400 leading-relaxed max-w-5xl"
            >
              &ldquo;I don&apos;t just write code; I architect scalable solutions
              that drive business growth. As a 3rd-year IT undergrad and GDSC
              Core Lead, I have actively contributed to early-stage startups,
              building and scaling their infrastructure to handle real-world
              traffic. From optimising LLM platforms to sub-second latencies, to
              orchestrating complex microservices in the Q-Ecosystem, I
              specialise in taking products from{" "}
              <span className="text-white font-bold">0 to 1</span> and
              upscaling them to enterprise-level performance. If your team needs
              a developer who thinks like a CTO and ships like a machine,
              let&apos;s talk.&rdquo;
            </p>

            <div
              ref={chipsRef}
              className="mt-12 flex gap-4 flex-wrap justify-center"
            >
              {CHIPS.map((chip) => (
                <span
                  key={chip.text}
                  className={`px-6 py-2 bg-white/[0.01] rounded-none border text-sm font-bold uppercase tracking-widest ${chip.color}`}
                >
                  {chip.text}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
