"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("");
  const fullText = "INITIALIZING CORE SYSTEMS...\nSTABILIZING NEURAL LINK...\nWELCOME ADARSH.";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, currentIndex));
      currentIndex++;
      if (currentIndex > fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800); // Hold for a moment before completing
      }
    }, 30); // Typing speed

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cinematic-dark text-neon-cyan font-mono text-sm md:text-lg whitespace-pre-wrap text-center px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div>
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          _
        </motion.span>
      </div>
    </motion.div>
  );
}
