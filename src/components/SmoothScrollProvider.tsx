"use client";

/**
 * SmoothScrollProvider
 *
 * Phase 1 infrastructure — sets up:
 *   1. Lenis smooth scroll for the entire app.
 *   2. Lenis ↔ GSAP ScrollTrigger sync so all future GSAP-driven animations
 *      get the correct scroll position from Lenis instead of native scroll.
 *   3. Section-in-view tracking via IntersectionObserver that writes to the
 *      Zustand HUD store (currentLevel).
 *
 * Does NOT alter any visual design or content.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHUDStore, type SectionId } from "@/store/useHUDStore";

/** Map of DOM section IDs → HUD SectionId enum values */
const SECTION_MAP: Record<string, SectionId> = {
  hero: "hero",
  about: "about",
  internship: "internship",
  skills: "skills",
  activity: "activity",
  projects: "projects",
  experience: "experience",
  contact: "contact",
};

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const setCurrentLevel = useHUDStore((s) => s.setCurrentLevel);

  useEffect(() => {
    // ── 1. Register GSAP plugin ──────────────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ── 2. Initialise Lenis ──────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // ── 3. Sync Lenis → ScrollTrigger + write scroll progress ────────────────
    //   We grab setScrollProgress via getState() so the closure never goes stale.
    lenis.on("scroll", (e: { progress: number }) => {
      ScrollTrigger.update();
      useHUDStore.getState().setScrollProgress(e.progress ?? 0);
    });

    // ── 4. GSAP ticker drives the Lenis RAF loop ──────────────────────────────
    //   This replaces requestAnimationFrame so GSAP and Lenis share the same
    //   animation frame, preventing jitter / double-frames.
    const rafHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafHandler);
    gsap.ticker.lagSmoothing(0);

    // ── 5. Section tracking via IntersectionObserver ──────────────────────────
    //   Watches all sections that carry a [data-section] attribute and updates
    //   the Zustand store when they cross 30 % of the viewport.
    const sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]")
    );

    const io = new IntersectionObserver(
      (entries) => {
        // Find the most-visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.section ?? "";
          const level = SECTION_MAP[id];
          if (level) setCurrentLevel(level);
        }
      },
      { threshold: [0.3] }
    );

    sectionEls.forEach((el) => io.observe(el));

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafHandler);
      // NOTE: do NOT call ScrollTrigger.getAll().kill() here — each component
      // is responsible for killing its own triggers in its own cleanup.
      io.disconnect();
    };
  }, [setCurrentLevel]);

  // This component renders no DOM of its own — purely a side-effect provider.
  return <>{children}</>;
}
