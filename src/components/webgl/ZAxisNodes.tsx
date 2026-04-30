"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ZAxisNodes({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create random initial positions for the nodes
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: Math.random() * -50,
        speed: 0.1 + Math.random() * 0.2,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Move particle forward along Z axis
      particle.z += particle.speed;

      // Reset particle if it passes the camera
      if (particle.z > 5) {
        particle.z = -50;
        particle.x = (Math.random() - 0.5) * 20;
        particle.y = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.05, 0.05, 0.5]} />
      <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
    </instancedMesh>
  );
}
