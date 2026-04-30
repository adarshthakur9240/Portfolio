"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const { playHover, playWhoosh } = useCyberSounds();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "py-4 bg-cinematic-dark/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#" 
          onMouseEnter={() => playHover()}
          className="text-2xl font-black tracking-tighter hover:text-neon-cyan transition-colors"
        >
          <span className="text-neon-cyan"></span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => playHover()}
              className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Hire Me Button with Beam Animation */}
        <div className="relative group">
          <a
            href="mailto:singhadadarsh9240@gmail.com?subject=Job%20Opportunity:%20Reaching%20out%20from%20your%20portfolio"
            onMouseEnter={() => playHover()}
            onClick={() => playWhoosh()}
            className="block"
          >
            <button
              className="relative px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-full overflow-hidden transition-transform active:scale-95 interactive"
            >
              {/* Beam Animation Container */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent">
                <div className="absolute inset-0 rounded-full border-2 border-neon-cyan opacity-20" />
                {/* The "Beam" */}
                <div className="absolute inset-0 rounded-full animate-border-beam border-2 border-transparent" />
              </div>
              <span className="relative z-10">Hire Me</span>
            </button>
          </a>
          
          {/* External Glow */}
          <div className="absolute -inset-1 bg-neon-cyan rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>
    </motion.nav>
  );
}
