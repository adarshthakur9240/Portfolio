"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";
import { FiExternalLink, FiDownload } from "react-icons/fi";

type BadgeType = 'academic' | 'leetcode' | 'gdsc';

interface Badge {
  text: string;
  link: string | null;
  type: BadgeType;
}

export function HeroSection() {
  const { playBassHum, playHover, playWhoosh } = useCyberSounds();
  const [subtitle, setSubtitle] = useState("");
  const fullSubtitle = "Architecting High-Throughput AI & Distributed Systems.";

  useEffect(() => {
    const timeout = setTimeout(() => {
      playBassHum();
      let i = 0;
      const interval = setInterval(() => {
        setSubtitle(fullSubtitle.slice(0, i));
        i++;
        if (i > fullSubtitle.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [playBassHum, fullSubtitle]);

  const badges: Badge[] = [
    { text: "B.Tech IT @ JSS (CURRENT CGPA: 7.54)", link: null, type: 'academic' },
    { text: "LeetCode Knight (Peak: 1868)", link: "https://leetcode.com/u/adarsh__singh_/", type: 'leetcode' },
    { text: "GDSC Core Web Lead", link: null, type: 'gdsc' }
  ];

  const getBadgeStyles = (type: BadgeType) => {
    switch (type) {
      case 'leetcode':
        return "hover:border-[#FFA116] hover:text-[#FFA116] hover:shadow-[0_0_20px_rgba(255,161,22,0.4)] hover:bg-[#FFA116]/5";
      case 'academic':
        return "hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:bg-cyan-400/5";
      case 'gdsc':
        return "hover:border-transparent group/gdsc relative overflow-hidden";
      default:
        return "";
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-32 pb-10 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1] }}
        className="text-center w-full max-w-7xl mx-auto flex flex-col items-center"
      >
        <h1 
          className="text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] liquid-chrome-text mb-8 w-full text-center"
        >
          ADARSH SINGH
        </h1>

        <div className="h-10 mb-16">
          <p className="text-xl md:text-3xl text-gray-300 font-bold tracking-tight">
            {subtitle}
            <span className="animate-pulse text-neon-cyan">_</span>
          </p>
        </div>

        {/* Glass Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {badges.map((badge, idx) => (
            <motion.div 
              key={badge.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.2, duration: 1 }}
            >
              <div className="relative group">
                {badge.type === 'gdsc' && (
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-red-500 to-green-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
                )}
                
                <ComponentWrapper badge={badge}>
                  <div 
                    onMouseEnter={() => playHover()}
                    className={`glass px-8 py-4 rounded-xl border border-white/5 text-sm md:text-lg font-black text-white uppercase tracking-wider shadow-2xl transition-all duration-300 flex items-center gap-2 relative z-10 bg-cinematic-dark ${getBadgeStyles(badge.type)}`}
                  >
                    <span className={`opacity-60 group-hover:opacity-100 transition-opacity ${badge.type === 'gdsc' ? 'group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-green-400 group-hover:bg-clip-text group-hover:text-transparent' : ''}`}>
                      {badge.text}
                    </span>
                    {badge.link && (
                      <FiExternalLink className="text-inherit opacity-0 group-hover:opacity-100 transition-all" />
                    )}
                  </div>
                </ComponentWrapper>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Primary CTA: Download Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mb-20"
        >
          <a
            href="/Adarsh_Singh_Software_Engineer_2027.pdf"
            download
            onClick={() => playWhoosh()}
            onMouseEnter={() => playHover()}
            className="relative group inline-flex items-center gap-3 px-10 py-5 bg-black/40 backdrop-blur-xl border-2 border-neon-cyan/30 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 hover:scale-105 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] interactive overflow-hidden"
          >
            <span className="relative z-10">Download Résumé</span>
            <FiDownload className="relative z-10 text-xl group-hover:translate-y-1 transition-transform" />
            
            {/* Animated Beam Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent">
              <div className="absolute inset-0 rounded-full animate-border-beam border-2 border-transparent" />
            </div>
          </a>
        </motion.div>

        {/* Parallax elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -z-10 top-0 left-0 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[100px] pointer-events-none"
        />
      </motion.div>
    </section>
  );
}

function ComponentWrapper({ badge, children }: { badge: Badge, children: React.ReactNode }) {
  if (badge.link) {
    return (
      <a 
        href={badge.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {children}
      </a>
    );
  }
  return <>{children}</>;
}
