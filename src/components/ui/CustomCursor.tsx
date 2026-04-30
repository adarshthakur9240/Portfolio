"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailXSpring = useSpring(cursorX, { damping: 40, stiffness: 200, mass: 1 });
  const trailYSpring = useSpring(cursorY, { damping: 40, stiffness: 200, mass: 1 });

  useEffect(() => {
    // Mobile check to disable custom cursor on touch devices
    if (window.innerWidth <= 768) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newShockwave = { id: Date.now(), x: e.clientX, y: e.clientY };
      setShockwaves(prev => [...prev, newShockwave]);
      // Cleanup after animation completes
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

  // Don't render cursor on mobile
  if (typeof window !== "undefined" && window.innerWidth <= 768) return null;

  return (
    <>
      {shockwaves.map((sw) => (
        <div 
          key={sw.id} 
          className="shockwave" 
          style={{ left: sw.x, top: sw.y }} 
        />
      ))}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 bg-neon-cyan rounded-full mix-blend-screen pointer-events-none z-50 shadow-neon-cyan"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Light Trail */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-neon-magenta rounded-full mix-blend-screen pointer-events-none z-40 shadow-neon-magenta"
        style={{
          x: trailXSpring,
          y: trailYSpring,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
      />
    </>
  );
}
