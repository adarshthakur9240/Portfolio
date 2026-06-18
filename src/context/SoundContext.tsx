"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playWhoosh: () => void;
  playWarpSpeed: () => void;
  playDataScan: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: false,
  toggleSound: () => {},
  playClick: () => {},
  playWhoosh: () => {},
  playWarpSpeed: () => {},
  playDataScan: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // preloaded audio players
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const warpSpeedAudioRef = useRef<HTMLAudioElement | null>(null);
  const dataScanAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and preload all audio files on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    clickAudioRef.current = new Audio("/sounds/click.mp3");
    clickAudioRef.current.preload = "auto";
    clickAudioRef.current.volume = 0.25;

    whooshAudioRef.current = new Audio("/sounds/whoosh.mp3");
    whooshAudioRef.current.preload = "auto";
    whooshAudioRef.current.volume = 0.35;

    warpSpeedAudioRef.current = new Audio("/sounds/warp-speed.mp3");
    warpSpeedAudioRef.current.preload = "auto";
    warpSpeedAudioRef.current.volume = 0.4;

    dataScanAudioRef.current = new Audio("/sounds/data-scan.mp3");
    dataScanAudioRef.current.preload = "auto";
    dataScanAudioRef.current.volume = 0.35;

    bgmAudioRef.current = new Audio("/sounds/all-the-stars.mp3");
    bgmAudioRef.current.preload = "auto";
    bgmAudioRef.current.loop = true;
    bgmAudioRef.current.volume = 0.2;

    return () => {
      bgmAudioRef.current?.pause();
    };
  }, []);

  // Shared AudioContext for synthesis fallbacks
  const getAudioCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        audioCtxRef.current = new AC();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // playClick: synthesizes a tone if file fails
  const playClick = useCallback(() => {
    const audio = clickAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback synthesis
        try {
          const ctx = getAudioCtx();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(1000, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.1);
        } catch {}
      });
    }
  }, [getAudioCtx]);

  // playWhoosh: synthesizes a whoosh if file fails
  const playWhoosh = useCallback(() => {
    const audio = whooshAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback synthesis: noise-like whoosh sweep
        try {
          const ctx = getAudioCtx();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(120, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        } catch {}
      });
    }
  }, [getAudioCtx]);

  // playWarpSpeed: synthesizes upward sweep if file fails
  const playWarpSpeed = useCallback(() => {
    const audio = warpSpeedAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback synthesis: deep space laser/warp speed whoosh
        try {
          const ctx = getAudioCtx();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          osc.type = "sawtooth";
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(90, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.7);
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(150, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(4500, ctx.currentTime + 0.7);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.8);
        } catch {}
      });
    }
  }, [getAudioCtx]);

  // playDataScan: synthesizes digital scan arpeggio if file fails
  const playDataScan = useCallback(() => {
    const audio = dataScanAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback synthesis: rapid beep sequence
        try {
          const ctx = getAudioCtx();
          if (!ctx) return;
          const now = ctx.currentTime;
          const freqs = [650, 900, 1150, 1400];
          freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.04, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.12);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.15);
          });
        } catch {}
      });
    }
  }, [getAudioCtx]);

  // BGM only toggling
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      const bgm = bgmAudioRef.current;
      if (bgm) {
        if (next) {
          bgm.play().catch((err) => {
            console.warn("BGM autoplay blocked: needs user click first", err);
          });
        } else {
          bgm.pause();
        }
      }
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playClick,
        playWhoosh,
        playWarpSpeed,
        playDataScan,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundContext = () => useContext(SoundContext);
