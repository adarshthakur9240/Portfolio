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
  /** Whether all audio is muted (actual audio wiring is deferred to a later phase) */
  isMuted: boolean;

  // Actions
  setCurrentLevel: (level: SectionId) => void;
  toggleMute: () => void;
}

export const useHUDStore = create<HUDState>((set) => ({
  currentLevel: "hero",
  isMuted: false,

  setCurrentLevel: (level) => set({ currentLevel: level }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
