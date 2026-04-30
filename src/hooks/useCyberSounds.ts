"use client";

import useSound from "use-sound";

export function useCyberSounds() {
  const [playHover] = useSound("/sounds/crisp-click.mp3", { volume: 0.3 });
  const [playClick] = useSound("/sounds/click.mp3", { volume: 0.2 }); // Updated to /sounds/click.mp3
  const [playWhoosh] = useSound("/sounds/whoosh.mp3", { volume: 0.4 }); // Updated to /sounds/whoosh.mp3
  const [playBassHum] = useSound("/sounds/deep-bass-hum.mp3", { volume: 0.8 });

  return {
    playHover,
    playClick,
    playWhoosh,
    playBassHum,
  };
}
