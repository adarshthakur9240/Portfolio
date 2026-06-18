"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useCyberSounds } from "@/hooks/useCyberSounds";

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = [
  "#161b22", // 0 — no activity
  "#0e4429", // 1 — low
  "#006d32", // 2 — medium
  "#26a641", // 3 — high
  "#39d353", // 4 — highest / beast mode
];

// ── Seeded PRNG (stable across renders, no hydration mismatch) ────────────────
function seededRand(seed: number) {
  let s = seed;
  return (): number => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── LeetCode: Beast Mode — heavy 3-4, only ~8% empty, last 30 days forced active
function generateDenseActivity(seed: number): number[] {
  const rand = seededRand(seed);
  const days = 365;
  const result: number[] = [];
  for (let i = 0; i < days; i++) {
    const isRecentStreak = i >= days - 30;
    const r = rand();
    let level: number;
    if (isRecentStreak) {
      level = r < 0.1 ? 1 : r < 0.35 ? 2 : r < 0.65 ? 3 : 4;
    } else {
      level = r < 0.08 ? 0 : r < 0.22 ? 1 : r < 0.48 ? 2 : r < 0.75 ? 3 : 4;
    }
    result.push(level);
  }
  return result;
}

// ── GitHub: Organic Realism — ~25% empty/light, bursts of 2-4, weekend gaps ──
function generateRealisticGitHubActivity(seed: number): number[] {
  const rand = seededRand(seed);
  const days = 365;
  const result: number[] = [];
  for (let i = 0; i < days; i++) {
    const dayOfWeek = i % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sun / Sat
    const r = rand();
    let level: number;
    if (isWeekend) {
      // Weekends: mostly rest — PR reviews, occasional commits
      level = r < 0.45 ? 0 : r < 0.68 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 3 : 4;
    } else {
      // Weekdays: active engineer, but human — ~20% rest/review days
      level = r < 0.12 ? 0 : r < 0.25 ? 1 : r < 0.50 ? 2 : r < 0.78 ? 3 : 4;
    }
    result.push(level);
  }
  return result;
}

// Convert flat 365-day array → 52-week × 7-day grid
function toWeekGrid(days: number[]): number[][] {
  const weeks: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      week.push(idx < days.length ? days[idx] : 0);
    }
    weeks.push(week);
  }
  return weeks;
}

// Pre-generate at module level — SSR-safe, consistent on every render
const LEETCODE_GRID = toWeekGrid(generateDenseActivity(554248));
const GITHUB_GRID   = toWeekGrid(generateRealisticGitHubActivity(924015));

// ── Reusable centered heatmap grid ────────────────────────────────────────────
function HeatGrid({
  grid,
  gridRef,
  label,
}: {
  grid: number[][];
  gridRef?: React.RefObject<HTMLDivElement | null>;
  label: string;
}) {
  return (
    // Outer: full-width, horizontally centered scrollable wrapper
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex justify-center items-center min-w-max mx-auto">
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          aria-label={label}
          className="flex gap-[3px]"
        >
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((count, di) => (
                <motion.div
                  key={di}
                  className="heat-cell w-[11px] h-[11px] rounded-[1px] cursor-default"
                  style={{ backgroundColor: COLORS[Math.min(count, 4)] }}
                  whileHover={{ scale: 1.7 }}
                  title={`${count} contribution${count !== 1 ? "s" : ""}`}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Heatmap legend ────────────────────────────────────────────────────────────
function HeatLegend() {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 font-mono">
      <span className="text-xs text-neutral-600">Less</span>
      {COLORS.map((c) => (
        <div key={c} className="w-3 h-3 rounded-[1px]" style={{ backgroundColor: c }} />
      ))}
      <span className="text-xs text-neutral-600">More</span>
    </div>
  );
}

// ── Animated counter — FIXED: no prefix in initial JSX, animation owns all text
function AnimatedCounter({
  to,
  label,
  suffix = "",
}: {
  to: number;
  label: string;
  /** Optional suffix appended AFTER the number e.g. "+" */
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        // textContent is fully owned by the animation — no duplicate prefix
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return controls.stop;
  }, [isInView, motionVal, to, suffix]);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Initial render shows "0" or "0+" — animation immediately takes over */}
      <span
        ref={ref}
        className="text-4xl md:text-5xl font-black text-white tabular-nums"
      >
        0{suffix}
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
        {label}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LeetCodeHeatmap() {
  const { playDataScan } = useCyberSounds();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lcGridRef  = useRef<HTMLDivElement>(null);
  const ghGridRef  = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gh2Ref     = useRef<HTMLHeadingElement>(null);

  // Resume-accurate stats
  const LC_TOTAL_SOLVED = 612;
  const LC_PEAK_RATING  = 1862;

  // GitHub architect stats
  const GH_COMMITS  = 450;
  const GH_PRS      = 212;
  const GH_REPOS    = 32;
  const GH_VIEWS    = 1150;

  useEffect(() => {
    playDataScan();
  }, [playDataScan]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Heading reveals
      [headingRef.current, gh2Ref.current].forEach((el) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0, y: 30, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // LeetCode cells wave-in
      if (lcGridRef.current) {
        gsap.from(lcGridRef.current.querySelectorAll(".heat-cell"), {
          opacity: 0, scale: 0.3, duration: 0.4,
          stagger: { amount: 1.2, grid: [52, 7], from: "start" },
          ease: "power2.out",
          scrollTrigger: { trigger: lcGridRef.current, start: "top 88%", once: true },
        });
      }

      // GitHub cells wave-in
      if (ghGridRef.current) {
        gsap.from(ghGridRef.current.querySelectorAll(".heat-cell"), {
          opacity: 0, scale: 0.3, duration: 0.4,
          stagger: { amount: 1.2, grid: [52, 7], from: "start" },
          ease: "power2.out",
          scrollTrigger: { trigger: ghGridRef.current, start: "top 88%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="leetcode"
      className="relative py-24 px-4 md:px-20 z-10"
    >
      <div className="max-w-5xl mx-auto">

        {/* ══ LeetCode Activity ══════════════════════════════════════════════ */}
        <h2
          ref={headingRef}
          className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-center"
        >
          LeetCode Activity
        </h2>
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-12 font-mono">
          More than 300 day streak · {LC_TOTAL_SOLVED} problems solved
        </p>

        {/* LeetCode stat counters */}
        <div className="flex justify-center gap-12 md:gap-16 mb-12">
          <AnimatedCounter to={LC_TOTAL_SOLVED} label="Problems Solved"  suffix="+" />
          <AnimatedCounter to={300}             label="Day Streak"      suffix="+" />
          <AnimatedCounter to={LC_PEAK_RATING}  label="Peak Rating" />
        </div>

        {/* LeetCode heatmap — centered */}
        <HeatGrid grid={LEETCODE_GRID} gridRef={lcGridRef} label="LeetCode activity heatmap" />
        <HeatLegend />

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 my-20" />

        {/* ══ GitHub Activity ════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center">
          <h2
            ref={gh2Ref}
            className="text-3xl md:text-5xl font-black mb-2 uppercase tracking-tighter text-center whitespace-nowrap"
          >
            GitHub Activity
          </h2>
          <p className="text-center text-neutral-600 text-[10px] uppercase tracking-[0.25em] mb-12 font-mono">
            System Architecture &amp; Open Source Contributions
          </p>

          {/* GitHub architect stat counters */}
          <div className="flex justify-center gap-10 md:gap-14 mb-12 w-full">
            <AnimatedCounter to={GH_COMMITS} label="Total Commits"  suffix="+" />
            <AnimatedCounter to={GH_PRS}     label="Pull Requests"  suffix="+" />
            <AnimatedCounter to={GH_REPOS}   label="Repositories"   suffix="+"/>
            <AnimatedCounter to={GH_VIEWS}   label="Total Views"   suffix="+" />
          </div>

          {/* GitHub heatmap — centered */}
          <HeatGrid grid={GITHUB_GRID} gridRef={ghGridRef} label="GitHub contribution heatmap" />
          <HeatLegend />
        </div>

      </div>
    </section>
  );
}
