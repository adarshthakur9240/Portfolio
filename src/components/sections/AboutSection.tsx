"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-4 md:px-20 z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          {/* Neon Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative glass p-8 md:p-16 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-tighter liquid-chrome-text">
              Something about me
            </h2>
            
            <p className="text-xl md:text-3xl font-medium text-gray-200 leading-relaxed max-w-5xl">
              &quot;I don&apos;t just write code; I architect scalable solutions that drive business growth. As a 3rd-year IT undergrad and GDSC Core Lead, I have actively contributed to early-stage startups, building and scaling their infrastructure to handle real-world traffic. From optimizing LLM platforms to sub-second latencies, to orchestrating complex microservices in the Q-Ecosystem, I specialize in taking products from 0 to 1 and upscaling them to enterprise-level performance. If your team needs a developer who thinks like a CTO and ships like a machine, let&apos;s talk.&quot;
            </p>

            <div className="mt-12 flex gap-4 flex-wrap justify-center">
              <span className="px-6 py-2 glass rounded-full text-neon-cyan border-neon-cyan/30 text-sm font-bold uppercase tracking-widest">Scalability Expert</span>
              <span className="px-6 py-2 glass rounded-full text-neon-purple border-neon-purple/30 text-sm font-bold uppercase tracking-widest">AI Architect</span>
              <span className="px-6 py-2 glass rounded-full text-neon-magenta border-neon-magenta/30 text-sm font-bold uppercase tracking-widest">Machine Shipper</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
