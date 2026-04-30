"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Stars } from "@react-three/drei";
import { FluidBackground } from "./FluidBackground";
import { ZAxisNodes } from "./ZAxisNodes";

export function WebGLScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
