"use client";

import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

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
// FLOATING 3D POPUP COMPONENT
// ═══════════════════════════════════════════════════════════════════
interface FloatingPopUpProps {
  text: string;
  x: number;
  y: number;
  z: number;
  onComplete: () => void;
}

function FloatingPopUp({ text, x, y, z, onComplete }: FloatingPopUpProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(1.0);

  useFrame((state, delta) => {
    const decay = delta * 1.5;
    setOpacity((prev) => {
      const next = prev - decay;
      return next <= 0 ? 0 : next;
    });

    if (ref.current) {
      ref.current.position.y += delta * 1.2; // Float upwards
      ref.current.lookAt(state.camera.position); // Always face the camera
    }
  });

  useEffect(() => {
    if (opacity <= 0) {
      onComplete();
    }
  }, [opacity, onComplete]);

  return (
    <Text
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      position={[x, y, z]}
      fontSize={0.28}
      fontWeight={900}
      color="#00FF41"
      material-transparent={true}
      material-opacity={opacity}
      material-toneMapped={false}
    >
      {text}
    </Text>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LORENZ CHAOS SWARM WITH GALAXY ORBIT & EXPLOSION PHYSICS
// ═══════════════════════════════════════════════════════════════════
interface ChaosSwarmProps {
  isMobile: boolean;
  isDragging: boolean;
  extractedSkills: Set<string>;
  onExtract: (word: string, pos: THREE.Vector3) => void;
  gamePhase: number;
  onRelease: () => void;
}

function ChaosSwarm({
  isMobile,
  isDragging,
  extractedSkills,
  onExtract,
  gamePhase,
  onRelease,
}: ChaosSwarmProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tempV = useMemo(() => new THREE.Vector3(), []);
  const timeScale = useRef(1.0);
  const wasDraggingRef = useRef(false);

  // Generate stable particle physics state
  const particles = useMemo(() => {
    const pts = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      const word = SKILLS[i % SKILLS.length];
      pts.push({
        word,
        x: (Math.random() - 0.5) * 8 + 0.1,
        y: (Math.random() - 0.5) * 8 + 0.1,
        z: 20 + (Math.random() - 0.5) * 8,
        vx: 0,
        vy: 0,
        vz: 0,
      });
    }
    return pts;
  }, []);

  const currentSigma = useRef(10);
  const currentRho = useRef(28);
  const beta = 8 / 3;

  useFrame((state, delta) => {
    // Smooth recovery from time dilation freeze
    timeScale.current = THREE.MathUtils.lerp(timeScale.current, 1.0, 0.05);
    // PHYSIC TWEAK: Multiplier reduced from 0.65 to 0.35 (slowing chaos swarm down by ~46%)
    const dt = Math.min(delta, 0.015) * 0.35 * timeScale.current;
    const { pointer } = state;

    // Rotate general attractor space
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002 * timeScale.current;
      groupRef.current.rotation.x += 0.0006 * timeScale.current;
    }

    const sigma = currentSigma.current;
    const rho = currentRho.current;

    const count = particles.length;
    const aspect = state.viewport.aspect;
    const scale = isMobile ? 0.25 : 0.35;

    // Unproject screen cursor coordinates to 3D world coordinates on center plane (Z = 0)
    const targetX = pointer.x * state.camera.position.z * 0.466 * aspect;
    const targetY = pointer.y * state.camera.position.z * 0.466;

    // Map world coordinates back to raw unscaled Lorenz coordinates
    const rawTargetX = targetX / scale;
    const rawTargetY = targetY / scale;
    const rawTargetZ = 24;

    // ── TRIGGER SUPERNOVA EXPLOSION ON RELEASE ──
    if (wasDraggingRef.current && !isDragging) {
      onRelease();
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        let dx = p.x - rawTargetX;
        let dy = p.y - rawTargetY;
        let dz = p.z - rawTargetZ;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.1) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          dx = Math.sin(phi) * Math.cos(theta);
          dy = Math.sin(phi) * Math.sin(theta);
          dz = Math.cos(phi);
          dist = 1.0;
        }

        const speed = 150 + Math.random() * 120;
        p.vx = (dx / dist) * speed;
        p.vy = (dy / dist) * speed;
        p.vz = (dz / dist) * speed;
      }
    }
    wasDraggingRef.current = isDragging;

    // ── UPDATE PHYSICS & INTERACTION LOOP ──
    for (let i = 0; i < count; i++) {
      const mesh = textRefs.current[i];
      if (!mesh) continue;

      const p = particles[i];

      if (isDragging) {
        // GALAXY / VORTEX ORBIT PHYSICS (SWIRL AROUND CURSOR)
        const dx = rawTargetX - p.x;
        const dy = rawTargetY - p.y;
        const dz = rawTargetZ - p.z;
        const r = Math.sqrt(dx * dx + dy * dy) + 0.1;
        const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

        // 1. Gravity pull
        const pull = 220;
        p.vx += (dx / dist3d) * pull * dt;
        p.vy += (dy / dist3d) * pull * dt;
        p.vz += (dz / dist3d) * pull * dt;

        // 2. Orbital vortex rotation in XY plane around Z-axis passing through target
        const orbitSpeed = 480;
        p.vx += (-dy / r) * orbitSpeed * dt;
        p.vy += (dx / r) * orbitSpeed * dt;

        // Damping to maintain beautiful structural swirl
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vz *= 0.94;

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.z += p.vz * dt * 60;
      } else {
        // LORENZ CHAOS ATTRACTOR PHYSICS + EXPLOSION VELOCITY DECAY
        const lorenzDx = (sigma * (p.y - p.x)) * dt;
        const lorenzDy = (p.x * (rho - p.z) - p.y) * dt;
        const lorenzDz = (p.x * p.y - beta * p.z) * dt;

        p.x += lorenzDx + p.vx * dt * 60;
        p.y += lorenzDy + p.vy * dt * 60;
        p.z += lorenzDz + p.vz * dt * 60;

        // Decay velocity
        p.vx *= 0.90;
        p.vy *= 0.90;
        p.vz *= 0.90;
      }

      // Safety reset boundaries
      if (Math.abs(p.x) > 150 || Math.abs(p.y) > 150 || Math.abs(p.z) > 150) {
        p.x = (Math.random() - 0.5) * 5 + 0.1;
        p.y = (Math.random() - 0.5) * 5 + 0.1;
        p.z = 20 + (Math.random() - 0.5) * 5;
        p.vx = 0;
        p.vy = 0;
        p.vz = 0;
      }

      const posX = p.x * scale;
      const posY = p.y * scale;
      const posZ = (p.z - 24) * scale;

      mesh.position.set(posX, posY, posZ);

      // Billboard mesh towards camera
      mesh.lookAt(state.camera.position);

      // Depth fade logic
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mesh.getWorldPosition(tempV);
        const zRange = 25 * scale;
        const depthFactor = (tempV.z + zRange) / (2 * zRange);
        const depth = Math.max(0, Math.min(1.0, depthFactor));

        const isExtracted = extractedSkills.has(p.word);
        const minOpacity = isExtracted ? 0.8 : 0.3;
        const targetOpacity = THREE.MathUtils.lerp(minOpacity, 1.0, depth);
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((pt, idx) => {
        const isExtracted = extractedSkills.has(pt.word);
        return (
          <Text
            key={idx}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={(el) => (textRefs.current[idx] = el as any)}
            fontSize={isMobile ? 0.23 : 0.33}
            scale={isExtracted ? 1.35 : 1.0} // Scale up permanently once extracted
            fontWeight={900}
            color={isExtracted ? "#00FF41" : "#FAFAFA"}
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-toneMapped={false}
            onPointerDown={(e) => {
              e.stopPropagation();
              // Raycast extraction clicks active only in Catch phase
              if (gamePhase === 1) {
                timeScale.current = 0.02; // Brief time-freeze
                onExtract(pt.word, e.object.position);
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (gamePhase === 1) {
                document.body.style.cursor = "pointer";
              }
            }}
            onPointerOut={() => {
              if (gamePhase === 1) {
                document.body.style.cursor = "crosshair";
              }
            }}
          >
            {pt.word}
          </Text>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT EXPORT WITH PHASED STATE MACHINE & 2D HUD OVERLAY
// ═══════════════════════════════════════════════════════════════════
export function SkillsSphere() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<Set<string>>(new Set());
  
  // Game Phase: 0 = Drag/Hold, 1 = Catch, 2 = Win/Reward Closed, 3 = Reward Opened
  const [gamePhase, setGamePhase] = useState<number>(0);
  
  // Floating 3D popups state
  const [popups, setPopups] = useState<{ id: number; text: string; x: number; y: number; z: number }[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update Game Phase to Complete when 15 unique skills are extracted
  useEffect(() => {
    if (extractedSkills.size >= 15) {
      setGamePhase(2);
      document.body.style.cursor = "default";
    }
  }, [extractedSkills.size]);

  const handleExtract = (word: string, pos: THREE.Vector3) => {
    // Add to collection
    setExtractedSkills((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });

    // Spawn 3D floating popup at extraction coordinate
    setPopups((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: `+1 ${word.toUpperCase()}`,
        x: pos.x,
        y: pos.y + 0.4,
        z: pos.z,
      },
    ]);
  };

  const handleRelease = () => {
    if (gamePhase === 0) {
      setGamePhase(1);
    }
  };

  const handleReset = () => {
    setExtractedSkills(new Set());
    setGamePhase(0);
    setPopups([]);
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  return (
    <section
      id="skills"
      className="relative h-screen w-full z-10 py-24 flex flex-col items-center justify-center bg-[#000000] overflow-hidden select-none"
      style={{ cursor: gamePhase === 1 ? "crosshair" : "default" }}
    >
      {/* Brutalist Title Header */}
      <div className="text-center select-none z-10 pointer-events-none mb-12">
        <span className="text-[10px] font-mono tracking-[0.45em] text-neutral-500 block mb-3">
          [ LORENZ_CHAOS_ATTRACTOR // SYSTEM_BREACH_INITIALIZED ]
        </span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-200">
          CHAOS_SWARM
        </h2>
      </div>

      {/* Attractor Canvas with Cinematic Fade Out */}
      <motion.div
        className="w-full h-full relative flex items-center justify-center"
        animate={{ opacity: gamePhase >= 2 ? 0 : 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        style={{ pointerEvents: gamePhase >= 2 ? "none" : "auto" }}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 22], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#000000"));
          }}
          onPointerDown={() => {
            // Drag triggers anywhere on the canvas background
            if (gamePhase === 0 || gamePhase === 1) {
              setIsDragging(true);
            }
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          {/* Black fog gives void depth */}
          <fog attach="fog" args={["#000000", 12, 32]} />

          <Suspense fallback={null}>
            <ChaosSwarm
              isMobile={isMobile}
              isDragging={isDragging}
              extractedSkills={extractedSkills}
              onExtract={handleExtract}
              gamePhase={gamePhase}
              onRelease={handleRelease}
            />
            {/* Render 3D Floating Extraction Alerts */}
            {popups.map((popup) => (
              <FloatingPopUp
                key={popup.id}
                text={popup.text}
                x={popup.x}
                y={popup.y}
                z={popup.z}
                onComplete={() => {
                  setPopups((prev) => prev.filter((p) => p.id !== popup.id));
                }}
              />
            ))}
          </Suspense>

          <OrbitControls
            enabled={!isDragging}
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </motion.div>

      {/* 2D HUD UI Overlay */}
      {/* CRITICAL: Parent wrapper has pointer-events-none so it doesn't block Canvas clicks */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 md:p-10 font-mono">
        
        {/* Top Header Row (Scoreboard positioned strictly in Top-Right) */}
        <div className="w-full flex justify-end pointer-events-none">
          <div className="bg-black/90 border border-neutral-800 p-4 flex flex-col items-end gap-2 text-right pointer-events-auto select-none">
            <div className="text-[10px] text-neutral-500 tracking-wider">
              MAINFRAME_DATABASE_BREACH // SYSTEM_BREACH_LIVE
            </div>
            <div className="text-sm font-bold text-neutral-200">
              DATA EXTRACTED: <span className="text-[#00FF41]">{extractedSkills.size}</span> / 15
            </div>
            <div className="w-48 bg-neutral-900 h-1.5 border border-neutral-800 overflow-hidden relative">
              <motion.div
                className="bg-[#00FF41] h-full shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (extractedSkills.size / 15) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <button
              onClick={handleReset}
              className="text-[9px] text-neutral-500 hover:text-white transition-colors underline cursor-pointer mt-1 font-mono border-none bg-transparent"
            >
              RESET BREACH
            </button>
          </div>
        </div>

        {/* Center Panel (Brutalist Reward Box Sequence) */}
        <div className="flex-grow flex items-center justify-center pointer-events-none relative z-30">
          <AnimatePresence>
            {gamePhase === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.02, 1],
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 2.0,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.5 }
                }}
                onClick={() => setGamePhase(3)}
                className="bg-black border-4 border-red-600 px-10 py-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.4)] pointer-events-auto cursor-pointer max-w-lg select-none"
              >
                <div className="text-red-500 text-xs font-bold tracking-[0.35em] mb-4 animate-pulse">
                  ▲ SYSTEM COMPROMISED
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-2">
                  [ CLICK TO CLAIM REWARD ]
                </h3>
                <div className="text-[10px] text-neutral-400 mt-4 tracking-widest font-mono">
                  DECRYPTION_KEY // STAGE_3_VERIFIED
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {gamePhase === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-black border-4 border-[#00FF41] p-10 text-center max-w-lg shadow-[0_0_60px_rgba(0,255,65,0.3)] pointer-events-auto"
              >
                <div className="text-[#00FF41] text-xs tracking-[0.4em] uppercase mb-2 font-bold">
                  ▲ BREACH FULLY VERIFIED
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                  YOU WON
                </h1>
                <p className="text-sm text-neutral-300 mb-6 font-mono tracking-wide">
                  Contact Adarsh for your gift:
                </p>
                
                <a
                  href="mailto:singhadadarsh9240@gmail.com"
                  className="block w-full py-4 px-6 mb-8 text-center text-black font-black uppercase text-sm md:text-base tracking-widest bg-[#00FF41] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] duration-300"
                >
                  singhadadarsh9240@gmail.com
                </a>

                <button
                  onClick={handleReset}
                  className="w-full border border-neutral-600 text-neutral-400 hover:text-white hover:border-white transition-all py-2 text-xs font-mono uppercase cursor-pointer bg-transparent"
                >
                  [ REBOOT SYSTEM ]
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Center Terminal Command Bar (Perfect Layout, Never overlaps Header Title) */}
        <div className="w-full flex justify-center pointer-events-none pb-12">
          <div className="bg-black/90 border-2 border-white px-6 py-3 min-w-[280px] md:min-w-[450px] text-center shadow-[0_4px_20px_rgba(255,255,255,0.15)] pointer-events-auto select-none">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="text-[10px] md:text-xs font-bold font-mono tracking-widest text-white uppercase block"
            >
              {gamePhase === 0 && (
                isDragging 
                  ? "▲ CHARGING OVERLOAD... HOLD MOUSE CLOSE TO SPIN SWARM" 
                  : "[ STEP 1: CLICK AND HOLD TO CHARGE OVERLOAD ]"
              )}
              {gamePhase === 1 && "[ STEP 2: CATCH FLYING NODES TO EXTRACT DATA ]"}
              {gamePhase >= 2 && "▲ SYSTEM BREACH COMPLETE // ALL NODES DECRYPTED"}
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
