"use client";

import { useState } from "react";
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { MagneticPull } from "../ui/MagneticPull";
import { useCyberSounds } from "@/hooks/useCyberSounds";

export default function TerminalContact() {
  const { playHover, playWhoosh } = useCyberSounds();
  const [output, setOutput] = useState<string[]>([
    "INITIALIZING SECURE COMM CHANNEL...",
    "ESTABLISHED CONNECTION.",
    "AWAITING INPUT..."
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (cmd: string) => {
    playWhoosh();
    let response = "";
    switch (cmd.toLowerCase()) {
      case "contact":
        response = "EMAIL: singhadadarsh9240@gmail.com | PHONE: +91-6386247822";
        break;
      case "clear":
        setOutput([]);
        setInput("");
        return;
      case "whoami":
        response = "GUEST_USER_9942";
        break;
      default:
        response = `COMMAND NOT FOUND: ${cmd}. Try 'contact', 'whoami', or 'clear'.`;
    }
    setOutput(prev => [...prev, `> ${cmd}`, response]);
    setInput("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playWhoosh();
    setOutput(prev => [...prev, `> COPIED: ${text} TO CLIPBOARD.`]);
  };

  const socials = [
    { icon: <FiLinkedin size={40} />, link: "https://linkedin.com/in/adarsh-thakur-7683612a4", name: "LinkedIn" },
    { icon: <FiGithub size={40} />, link: "https://github.com/adarshthakur9240", name: "GitHub" },
    { icon: <SiLeetcode size={40} />, link: "https://leetcode.com/adarsh__singh_", name: "LeetCode" },
    { icon: <FiInstagram size={40} />, link: "https://instagram.com/adarshhh__thakur", name: "Instagram" },
  ];

  return (
    <footer className="relative py-32 px-4 md:px-20 z-10 border-t border-white/5 bg-cinematic-dark">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Terminal Interface */}
        <div className="w-full">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase">Comm<br/>Channel</h2>
          <div className="glass p-6 h-[400px] flex flex-col font-mono text-sm md:text-base text-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.1)]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {output.map((line, i) => (
                <div key={i} className={line.startsWith(">") ? "text-white" : "text-neon-cyan"}>
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
              <span className="text-white">{">"}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    handleCommand(input.trim());
                  }
                }}
                className="bg-transparent border-none outline-none flex-1 text-white placeholder-white/30"
                placeholder="Type command..."
              />
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button onClick={() => handleCommand("contact")} className="px-3 py-1 border border-neon-cyan/30 hover:bg-neon-cyan/20 interactive">contact</button>
              <button onClick={() => copyToClipboard("singhadadarsh9240@gmail.com")} className="px-3 py-1 border border-neon-magenta/30 hover:bg-neon-magenta/20 text-neon-magenta interactive">copy email</button>
            </div>
          </div>
        </div>

        {/* Social Nexus */}
        <div className="w-full flex flex-col justify-center">
          <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase text-right">The<br/>Nexus</h2>
          <div className="flex flex-wrap justify-end gap-8">
            {socials.map((social) => (
              <MagneticPull key={social.name} strength={0.5}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playHover()}
                  className="w-24 h-24 glass flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors duration-300 interactive shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]"
                >
                  {social.icon}
                </a>
              </MagneticPull>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
