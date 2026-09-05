/**
 * useHUDStore — Global Zustand store for the game-HUD themed portfolio.
 *
 * Phase 1 state:
 *   - currentLevel : which section is currently in the viewport (for the HUD
 *                    level indicator that will be built in a later phase).
 *   - isMuted      : sound-toggle state (actual audio wiring is deferred to a later phase).
 */
import { create } from "zustand";

export type SectionId =
  | "hero"
  | "about"
  | "internship"
  | "skills"
  | "activity"
  | "projects"
  | "experience"
  | "contact";

interface HUDState {
  /** The section currently in the viewport */
  currentLevel: SectionId;
  /** Whether all audio is muted */
  isMuted: boolean;
  /**
   * Normalised scroll progress across the whole page (0 = top, 1 = bottom).
   * Written each Lenis frame — NOT a React state trigger, consumers should
   * read it inside useFrame / rAF rather than subscribing with useHUDStore
   * to avoid per-frame re-renders.
   */
  scrollProgress: number;
  /**
   * Hero section height as a fraction of total document scroll height.
   * Written by HeroSection on mount/resize, read by CameraDrift in useFrame.
   * Default is 0.15 — overwritten with the real value at runtime.
   */
  heroCameraWindow: number;

  // Actions
  setCurrentLevel: (level: SectionId) => void;
  toggleMute: () => void;
  setScrollProgress: (p: number) => void;
  setHeroCameraWindow: (w: number) => void;
}

export const useHUDStore = create<HUDState>((set) => ({
  currentLevel: "hero",
  isMuted: false,
  scrollProgress: 0,
  heroCameraWindow: 0.15,

  setCurrentLevel: (level) => set({ currentLevel: level }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  setHeroCameraWindow: (w) => set({ heroCameraWindow: w }),
}));
