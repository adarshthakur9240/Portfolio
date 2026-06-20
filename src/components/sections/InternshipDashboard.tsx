"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ═══════════════════════════════════════════════════════════════════
// ANIMATED COUNT-UP HOOK
// ═══════════════════════════════════════════════════════════════════
function useCountUp(
  target: number,
  isActive: boolean,
  duration = 2000,
  suffix = ""
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number;
    let rafId: number;

    const easeOutExpo = (t: number) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setValue(Math.round(easedProgress * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, target, duration]);

  return `${value.toLocaleString()}${suffix}`;
}

// ═══════════════════════════════════════════════════════════════════
// LIVE SVG LINE CHART — simulates real-time WebSocket tick data
// ═══════════════════════════════════════════════════════════════════
function LiveTickChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dataRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  const WIDTH = 320;
  const HEIGHT = 100;
  const MAX_POINTS = 60;

  const animate = useCallback(() => {
    // Add new data point simulating tick data
    const lastVal =
      dataRef.current.length > 0
        ? dataRef.current[dataRef.current.length - 1]
        : 50;
    const noise = (Math.random() - 0.48) * 18;
    const newVal = Math.max(10, Math.min(90, lastVal + noise));
    dataRef.current.push(newVal);

    if (dataRef.current.length > MAX_POINTS) {
      dataRef.current.shift();
    }

    // Build SVG path
    const data = dataRef.current;
    if (data.length < 2 || !svgRef.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const stepX = WIDTH / (MAX_POINTS - 1);
    const offset = MAX_POINTS - data.length;

    let pathD = "";
    data.forEach((val, i) => {
      const x = (offset + i) * stepX;
      const y = HEIGHT - (val / 100) * HEIGHT;
      pathD += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
    });

    const pathEl = svgRef.current.querySelector(".tick-line") as SVGPathElement;
    const glowEl = svgRef.current.querySelector(".tick-glow") as SVGPathElement;
    if (pathEl) pathEl.setAttribute("d", pathD);
    if (glowEl) glowEl.setAttribute("d", pathD);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger re-render at ~30fps feel
    }, 60);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(interval);
    };
  }, [animate]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-24 mt-4"
      preserveAspectRatio="none"
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={0}
          y1={HEIGHT * f}
          x2={WIDTH}
          y2={HEIGHT * f}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />
      ))}
      {/* Glow */}
      <path
        className="tick-glow"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Main line */}
      <path
        className="tick-line"
        fill="none"
        stroke="#FAFAFA"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RADAR PULSE RING — animated concentric rings
// ═══════════════════════════════════════════════════════════════════
function RadarPulse() {
  return (
    <div className="relative w-32 h-32 mx-auto mt-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-white/10"
          animate={{
            scale: [1, 2.2],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse" />
      {/* Sweep line */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent origin-top"
        style={{ transformOrigin: "top center" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SERVER NODES — sequential light-up animation
// ═══════════════════════════════════════════════════════════════════
function ServerNodes() {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {[
        { label: "Latency Drop", width: "60%", delay: 0 },
        { label: "Throughput", width: "85%", delay: 0.3 },
        { label: "Uptime SLA", width: "99%", delay: 0.6 },
      ].map((node) => (
        <div key={node.label}>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
            <span>{node.label}</span>
            <span>{node.width}</span>
          </div>
          <div className="h-2 w-full bg-white/[0.03] border border-white/5 rounded-none overflow-hidden">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: "0%" }}
              whileInView={{ width: node.width }}
              viewport={{ once: true }}
              transition={{
                duration: 1.5,
                delay: node.delay,
                ease: "easeOut",
              }}
            />
          </div>
        </div>
      ))}
      {/* Server nodes row */}
      <div className="flex gap-2 mt-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-6 border border-white/10 rounded-none"
            initial={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            whileInView={{
              backgroundColor: [
                "rgba(255,255,255,0.02)",
                "rgba(255,255,255,0.5)",
                "rgba(255,255,255,0.15)",
              ],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// METRIC CARD WRAPPER — slide-up spring animation
// ═══════════════════════════════════════════════════════════════════
const cardSlide = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 16,
      mass: 1,
    },
  },
};

function MetricCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={cardSlide}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      className={`relative bg-white/[0.015] border border-white/5 hover:border-white/20 transition-colors duration-500 p-6 md:p-8 rounded-none overflow-hidden group ${className}`}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-10 h-[1px] bg-white/20" />
      <div className="absolute top-0 left-0 w-[1px] h-10 bg-white/20" />
      <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-white/20" />
      <div className="absolute bottom-0 right-0 w-[1px] h-10 bg-white/20" />
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INTERNSHIP DASHBOARD — main export
// ═══════════════════════════════════════════════════════════════════
export function InternshipDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(triggerRef, { once: true, margin: "-100px" });

  // Count-up values
  const msgRate = useCountUp(10000, isInView, 2200, "+");
  const latency = useCountUp(5, isInView, 1800);
  const roiIncrease = useCountUp(22, isInView, 2000);
  const latencyDrop = useCountUp(40, isInView, 2000);
  const uptime = useCountUp(99, isInView, 1800);

  // GSAP heading letter stagger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const raw = headingRef.current.innerText;
        headingRef.current.innerHTML = raw
          .split("")
          .map(
            (c) =>
              `<span class="inline-block overflow-hidden"><span class="dash-char inline-block">${
                c === " " ? "&nbsp;" : c
              }</span></span>`
          )
          .join("");

        gsap.from(".dash-char", {
          y: 70,
          opacity: 0,
          duration: 0.9,
          stagger: 0.02,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="internship"
      className="relative py-24 md:py-32 px-4 md:px-12 lg:px-20 z-10 overflow-hidden bg-[#050505]"
    >
      <div ref={triggerRef} className="max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <div className="mb-12 md:mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-4 block">
            [ LIVE TELEMETRY ]
          </span>
          <h2
            ref={headingRef}
            className="text-[clamp(1.5rem,4.5vw,4rem)] font-black uppercase tracking-tighter text-[#FAFAFA] leading-[0.95]"
          >
            SDE INTERN (BACKEND & AI) // HELLO LIVE NA
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm md:text-base text-neutral-600 uppercase tracking-widest mt-4 font-bold"
          >
            Hello Live NA Pvt. Ltd. · Production Metrics Dashboard
          </motion.p>
        </div>

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* ─── Card 1: Trading Engine ─── */}
          <MetricCard delay={0}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-4">
              TRADING ENGINE
            </span>

            <div className="mb-3">
              <div className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-none text-white tracking-tight">
                {msgRate}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mt-1">
                msgs/sec throughput
              </span>
            </div>

            <div className="mb-2">
              <div className="text-[clamp(1.5rem,3vw,2.5rem)] font-black leading-none text-white tracking-tight">
                sub-{latency}ms
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mt-1">
                Latency
              </span>
            </div>

            {/* Live chart */}
            <LiveTickChart />

            <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold">
                LIVE WEBSOCKET FEED
              </span>
            </div>
          </MetricCard>

          {/* ─── Card 2: AI Prediction ─── */}
          <MetricCard delay={0.15}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-4">
              AI PREDICTION ENGINE
            </span>

            <div className="mb-4">
              <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none text-white tracking-tight">
                {roiIncrease}
                <span className="text-neutral-600">%</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mt-1">
                ROI Increase
              </span>
            </div>

            {/* Radar pulse */}
            <RadarPulse />

            <p className="text-xs text-neutral-600 uppercase tracking-widest mt-4 text-center font-bold">
              LLM Time-Series Forecasting
            </p>
          </MetricCard>

          {/* ─── Card 3: Infrastructure ─── */}
          <MetricCard delay={0.3}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 block mb-4">
              INFRASTRUCTURE
            </span>

            <div className="mb-3">
              <div className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-none text-white tracking-tight">
                {latencyDrop}
                <span className="text-neutral-600">%</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mt-1">
                Latency Drop
              </span>
            </div>

            <div className="mb-4">
              <div className="text-[clamp(1.5rem,3vw,2.5rem)] font-black leading-none text-white tracking-tight">
                {uptime}.99
                <span className="text-neutral-600">%</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mt-1">
                Uptime SLA
              </span>
            </div>

            {/* Server nodes */}
            <ServerNodes />
          </MetricCard>
        </div>
      </div>
    </section>
  );
}
