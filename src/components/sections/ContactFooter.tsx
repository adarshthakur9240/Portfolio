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
    <footer id="contact" className="relative py-32 px-4 md:px-20 z-10 bg-[#050505] border-t border-white/10 overflow-hidden rounded-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side */}
        <div className="space-y-12">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-tight text-[#FAFAFA]">
            Let&apos;s Build<br/>Something Big.
          </h2>
          
          <div className="flex gap-6">
            {socials.map((social) => (
              <MagneticPull key={social.name} strength={0.5}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playHover()}
                  className="w-16 h-16 bg-white/[0.02] border border-white/10 flex items-center justify-center rounded-md hover:bg-[#FAFAFA] hover:text-black hover:border-[#FAFAFA] transition-all duration-300 interactive group"
                >
                  {social.icon}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#FAFAFA] text-black px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest pointer-events-none border border-[#FAFAFA]">
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
            className="bg-[#050505] p-8 md:p-12 border border-white/10 relative overflow-hidden rounded-md shadow-none"
          >
            <AnimatePresence mode="wait">
              {formState !== "success" ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 font-mono">Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-md focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all text-white font-mono text-sm"
                      placeholder="ENTER_IDENTIFIER"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 font-mono">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-md focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all text-white font-mono text-sm"
                      placeholder="COMM_CHANNEL@EMAIL.COM"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 font-mono">Message</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-md focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all text-white resize-none font-mono text-sm"
                      placeholder="TRANSMIT_DATA_HERE..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    onMouseEnter={() => playHover()}
                    className="w-full py-5 bg-white/[0.02] hover:bg-[#FAFAFA] hover:text-[#050505] border border-white/15 text-[#FAFAFA] font-black uppercase tracking-[0.3em] transition-all duration-300 interactive relative overflow-hidden group rounded-md font-mono text-xs"
                  >
                    {formState === "submitting" ? (
                      <span className="animate-pulse">TRANSMITTING...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        SEND TRANSMISSION <FiExternalLink />
                      </span>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 flex flex-col items-center text-center space-y-6 font-mono"
                >
                  <div className="w-16 h-16 border-2 border-[#FAFAFA] flex items-center justify-center text-[#FAFAFA] text-3xl font-black rounded-md">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-[#FAFAFA]">Transmission Received</h3>
                  <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                    Your data has been successfully securely uploaded to the nexus. Expect a response shortly.
                  </p>
                  <button 
                    onClick={() => setFormState("idle")}
                    className="text-[#FAFAFA] font-bold uppercase tracking-widest text-xs border-b border-[#FAFAFA]/40 hover:border-[#FAFAFA] pb-1 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      <div className="mt-32 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600 text-xs font-bold uppercase tracking-widest font-mono">
        <p>© 2026 ADARSH SINGH. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
