"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p - uMouse);
    
    // Wave effect
    float ripple = sin(d * 10.0 - uTime * 2.0) * 0.5 + 0.5;
    ripple *= exp(-d * 2.0);

    // Nebula blending
    float n1 = sin(p.x * 2.0 + uTime * 0.2) * 0.5 + 0.5;
    float n2 = cos(p.y * 1.5 - uTime * 0.3) * 0.5 + 0.5;
    
    vec3 color = mix(uColor1, uColor2, n1);
    color = mix(color, uColor3, n2 * ripple);
    
    // Deep space fade
    float intensity = 0.04 + 0.08 * ripple;
    gl_FragColor = vec4(color * intensity, 1.0);
  }
`;

// Fallback CustomTimer in case THREE.Timer isn't exported or defined in TypeScript types
class CustomTimer {
  private _startTime: number = typeof performance !== "undefined" ? performance.now() : Date.now();
  private _elapsedTime: number = 0;

  update() {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    this._elapsedTime = (now - this._startTime) / 1000;
  }

  getElapsed() {
    return this._elapsedTime;
  }
}

export function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  // Instantiate standard THREE.Timer or fallback to CustomTimer
  const timer = useMemo(() => {
    const TimerClass = (THREE as unknown as { Timer: typeof CustomTimer }).Timer || CustomTimer;
    return new TimerClass();
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color("#FAFAFA") }, // Stark white
    uColor2: { value: new THREE.Color("#404040") }, // Mid gray
    uColor3: { value: new THREE.Color("#111111") }, // Deep dark gray
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { mouse: stateMouse } = state;
    
    // Update timer and assign elapsed time
    timer.update();
    const elapsed = typeof timer.getElapsed === "function" 
      ? timer.getElapsed() 
      : (timer as { elapsedTime?: number }).elapsedTime || 0;
    
    // Smoothly interpolate mouse for fluid feel
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, stateMouse.x, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, stateMouse.y, 0.05);
    
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = elapsed;
    mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
