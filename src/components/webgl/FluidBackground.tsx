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
    float intensity = 0.05 + 0.1 * ripple;
    gl_FragColor = vec4(color * intensity, 1.0);
  }
`;

export function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color("#00f3ff") }, // Cyan
    uColor2: { value: new THREE.Color("#bc13fe") }, // Purple
    uColor3: { value: new THREE.Color("#ff003c") }, // Magenta
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock, mouse: stateMouse } = state;
    
    // Smoothly interpolate mouse for fluid feel
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, stateMouse.x, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, stateMouse.y, 0.05);
    
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.elapsedTime;
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
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
