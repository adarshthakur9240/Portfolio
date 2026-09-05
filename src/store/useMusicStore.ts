/**
 * useMusicStore — Zustand store for the in-page music player.
 *
 * Tracks: currentTrack index, isPlaying, volume (0-1), isMuted.
 * Volume and isMuted are persisted to localStorage so they survive reloads.
 * isPlaying is NOT persisted — the page does not auto-resume playback on reload.
 */
import { create } from "zustand";

export const TRACKLIST = [
  { src: "/sounds/Spider Man.mp3", title: "Spider Man" },
  { src: "/sounds/Where have u been.mp3", title: "Where Have U Been" },
  { src: "/sounds/all-the-stars.mp3", title: "All the Stars" },
] as const;

// ── localStorage helpers ───────────────────────────────────────────────────
const LS_VOLUME = "music_player_volume";
const LS_MUTED = "music_player_muted";

function readVolume(): number {
  if (typeof window === "undefined") return 0.4;
  const v = parseFloat(localStorage.getItem(LS_VOLUME) ?? "");
  return isNaN(v) ? 0.4 : Math.min(1, Math.max(0, v));
}

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS_MUTED) === "true";
}

// ── Store interface ────────────────────────────────────────────────────────
interface MusicState {
  /** Index into TRACKLIST */
  currentTrack: number;
  isPlaying: boolean;
  /** 0–1 */
  volume: number;
  isMuted: boolean;

  // Actions
  setCurrentTrack: (idx: number) => void;
  setIsPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: 0,
  isPlaying: false,
  volume: readVolume(),
  isMuted: readMuted(),

  setCurrentTrack: (idx) => set({ currentTrack: idx }),

  setIsPlaying: (v) => set({ isPlaying: v }),

  setVolume: (v) => {
    const clamped = Math.min(1, Math.max(0, v));
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_VOLUME, String(clamped));
    }
    set({ volume: clamped });
  },

  toggleMute: () => {
    const next = !get().isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_MUTED, String(next));
    }
    set({ isMuted: next });
  },

  nextTrack: () =>
    set((s) => ({ currentTrack: (s.currentTrack + 1) % TRACKLIST.length })),

  prevTrack: () =>
    set((s) => ({
      currentTrack: (s.currentTrack - 1 + TRACKLIST.length) % TRACKLIST.length,
    })),
}));
