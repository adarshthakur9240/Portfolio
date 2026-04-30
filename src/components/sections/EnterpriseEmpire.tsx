"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";

export default function EnterpriseEmpire() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  
  // Transform vertical scroll into horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh]">
      {/* Sticky container that holds the horizontal track */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-20 px-[10vw]">
          
          {/* Section 1: Intro */}
          <div className="w-[80vw] h-[80vh] flex flex-col justify-center shrink-0">
            <h2 className="text-6xl md:text-8xl font-black mb-6">THE ENTERPRISE<br/>EMPIRE</h2>
            <p className="text-2xl text-gray-400 max-w-2xl">
              Immersive, full-screen micro-services and scalable backend architectures.
            </p>
          </div>

          {/* Section 2: Q-Ecosystem */}
          <div className="w-[90vw] md:w-[80vw] h-[80vh] shrink-0 flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff10] to-transparent border border-white/5 p-10 flex flex-col justify-center">
              <h3 className="text-5xl md:text-7xl font-black mb-4 liquid-chrome-text">THE Q-ECOSYSTEM</h3>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-12">
                Engineered a massive B2B SaaS platform utilizing Next.js 14 and Turborepo, achieving sub-80ms p99 latency with strict Row Level Security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                <EcosystemNode title="Qrento (Core B2B SaaS)" link="https://www.qrento.in" />
                <EcosystemNode title="Q-Partner (Affiliate Engine)" link="https://q-ecosystem-q-partner.vercel.app" />
                <EcosystemNode title="Q-Delivery (Logistics Node)" link="https://q-ecosystem-q-delivery.vercel.app" />
                <EcosystemNode title="Q-Store (Vendor Portal)" link="https://q-ecosystem-q-store.vercel.app" />
              </div>
            </div>
          </div>

          {/* Section 3: AI Resume Builder */}
          <div className="w-[90vw] md:w-[80vw] h-[80vh] shrink-0 flex flex-col justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-br from-[#bc13fe10] to-transparent border border-white/5 p-10 flex flex-col justify-center">
                <h3 className="text-5xl md:text-7xl font-black mb-4">AI RESUME BUILDER</h3>
                <p className="text-2xl md:text-4xl text-neon-magenta font-bold mb-6">Generative Platform</p>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
                  LLM-Powered engine delivering sub-second first-token latency via SSE. Custom TF-IDF scoring algorithm hitting 92% ATS extraction accuracy. Slashed client-side PDF rendering memory footprint by 40%.
                </p>
                <a 
                  href="https://ai-resume-builder-theta-azure.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-max text-2xl font-black border-b-4 border-neon-magenta pb-2 hover:text-neon-magenta transition-colors interactive"
                >
                  INITIALIZE PLATFORM {"->"}
                </a>
             </div>
          </div>

          {/* Section 4: PawAlert */}
          <div className="w-[90vw] md:w-[80vw] h-[80vh] shrink-0 flex flex-col justify-center relative pr-[10vw]">
             <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff10] to-transparent border border-white/5 p-10 flex flex-col justify-center">
                <h3 className="text-5xl md:text-7xl font-black mb-4">PAWALERT</h3>
                <p className="text-2xl md:text-4xl text-white font-bold mb-6">Distributed Gov-Tech</p>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
                  High-throughput civic backend processing real-time telemetry. Scaled node infrastructure via Redis to handle 5,000+ concurrent WebSocket connections with 99.9% delivery rate.
                </p>
                <a 
                  href="https://www.pawalert.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-max text-2xl font-black border-b-4 border-white pb-2 hover:text-neon-cyan transition-colors interactive"
                >
                  ACCESS SYSTEM {"->"}
                </a>
             </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function EcosystemNode({ title, link }: { title: string; link: string }) {
  const { playHover, playWhoosh } = useCyberSounds();

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => playHover()}
      onClick={() => playWhoosh()}
      className="glass p-6 border-l-4 border-neon-cyan hover:bg-neon-cyan/10 transition-colors interactive group"
    >
      <h4 className="text-2xl font-black mb-2 group-hover:text-neon-cyan transition-colors">{title}</h4>
      <p className="text-sm text-gray-400 font-mono flex items-center justify-between mt-4">
        <span>{link.replace("https://", "")}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
      </p>
    </a>
  );
}
