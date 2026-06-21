"use client";

import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  // 🧠 Core Gen AI & LLM Ecosystem (The Recruiter Magnets)
  "LLMs", "RAG Pipeline", "LangChain", "OpenAI API", "Google Gemini", 
  "VectorDB", "Prompt Engineering", "Agentic AI", "Hugging Face",

  // ⚡ High-Throughput Backend & Architecture (CTO Vibe)
  "Node.js", "Python", "WebSockets", "Microservices", "System Design", 
  "Distributed Systems", "Kafka", "gRPC", "GraphQL", "REST APIs",

  // 🗄️ Databases, ORMs & Caching
  "PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "Supabase", "Atlas Vector Search",

  // 🌐 Modern Frontend & 3D (The Eye-Candy)
  "Next.js 14", "React", "TypeScript", "Tailwind CSS", "WebGL", 
  "Three.js", "Framer Motion", "GSAP",

  // 🛠️ DevOps, Cloud & Tooling
  "Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Turborepo", "Git",

  // 🏆 Core CS (Flexing the LeetCode Knight Status)
  "C++", "Data Structures", "Algorithms", "Dynamic Programming"
];

// ═══════════════════════════════════════════════════════════════════
// LORENZ CHAOS SWARM
// ═══════════════════════════════════════════════════════════════════
interface ChaosSwarmProps {
  isMobile: boolean;
}

function ChaosSwarm({ isMobile }: ChaosSwarmProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tempV = useMemo(() => new THREE.Vector3(), []);

  // 1. Duplicate skills to exactly 200 words (particles)
  const particles = useMemo(() => {
    const pts = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      const word = SKILLS[i % SKILLS.length];
      // Random coordinates near the attractor center with slight spacing
      pts.push({
        word,
        x: (Math.random() - 0.5) * 8 + 0.1,
        y: (Math.random() - 0.5) * 8 + 0.1,
        z: 20 + (Math.random() - 0.5) * 8,
      });
    }
    return pts;
  }, []);

  // Mutable Lorenz variables for smooth mouse mutation lerping
  const currentSigma = useRef(10);
  const currentRho = useRef(28);
  const beta = 8 / 3;

  useFrame((state, delta) => {
    // Cap delta-time to prevent numerical divergence in Euler integration
    const dt = Math.min(delta, 0.015) * 0.65;
    const { pointer } = state;

    // ── A. ROTATE THE GENERAL SWARM GROUP ──
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.0006;
    }

    // ── B. INTERACTIVE CONSTANTS MUTATION (MOUSE WARP) ──
    // Map mouse coordinates: X maps to rho parameter, Y maps to sigma parameter
    const targetSigma = 10 + pointer.y * 6;
    const targetRho = 28 + pointer.x * 18;

    // Smoothly lerp parameter modifications to prevent visual snapping
    currentSigma.current = THREE.MathUtils.lerp(currentSigma.current, targetSigma, 0.08);
    currentRho.current = THREE.MathUtils.lerp(currentRho.current, targetRho, 0.08);

    const sigma = currentSigma.current;
    const rho = currentRho.current;

    // ── C. UPDATE EULER INTEGRATION & POSITION MESHES ──
    const count = particles.length;
    for (let i = 0; i < count; i++) {
      const mesh = textRefs.current[i];
      if (!mesh) continue;

      const p = particles[i];

      // Euler approximation of Lorenz Attractor Equations
      const dx = (sigma * (p.y - p.x)) * dt;
      const dy = (p.x * (rho - p.z) - p.y) * dt;
      const dz = (p.x * p.y - beta * p.z) * dt;

      p.x += dx;
      p.y += dy;
      p.z += dz;

      // Safety Reset: Prevent mathematical coordinates from escaping to infinity under high mutation
      if (Math.abs(p.x) > 120 || Math.abs(p.y) > 120 || Math.abs(p.z) > 120) {
        p.x = (Math.random() - 0.5) * 5 + 0.1;
        p.y = (Math.random() - 0.5) * 5 + 0.1;
        p.z = 20 + (Math.random() - 0.5) * 5;
      }

      // Scale coordinates down to fit comfortable viewport bounds
      const scale = isMobile ? 0.25 : 0.35;
      const posX = p.x * scale;
      const posY = p.y * scale;
      const posZ = (p.z - 24) * scale; // Offset Z to center the attractor symmetry at root origin

      mesh.position.set(posX, posY, posZ);

      // ── D. CAMERA BILLBOARDING ──
      // Force words to face camera coordinate space to maintain absolute legibility
      mesh.lookAt(state.camera.position);

      // ── E. DEPTH FADE (FOG / DOF EFFECT) ──
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        // Calculate dynamic depth fading based on world Z position
        mesh.getWorldPosition(tempV);
        const zRange = 25 * scale;
        const depthFactor = (tempV.z + zRange) / (2 * zRange);
        const depth = Math.max(0, Math.min(1.0, depthFactor));

        // Smoothly interpolate opacity between 0.3 (back) and 1.0 (front)
        const targetOpacity = THREE.MathUtils.lerp(0.3, 1.0, depth);
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((pt, idx) => (
        <Text
          key={idx}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={(el) => (textRefs.current[idx] = el as any)}
          fontSize={isMobile ? 0.23 : 0.33}
          fontWeight={900}
          color="#FAFAFA"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          material-toneMapped={false}
        >
          {pt.word}
        </Text>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT EXPORT
// ═══════════════════════════════════════════════════════════════════
export function SkillsSphere() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="skills"
      className="relative h-screen w-full z-10 py-24 flex flex-col items-center justify-center bg-[#000000] overflow-hidden"
    >
      {/* Brutalist Title Header */}
      <div className="text-center select-none z-10 pointer-events-none mb-12">
        <span className="text-[10px] font-mono tracking-[0.45em] text-neutral-500 block mb-3">
          [ LORENZ_CHAOS_ATTRACTOR // 200_PARTICLES ]
        </span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-200">
          CHAOS_SWARM
        </h2>
      </div>

      {/* Attractor Canvas */}
      <div className="w-full h-full max-w-5xl relative flex items-center justify-center cursor-grab active:cursor-grabbing">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 22], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#000000"));
          }}
        >
          {/* Black fog gives void depth */}
          <fog attach="fog" args={["#000000", 12, 32]} />

          <Suspense fallback={null}>
            <ChaosSwarm isMobile={isMobile} />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Cinematic HUD details overlay */}
      <div className="absolute bottom-10 left-10 pointer-events-none font-mono text-[9px] text-neutral-600 uppercase tracking-widest hidden md:block">
        <div>SYSTEM: LORENZ_strange_attractor</div>
        <div>SWARM: 200_skills_particles</div>
        <div>ALGORITHM: EULER_INTEGRATION</div>
      </div>

      <div className="absolute bottom-10 right-10 pointer-events-none font-mono text-[9px] text-neutral-600 uppercase tracking-widest hidden md:block">
        <div>MOUSE_MUTATION: ACTIVE</div>
        <div>VARIABLES: RHO={"{X}"}_SIGMA={"{Y}"}</div>
        <div>FOG: EXPONENTIAL_VOID</div>
      </div>
    </section>
  );
}
