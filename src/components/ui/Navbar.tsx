"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useCyberSounds } from "@/hooks/useCyberSounds";

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const { playHover, playWhoosh, soundEnabled, toggleSound } = useCyberSounds();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 rounded-none border-none ${
        scrolled
          ? "py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-none"
          : "py-7 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Monochromatic Logo */}
        <a
          href="#"
          onMouseEnter={playHover}
          className="text-xl font-black tracking-tighter text-white hover:text-neutral-400 transition-colors duration-200"
        >
          PORT-<span>FOLIO</span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={playHover}
              className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors duration-200 relative group"
            >
              {link.name}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle (Monochromatic) */}
          <button
            id="sound-toggle"
            onClick={toggleSound}
            title={soundEnabled ? "Sound ON — click to mute BGM" : "Sound OFF — click to enable BGM"}
            className="relative w-9 h-9 flex items-center justify-center rounded-md border border-white/10 hover:border-white/30 transition-colors duration-200 interactive"
          >
            <AnimatePresence mode="wait">
              {soundEnabled ? (
                <motion.span
                  key="vol-on"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 20 }}
                  transition={{ duration: 0.18, ease: "backOut" }}
                >
                  <Volume2 className="w-4 h-4 text-white" />
                </motion.span>
              ) : (
                <motion.span
                  key="vol-off"
                  initial={{ scale: 0, rotate: 20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -20 }}
                  transition={{ duration: 0.18, ease: "backOut" }}
                >
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                </motion.span>
              )}
            </AnimatePresence>

            {/* Subtle white pulse ring when sound is ON */}
            {soundEnabled && (
              <motion.span
                className="absolute inset-0 rounded-md border border-white/30"
                animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </button>

          {/* Hire Me (Monochromatic) */}
          <div className="relative group">
            <a
              href="mailto:singhadadarsh9240@gmail.com?subject=Job%20Opportunity%20from%20Portfolio"
              onMouseEnter={playHover}
              onClick={playWhoosh}
            >
              <button className="relative px-7 py-2.5 bg-transparent text-white text-xs font-black uppercase tracking-[0.2em] rounded-md border border-white/10 hover:border-white hover:bg-white/5 transition-all duration-300 interactive active:scale-95">
                Hire Me
              </button>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
