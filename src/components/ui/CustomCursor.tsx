"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTerminal } from "@/context/TerminalContext";

export function CustomCursor() {
  const { isTerminalActive } = useTerminal();
  const [cursorType, setCursorType] = useState<"default" | "interactive" | "explore">("default");
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 32, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const exploreEl = target.closest("[data-cursor='explore']");
      const interactiveEl = target.closest("button") || target.closest("a") || target.closest(".interactive");

      if (exploreEl) {
        setCursorType("explore");
      } else if (interactiveEl) {
        setCursorType("interactive");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newShockwave = { id: Date.now(), x: e.clientX, y: e.clientY };
      setShockwaves(prev => [...prev, newShockwave]);
      setTimeout(() => {
        setShockwaves(prev => prev.filter(sw => sw.id !== newShockwave.id));
      }, 600);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [cursorX, cursorY]);

  if (isTerminalActive) return null;
  if (typeof window !== "undefined" && window.innerWidth <= 768) return null;

  return (
    <>
      {/* Monochromatic Shockwaves */}
      {shockwaves.map((sw) => (
        <div 
          key={sw.id} 
          className="shockwave" 
          style={{ left: sw.x, top: sw.y }} 
        />
      ))}
      
      {/* Stark Brutalist Cursor (mix-blend-difference for default, glassmorphic for explore) */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[1000] flex items-center justify-center overflow-hidden rounded-none transition-shadow ${
          cursorType === "explore"
            ? "bg-white/[0.08] backdrop-blur-md border border-white/25 mix-blend-normal"
            : "bg-white mix-blend-difference"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorType === "explore" ? 160 : 12,
          height: cursorType === "explore" ? 48 : 12,
          marginLeft: cursorType === "explore" ? -80 : -6,
          marginTop: cursorType === "explore" ? -24 : -6,
        }}
        animate={{
          scale: cursorType === "interactive" ? 2.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        {cursorType === "explore" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[#FAFAFA] text-center whitespace-nowrap px-3"
          >
            EXPLORE PROJECT
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
