"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AntiGravityProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  intensity?: number;
}

export function AntiGravity({ children, className, delay = 0, duration = 4, intensity = 15 }: AntiGravityProps) {
  return (
    <motion.div
      className={cn("w-fit", className)}
      animate={{
        y: [0, -intensity, 0],
        x: [0, intensity * 0.2, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}
