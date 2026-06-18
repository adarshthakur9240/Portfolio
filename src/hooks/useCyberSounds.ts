"use client";

import { useSoundContext } from "@/context/SoundContext";

/**
 * Hook for playing audio feedback.
 * Decouples UI feedback sounds from BGM toggle settings.
 */
export function useCyberSounds() {
  const {
    soundEnabled,
    toggleSound,
    playClick,
    playWhoosh,
    playWarpSpeed,
    playDataScan,
  } = useSoundContext();

  return {
    playHover: playClick,
    playClick,
    playWhoosh,
    playWarpSpeed,
    playDataScan,
    playBassHum: () => {}, // Deprecated compatibility placeholder
    soundEnabled,
    toggleSound,
  };
}
