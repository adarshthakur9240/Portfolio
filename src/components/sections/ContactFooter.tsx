"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiExternalLink, FiInstagram } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { MagneticPull } from "../ui/MagneticPull";
import { useCyberSounds } from "@/hooks/useCyberSounds";

export function ContactFooter() {
  const { playHover, playWhoosh } = useCyberSounds();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    playWhoosh();
    setTimeout(() => {
      setFormState("success");
    }, 2000);
  };

  const socials = [
    { icon: <FiLinkedin size={32} />, link: "https://linkedin.com/in/adarsh-thakur-7683612a4", name: "LinkedIn" },
    { icon: <FiGithub size={32} />, link: "https://github.com/adarshthakur9240", name: "GitHub" },
    { icon: <SiLeetcode size={32} />, link: "https://leetcode.com/adarsh__singh_", name: "LeetCode" },
    { icon: <FiInstagram size={32} />, link: "https://instagram.com/adarshhh__thakur", name: "Instagram" },
  ];

  return (
    <footer id="contact" className="relative py-32 px-4 md:px-20 z-10 bg-cinematic-dark border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side */}
        <div className="space-y-12">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-tight">
            Let&apos;s Build<br/>Something Big.
          </h2>
          
          <div className="flex gap-8">
            {socials.map((social) => (
              <MagneticPull key={social.name} strength={0.5}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playHover()}
                  className="w-16 h-16 glass flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-all duration-300 interactive group shadow-xl"
                >
                  {social.icon}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest pointer-events-none">
                    {social.name}
                  </div>
                </a>
              </MagneticPull>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 rounded-2xl border border-white/10 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {formState !== "success" ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-neon-cyan transition-colors text-white"
                      placeholder="ENTER_IDENTIFIER"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-neon-purple transition-colors text-white"
                      placeholder="COMM_CHANNEL@EMAIL.COM"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Message</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-neon-magenta transition-colors text-white resize-none"
                      placeholder="TRANSMIT_DATA_HERE..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    onMouseEnter={() => playHover()}
                    className="w-full py-5 glass bg-neon-cyan/10 hover:bg-neon-cyan/20 border-neon-cyan/30 text-neon-cyan font-black uppercase tracking-[0.3em] transition-all interactive relative overflow-hidden group"
                  >
                    {formState === "submitting" ? (
                      <span className="animate-pulse">TRANSMITTING...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        SEND TRANSMISSION <FiExternalLink />
                      </span>
                    )}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-neon-cyan text-4xl">
                    ✓
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Transmission Received</h3>
                  <p className="text-gray-400 max-w-xs mx-auto">
                    Your data has been successfully securely uploaded to the nexus. Expect a response shortly.
                  </p>
                  <button 
                    onClick={() => setFormState("idle")}
                    className="text-neon-cyan font-bold uppercase tracking-widest text-xs border-b border-neon-cyan/30 pb-1"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-xs font-bold uppercase tracking-widest">
        <p>© 2026 ADARSH SINGH. ALL RIGHTS RESERVED.</p>
        {/* <p>BUILT WITH NEXT.JS 14 & THREE.JS</p> */}
      </div>
    </footer>
  );
}
