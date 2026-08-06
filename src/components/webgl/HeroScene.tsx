"use client";

/**
 * HeroScene.tsx  —  Phase 2: 3D Hero background
 *
 * Loaded exclusively via next/dynamic({ ssr: false }) from HeroSection.tsx.
 * Contains:
 *   • ReactiveParticleField  — points that lerp toward mouse position in 3D
 *   • WireframeReactor       — icosahedron "core" wrapped in <Float>
 *   • Postprocessing         — <Bloom> + <ChromaticAberration> (skipped on low-end devices)
 *
 * Performance guards:
 *   • Low-end / mobile  → fewer particles, no postprocessing
 *   • prefers-reduced-motion → no rotation, no mouse parallax
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY — detect low-end device at module init time (client-only)
// ─────────────────────────────────────────────────────────────────────────────
function detectLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  const narrowViewport = window.innerWidth < 768;
  const fewCores =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency < 4;
  return narrowViewport || fewCores;
}

function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─────────────────────────────────────────────────────────────────────────────
// REACTIVE PARTICLE FIELD
// A cloud of points whose group slowly rotates toward wherever the mouse is.
// The lerp factor keeps it silky-smooth — it never snaps.
// ─────────────────────────────────────────────────────────────────────────────
interface ReactiveParticleFieldProps {
  count: number;
  reducedMotion: boolean;
}

function ReactiveParticleField({
  count,
  reducedMotion,
}: ReactiveParticleFieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  // Stable per-point positions in a roughly ellipsoidal volume
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  // Lerp target for mouse parallax
  const target = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g || reducedMotion) return;

    // Ease toward mouse — factor keeps it lagging behind the cursor
    const lerpFactor = 1 - Math.pow(0.08, delta);
    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      mouse.x * 0.6,
      lerpFactor
    );
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      mouse.y * 0.4,
      lerpFactor
    );

    // Apply as gentle rotation (not position snap)
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      target.current.x * 0.3,
      lerpFactor
    );
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      -target.current.y * 0.2,
      lerpFactor
    );

    // Slow ambient drift
    g.rotation.z += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.04}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIREFRAME REACTOR (TORUS — large ring spanning most of the hero viewport)
// Slowly auto-rotates and bobs via <Float>. Mouse parallax is also applied.
// Camera at z=6, fov=55 → visible height ≈ 6.3 units.
// Main torus radius 2.2 fills ~70 % of that height, matching the original.
// ─────────────────────────────────────────────────────────────────────────────
interface WireframeReactorProps {
  reducedMotion: boolean;
}

function WireframeReactor({ reducedMotion }: WireframeReactorProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;

    if (!reducedMotion) {
      // Roll the ring on x and z — feels more natural for a torus
      m.rotation.x += delta * 0.10;
      m.rotation.z += delta * 0.04;

      // Mouse parallax on top of auto-rotation
      const lf = 1 - Math.pow(0.06, delta);
      targetRot.current.x = THREE.MathUtils.lerp(
        targetRot.current.x,
        -mouse.y * 0.25,
        lf
      );
      targetRot.current.y = THREE.MathUtils.lerp(
        targetRot.current.y,
        mouse.x * 0.35,
        lf
      );
      m.rotation.x += targetRot.current.x * delta * 0.5;
      m.rotation.y += targetRot.current.y * delta * 0.5;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={reducedMotion ? 0 : 0.2}
      floatIntensity={reducedMotion ? 0 : 0.5}
    >
      {/* Main ring — large, matches original torus background */}
      <mesh ref={meshRef}>
        <torusGeometry args={[2.2, 0.38, 28, 90]} />
        <meshBasicMaterial
          color="#e5e5e5"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* Outer accent ring — slightly larger, very faint, tilted for depth */}
      <mesh rotation={[0.4, 0, 0.2]}>
        <torusGeometry args={[2.8, 0.18, 16, 70]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE CONTENTS (rendered inside the Canvas)
// ─────────────────────────────────────────────────────────────────────────────
interface SceneContentsProps {
  particleCount: number;
  reducedMotion: boolean;
  lowEnd: boolean;
}

function SceneContents({
  particleCount,
  reducedMotion,
  lowEnd,
}: SceneContentsProps) {
  const chromaticOffset = useMemo(
    () => new THREE.Vector2(0.0008, 0.0008),
    []
  );

  return (
    <>
      <ambientLight intensity={0.1} />

      <ReactiveParticleField
        count={particleCount}
        reducedMotion={reducedMotion}
      />
      <WireframeReactor reducedMotion={reducedMotion} />

      {/* Postprocessing — skipped entirely on low-end / mobile */}
      {!lowEnd && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            offset={chromaticOffset}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC EXPORT — the full Canvas wrapper
// Consumed by HeroSection via next/dynamic({ ssr: false })
// ─────────────────────────────────────────────────────────────────────────────
export function HeroScene() {
  const lowEnd = detectLowEnd();
  const reducedMotion = detectReducedMotion();

  // Particle budget
  const particleCount = lowEnd ? 40 : 160;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={lowEnd ? [1, 1] : [1, 1.5]}
        style={{ background: "transparent" }}
        gl={{
          alpha: true,
          antialias: !lowEnd,
          powerPreference: lowEnd ? "low-power" : "high-performance",
        }}
        frameloop="always"
      >
        <SceneContents
          particleCount={particleCount}
          reducedMotion={reducedMotion}
          lowEnd={lowEnd}
        />
      </Canvas>
    </div>
  );
}
