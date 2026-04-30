"use client";

import { motion } from "framer-motion";
import { useCyberSounds } from "@/hooks/useCyberSounds";

export function ExperienceTimeline() {
  const { playHover } = useCyberSounds();

  const certs = [
    { title: "Oracle Cloud Infrastructure 2025 AI Foundations Associate", color: "neon-cyan" },
    { title: "DeepLearning.AI: Building AI Voice Agents", color: "neon-magenta" },
    { title: "Google Cloud: Intro to Generative AI", color: "white" }
  ];

  return (
    <section className="relative min-h-screen py-32 px-4 md:px-20 z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-8xl font-black mb-20 text-center uppercase tracking-tighter">
          LEADERSHIP & <br className="hidden md:block"/>CERTIFICATIONS
        </h2>

        {/* GDSC Leadership */}
        <div className="relative mb-32 group mx-auto max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
          <div className="relative glass p-10 md:p-16 border-l-8 border-neon-cyan">
            <h3 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight">GDSC Core Web Lead</h3>
            <p className="text-xl md:text-3xl font-bold text-gray-400 mb-8 uppercase tracking-widest">Google Developer Student Clubs</p>
            <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
              Core Team Member. Engineered full-stack features, successfully onboarding 500+ students and boosting participation by 40%. Led technical workshops for 200+ attendees.
            </p>
          </div>
        </div>

        {/* Certifications (Holographic Monoliths) */}
        <h3 className="text-4xl md:text-6xl font-black mb-16 text-center text-gray-500 uppercase tracking-widest">THE VAULT</h3>
        
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-10">
          {certs.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              onMouseEnter={() => playHover()}
              className={`relative w-full max-w-[350px] h-[450px] flex flex-col justify-end p-8 interactive group`}
            >
              {/* Holographic glowing lines and base */}
              <div className={`absolute inset-0 border-2 border-${cert.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
              {/* Fallback colors for tailwind safelist if needed, using style instead for dynamic values */}
              <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: cert.color === 'white' ? '#fff' : `var(--tw-color-${cert.color})`, boxShadow: `0 0 20px ${cert.color === 'white' ? '#fff' : `var(--tw-color-${cert.color})`}` }} />
              
              {/* Inner glass panel */}
              <div className={`absolute inset-1 bg-gradient-to-t from-${cert.color}/20 to-transparent backdrop-blur-sm rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 mb-6 rounded-full border-2 border-${cert.color} flex items-center justify-center`} style={{ borderColor: cert.color === 'white' ? '#fff' : `var(--tw-color-${cert.color})` }}>
                  <div className={`w-4 h-4 rounded-full animate-ping`} style={{ backgroundColor: cert.color === 'white' ? '#fff' : `var(--tw-color-${cert.color})` }} />
                </div>
                <h4 className="text-3xl font-black leading-tight uppercase tracking-tight">{cert.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
