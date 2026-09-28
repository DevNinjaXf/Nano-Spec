"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Nanoparticle({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 200, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
          wireframe={true}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  // Using cyan color as default for dark mode compatibility 
  const particleColor = "#06b6d4";

  return (
    <div className="w-full h-[400px] sm:h-[500px] relative pointer-events-auto">
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        
        <Sparkles count={150} scale={10} size={2} speed={0.4} opacity={0.3} color={particleColor} />
        
        <Nanoparticle color={particleColor} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
