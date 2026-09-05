"use client";

/**
 * MusicPlayer — compact navbar pill widget.
 *
 * Collapsed state : play/pause button + subtle equaliser bars
 * Expanded state  : appears on hover — prev/next track, volume slider,
 *                   track title label
 *
 * Audio engine    : Howler.js (already installed)
 * State           : useMusicStore (Zustand, with localStorage persistence)
 * Autoplay        : triggered on first user interaction (click or scroll);
 *                   volume is faded in from 0 → stored value over 2.5 s.
 * Reduced-motion  : only visual transitions (expand/collapse animation)
 *                   are skipped; audio itself is unaffected.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicStore, TRACKLIST } from "@/store/useMusicStore";

// ── Tiny equaliser bars shown when music plays ──────────────────────────────
function EqBars({ active }: { active: boolean }) {
  return (
    <span
      className="flex items-end gap-[2px] h-3"
      aria-hidden="true"
    >
      {[0.6, 1, 0.75, 0.45].map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-white/70 origin-bottom"
          style={{
            height: `${h * 12}px`,
            animation: active
              ? `eq-bounce ${0.5 + i * 0.15}s ease-in-out infinite alternate`
              : "none",
          }}
        />
      ))}
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes eq-bounce {
            from { transform: scaleY(0.3); }
            to   { transform: scaleY(1); }
          }
        }
      `}</style>
    </span>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
  } = useMusicStore();

  const howlRef = useRef<Howl | null>(null);
  const soundIdRef = useRef<number | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const fadeInDoneRef = useRef(false);

  // Effective volume (muted → 0)
  const effectiveVolume = isMuted ? 0 : volume;

  // ── Build / rebuild Howl whenever the track changes ─────────────────────
  const buildHowl = useCallback(
    (trackIdx: number, autoStart: boolean) => {
      // Stop and unload the previous instance
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }
      fadeInDoneRef.current = false;

      const howl = new Howl({
        src: [TRACKLIST[trackIdx].src],
        html5: true, // stream large files; avoids decoding entire file upfront
        loop: false,
        volume: autoStart ? 0 : effectiveVolume, // start at 0 for fade-in
        onend: () => {
          // Auto-advance to next track
          useMusicStore.getState().nextTrack();
        },
        onloaderror: () => {
          // Fail silently — just mark as not playing
          setIsPlaying(false);
        },
      });

      howlRef.current = howl;

      if (autoStart) {
        soundIdRef.current = howl.play();
        setIsPlaying(true);
        // Fade volume in over 2500ms
        howl.fade(0, effectiveVolume > 0 ? effectiveVolume : 0.4, 2500, soundIdRef.current);
        fadeInDoneRef.current = true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveVolume]
  );

  // ── Initialise Howl on mount (don't play yet) ────────────────────────────
  useEffect(() => {
    buildHowl(currentTrack, false);
    return () => {
      howlRef.current?.stop();
      howlRef.current?.unload();
    };
    // Only run once on mount — track-change effect is separate below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── React to track changes (next/prev) ───────────────────────────────────
  useEffect(() => {
    const wasPlaying = isPlaying;
    buildHowl(currentTrack, wasPlaying);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // ── First-interaction autoplay ────────────────────────────────────────────
  useEffect(() => {
    if (interacted) return;

    const start = () => {
      setInteracted(true);
      if (!isPlaying && howlRef.current && !howlRef.current.playing()) {
        soundIdRef.current = howlRef.current.play();
        setIsPlaying(true);
        // Fade in from 0 to stored volume
        const targetVol = isMuted ? 0 : volume > 0 ? volume : 0.4;
        howlRef.current.fade(0, targetVol, 2500, soundIdRef.current);
        fadeInDoneRef.current = true;
      }
      // Clean up after first interaction
      window.removeEventListener("click", start);
      window.removeEventListener("scroll", start, true);
      window.removeEventListener("keydown", start);
    };

    window.addEventListener("click", start, { once: true });
    window.addEventListener("scroll", start, { once: true, passive: true, capture: true });
    window.addEventListener("keydown", start, { once: true });

    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("scroll", start, true);
      window.removeEventListener("keydown", start);
    };
  }, [interacted, isPlaying, isMuted, volume, setIsPlaying]);

  // ── Sync play/pause state to Howl ────────────────────────────────────────
  useEffect(() => {
    const howl = howlRef.current;
    if (!howl) return;
    if (isPlaying) {
      if (!howl.playing(soundIdRef.current)) {
        soundIdRef.current = howl.play();
      }
    } else {
      howl.pause(soundIdRef.current);
    }
  }, [isPlaying]);

  // ── Sync volume/mute to Howl ──────────────────────────────────────────────
  useEffect(() => {
    howlRef.current?.volume(effectiveVolume);
  }, [effectiveVolume]);

  // ── Toggle play/pause ─────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  // ── Prev track ────────────────────────────────────────────────────────────
  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      prevTrack();
    },
    [prevTrack]
  );

  // ── Next track ────────────────────────────────────────────────────────────
  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      nextTrack();
    },
    [nextTrack]
  );

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const handleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleMute();
    },
    [toggleMute]
  );

  // ── Volume slider ─────────────────────────────────────────────────────────
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value) / 100;
      setVolume(v);
      // Un-mute when user explicitly moves slider
      if (isMuted && v > 0) toggleMute();
    },
    [setVolume, isMuted, toggleMute]
  );

  const trackTitle = TRACKLIST[currentTrack].title;
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Framer-motion expand transition
  const expandTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.8 };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      // Also keep expanded on focus-within (keyboard nav)
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={() => setExpanded(false)}
    >
      {/* ── Pill container ── */}
      <motion.div
        layout
        animate={{ width: expanded ? "auto" : 36 }}
        transition={expandTransition}
        className="flex items-center gap-1 h-9 px-2 rounded-md border border-white/10 hover:border-white/25 bg-black/30 backdrop-blur-sm overflow-hidden cursor-pointer select-none"
        style={{ minWidth: 36 }}
        onClick={handlePlayPause}
        role="group"
        aria-label="Music player"
      >
        {/* ── Prev (only when expanded) ── */}
        <AnimatePresence>
          {expanded && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              onClick={handlePrev}
              aria-label="Previous track"
              className="flex items-center justify-center w-6 h-6 text-neutral-400 hover:text-white transition-colors duration-150 shrink-0"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Play / Pause — always visible ── */}
        <button
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex items-center justify-center w-5 h-5 shrink-0 text-white"
          onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.span
                key="pause"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.12 }}
              >
                <Pause className="w-3.5 h-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.12 }}
              >
                <Play className="w-3.5 h-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* ── Eq bars (collapsed) / Track title (expanded) ── */}
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.span
              key="title"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
              className="text-[10px] font-mono text-neutral-400 whitespace-nowrap overflow-hidden shrink-0 max-w-[110px]"
            >
              {trackTitle}
            </motion.span>
          ) : (
            <motion.span
              key="eq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="shrink-0"
            >
              <EqBars active={isPlaying} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* ── Next (only when expanded) ── */}
        <AnimatePresence>
          {expanded && (
            <motion.button
              key="next"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              onClick={handleNext}
              aria-label="Next track"
              className="flex items-center justify-center w-6 h-6 text-neutral-400 hover:text-white transition-colors duration-150 shrink-0"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Volume section (only when expanded) ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="volume"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
              className="flex items-center gap-1 shrink-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mute toggle */}
              <button
                onClick={handleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="flex items-center justify-center w-5 h-5 text-neutral-400 hover:text-white transition-colors duration-150"
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>

              {/* Volume slider */}
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={isMuted ? 0 : Math.round(volume * 100)}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="music-vol-slider w-16 h-0.5 accent-white cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Volume slider minimal styling */}
      <style jsx>{`
        .music-vol-slider {
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          outline: none;
        }
        .music-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }
        .music-vol-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
