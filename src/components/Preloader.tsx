"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCyberSounds } from "@/hooks/useCyberSounds";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const { playDataScan, playWarpSpeed } = useCyberSounds();
  const [showSystemText, setShowSystemText] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dataPoints, setDataPoints] = useState<{ id: number; text: string; startX: string; startY: string; delay: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);

    // Generate 45 random scattered hex codes/numbers radially distributed around the center
    const points = Array.from({ length: 45 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 45; // distance from center in % of viewport width/height
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const isHex = Math.random() > 0.5;
      const text = isHex
        ? "0x" + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0")
        : Math.floor(Math.random() * 1000).toString();

      return {
        id: i,
        text,
        startX: `${x}vw`,
        startY: `${y}vh`,
        delay: Math.random() * 0.3,
      };
    });
    setDataPoints(points);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 1. Play data-scan.mp3 during the initial scattering phase
    playDataScan();

    // 2. Animate all elements violently snapping into the exact center of the screen over 1.5 seconds
    const textTimer = setTimeout(() => {
      setShowSystemText(true);
    }, 1500);

    // 3. Hold for 400ms, then trigger the clip-path circular iris-wipe to reveal the portfolio (at 1.9s)
    const doneTimer = setTimeout(() => {
      playWarpSpeed();
      setIsDone(true);
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, playDataScan, playWarpSpeed, isMounted]);

  if (!isMounted) return <div className="opacity-0">Loading...</div>;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader-container"
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#050505] text-[#FAFAFA] select-none rounded-none border-none shadow-none"
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            transition: {
              duration: 1.15,
              ease: [0.87, 0, 0.13, 1], // Custom Bezier iris-wipe
            },
          }}
        >
          {/* Subtle noise grid texture overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-5 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
            }}
          />

          {/* Scattered data points snapping violently into center (0, 0) */}
          {!showSystemText &&
            dataPoints.map((point) => (
              <motion.div
                key={point.id}
                className="absolute font-mono text-[10px] md:text-xs text-neutral-500 pointer-events-none select-none"
                initial={{
                  x: point.startX,
                  y: point.startY,
                  opacity: 0,
                  scale: 1.4,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: [0, 0.7, 0],
                  scale: [1.2, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  ease: [0.87, 0, 0.13, 1], // Violent snap curve
                  delay: point.delay,
                }}
              >
                {point.text}
              </motion.div>
            ))}

          {/* Glowing System Text Block snaps open at 1.5s */}
          <AnimatePresence>
            {showSystemText && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 450, damping: 22 }}
                className="z-20 bg-[#FAFAFA] text-[#050505] font-mono text-xs md:text-sm px-6 py-3.5 tracking-[0.25em] font-black uppercase rounded-none border border-[#FAFAFA] select-none"
              >
                OS_v3.0 // SYSTEM INITIALIZED
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
