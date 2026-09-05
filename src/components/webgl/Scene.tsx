"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Stars } from "@react-three/drei";
import { FluidBackground } from "./FluidBackground";
import { ZAxisNodes } from "./ZAxisNodes";
import { useHUDStore } from "@/store/useHUDStore";
import * as THREE from "three";

// ─── Camera Drift ──────────────────────────────────────────────────────────────
//  Reads scrollProgress from Zustand via getState() inside useFrame so there
//  are ZERO React re-renders per scroll tick. Lerps camera.z from 5 → 9 as
//  the user scrolls through the first 20 % of the page (Hero exit zone).
function CameraDrift({ active }: { active: boolean }) {
  const { camera } = useThree();
  const baseZ = 5;
  const maxDrift = 4; // camera travels from z=5 to z=9 over Hero exit

  useFrame(() => {
    if (!active) return;
    const { scrollProgress, heroCameraWindow } = useHUDStore.getState();
    // Map scroll progress through the hero's real proportional window, clamp to [0,1]
    const t = Math.min(scrollProgress / Math.max(heroCameraWindow, 0.01), 1);
    const targetZ = baseZ + t * maxDrift;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
  });

  return null;
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
export function WebGLScene() {
  const [isMobile, setIsMobile] = useState(false);
  // Drift is active only on desktop and only when prefers-reduced-motion is false
  const [driftActive, setDriftActive] = useState(false);
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const mobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsMobile(mobile);
    setDriftActive(!mobile && !reducedMotion);

    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none bg-cinematic-dark">
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-br from-cinematic-dark via-[#0a0a0a] to-[#111] animate-pulse opacity-50" />
      ) : (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            <FluidBackground />
            <ZAxisNodes count={100} />
            <CameraDrift active={driftActive} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

