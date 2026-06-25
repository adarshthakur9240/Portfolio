"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, PresentationControls, Environment, Lightformer, Text } from "@react-three/drei";
import { motion } from "framer-motion";

// Preload the model
useGLTF.preload("/models/card.glb");

export default function Lanyard() {
  return (
    <motion.div
      initial={{ y: -800, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 40, damping: 12, mass: 2 }}
      drag
      dragConstraints={{ left: -100, right: 400, top: -100, bottom: 200 }}
      dragElastic={0.2}
      className="absolute z-30 w-[350px] h-[500px] cursor-grab active:cursor-grabbing flex justify-center items-center"
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 25 }} className="pointer-events-auto">
        <ambientLight intensity={Math.PI} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
          <PresentationControls
            global
            rotation={[0.1, 0.1, 0]}
            polar={[-0.2, 0.2]}
            azimuth={[-0.5, 0.5]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <CardModel />
          </PresentationControls>
        </Float>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </motion.div>
  );
}

function CardModel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF("/models/card.glb") as any;
  return (
    <group position={[0, -1, 0]} scale={2.5}>
      {/* The Card Mesh - Texture Wiped to Blank White */}
      <mesh geometry={nodes.card.geometry}>
        <meshPhysicalMaterial
          map={null}
          color="#FAFAFA"
          roughness={0.15}
          metalness={0.2}
          clearcoat={1}
        />
      </mesh>
      <mesh geometry={nodes.clip.geometry} material={materials.metal} />
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

      {/* Custom 3D Typography - FORCED MASSIVE Y-AXIS SHIFT UPWARDS (+0.55) */}
      <group position={[0, 0.55, 0.016]}>

        {/* Massive Stacked Name */}
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.14}
          lineHeight={0.85}
          color="#111111"
          font="https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Black.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {"ADARSH\nSINGH"}
        </Text>

        {/* Subtitle */}
        <Text
          position={[0, -0.06, 0]}
          fontSize={0.045}
          color="#666666"
          font="https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf"
          letterSpacing={0.1}
          anchorX="center"
          anchorY="middle"
        >
          SYSTEM ARCHITECT
        </Text>

        {/* Status Indicator at the bottom */}
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.05}
          color="#00FF41"
          font="https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Black.ttf"
          anchorX="center"
          anchorY="middle"
        >
          {"\u25CF OPEN TO WORK"}
        </Text>

      </group>
    </group>
  );
}
