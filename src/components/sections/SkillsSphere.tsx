"use client";

import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  "Next.js", "Node.js", "React", "C++", "TypeScript", 
  "PostgreSQL", "MongoDB", "Redis", "Turborepo", "LLMs"
];

function Word({ children, position, isMobile }: { children: string, position: THREE.Vector3, isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = new THREE.Color();
  
  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    
    // Make text face camera
    ref.current.quaternion.copy(camera.quaternion);
    
    // Distance-based opacity
    const dist = camera.position.distanceTo(ref.current.position);
    const fade = Math.max(0.2, 1 - (dist - 10) / 10);
    
    // Pulsing color logic
    const t = clock.elapsedTime;
    const pulse = Math.sin(t * 2 + position.x) * 0.5 + 0.5;
    const activeColor = pulse > 0.8 ? "#FAFAFA" : "#666666"; // Stark white flash
    
    const material = ref.current.material as THREE.MeshBasicMaterial;
    if (material) {
      material.opacity = fade;
      material.color.lerp(color.set(activeColor), 0.1);
    }
  });

  return (
    <Text
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      position={position}
      fontSize={isMobile ? 0.6 : 0.8}
      material-toneMapped={false}
      material-transparent={true}
    >
      {children}
    </Text>
  );
}

function Cloud({ count = 20, radius = 15, isMobile }: { count?: number, radius?: number, isMobile: boolean }) {
  const words = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const skill = SKILLS[i % SKILLS.length];
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
      temp.push({ pos, word: skill });
    }
    return temp;
  }, [count, radius]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map((item, idx) => (
        <Word key={idx} position={item.pos} isMobile={isMobile}>
          {item.word}
        </Word>
      ))}
    </group>
  );
}

export function SkillsSphere() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="skills" className="relative h-screen w-full z-10 py-32 flex flex-col items-center">
       <h2 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-widest opacity-30">TECH_SPHERE</h2>
       <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 25], fov: 60 }}>
            <Suspense fallback={null}>
              <Cloud count={SKILLS.length * 3} radius={isMobile ? 12 : 18} isMobile={isMobile} />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
       </div>
    </section>
  );
}
