"use client";

import { motion } from "framer-motion";

interface TelemetryCardProps {
  metric: string;
  value: string;
  delay?: number;
}

export function TelemetryCard({
  metric,
  value,
  delay = 0,
}: TelemetryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="inline-flex flex-col gap-1 px-4 py-3 border border-white/10 bg-white/[0.01] rounded-none shrink-0 cursor-default"
    >
      {/* Metric Label (monospace & tiny) */}
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
        {metric}
      </span>
      {/* Value */}
      <span className="text-sm font-black text-white uppercase tracking-wider">
        {value}
      </span>
    </motion.div>
  );
}
