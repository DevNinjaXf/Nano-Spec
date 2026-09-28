"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function getUniqueMap(rawPositions: THREE.Vector3[]) {
  const unique: THREE.Vector3[] = [];
  const set = new Set();
  for (const p of rawPositions) {
    const hash = `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`;
    if (!set.has(hash)) {
      set.add(hash);
      unique.push(p);
    }
  }
  return unique;
}

function Lattice({ crystalSystem }: { crystalSystem: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const sys = crystalSystem.toLowerCase();
  const isHex = sys.includes("hex") || sys.includes("graph");

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  const { atoms, bonds, color } = useMemo(() => {
    const isDiamond = sys.includes("diamond");
    const isFCC = sys.includes("face-centered") || sys.includes("fcc") || isDiamond;
    const isBCC = sys.includes("body-centered") || sys.includes("bcc");
    
    let rawPos: THREE.Vector3[] = [];
    let bondLimit = 1.0;
    let atomColor = "#a855f7"; // Default purple

    if (isHex) {
      // 2D Graphene Hexagonal Sheet
      atomColor = "#06b6d4"; // Cyan
      const hexRadius = 0.8;
      bondLimit = hexRadius * 1.1; 
      for(let row=0; row<6; row++) {
         for(let col=0; col<6; col++) {
            const xOffset = col * hexRadius * 1.5;
            const yOffset = row * hexRadius * Math.sqrt(3) + (col % 2 === 1 ? hexRadius * Math.sqrt(3)/2 : 0);
            rawPos.push(new THREE.Vector3(xOffset, yOffset, 0));
         }
      }
    } else {
      // 3D Cubic Generation (FCC, BCC, SC, Diamond)
      const a = 1.6;
      const cells = isDiamond ? 1 : 2; // Diamond is dense, keep it 1 cell to avoid lag
      
      if (isDiamond) atomColor = "#3b82f6"; // Blueish for silicon
      else if (isFCC) atomColor = "#eab308"; // Goldish
      else if (isBCC) atomColor = "#ef4444"; // Reddish
      
      if (isDiamond) bondLimit = (a * Math.sqrt(3) / 4) * 1.1;
      else if (isFCC) bondLimit = (a * Math.sqrt(2) / 2) * 1.1;
      else if (isBCC) bondLimit = (a * Math.sqrt(3) / 2) * 1.1;
      else bondLimit = a * 1.1; // Simple cubic

      for (let x=0; x<cells; x++) {
        for (let y=0; y<cells; y++) {
          for (let z=0; z<cells; z++) {
             const bx = x*a, by = y*a, bz = z*a;
             
             // Base Corners
             rawPos.push(new THREE.Vector3(bx, by, bz));
             rawPos.push(new THREE.Vector3(bx+a, by, bz));
             rawPos.push(new THREE.Vector3(bx, by+a, bz));
             rawPos.push(new THREE.Vector3(bx+a, by+a, bz));
             rawPos.push(new THREE.Vector3(bx, by, bz+a));
             rawPos.push(new THREE.Vector3(bx+a, by, bz+a));
             rawPos.push(new THREE.Vector3(bx, by+a, bz+a));
             rawPos.push(new THREE.Vector3(bx+a, by+a, bz+a));

             if (isFCC) { // Faces
                rawPos.push(new THREE.Vector3(bx+a/2, by+a/2, bz));
                rawPos.push(new THREE.Vector3(bx+a/2, by+a/2, bz+a));
                rawPos.push(new THREE.Vector3(bx, by+a/2, bz+a/2));
                rawPos.push(new THREE.Vector3(bx+a, by+a/2, bz+a/2));
                rawPos.push(new THREE.Vector3(bx+a/2, by, bz+a/2));
                rawPos.push(new THREE.Vector3(bx+a/2, by+a, bz+a/2));
             }
             if (isBCC) { // Center
                rawPos.push(new THREE.Vector3(bx+a/2, by+a/2, bz+a/2));
             }
             if (isDiamond) { // Interior Tetrahedrals
                rawPos.push(new THREE.Vector3(bx+a/4, by+a/4, bz+a/4));
                rawPos.push(new THREE.Vector3(bx+3*a/4, by+3*a/4, bz+a/4));
                rawPos.push(new THREE.Vector3(bx+3*a/4, by+a/4, bz+3*a/4));
                rawPos.push(new THREE.Vector3(bx+a/4, by+3*a/4, bz+3*a/4));
             }
          }
        }
      }
    }

    const uniqueAtoms = getUniqueMap(rawPos);

    // Center the matrix mathematically
    const box = new THREE.Box3().setFromPoints(uniqueAtoms);
    const center = new THREE.Vector3();
    box.getCenter(center);
    uniqueAtoms.forEach(p => p.sub(center));

    // Connect close atoms based on determined strict distance bounds
    const bondData: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < uniqueAtoms.length; i++) {
      for (let j = i + 1; j < uniqueAtoms.length; j++) {
        const dist = uniqueAtoms[i].distanceTo(uniqueAtoms[j]);
        if (dist > 0 && dist <= bondLimit) {
          bondData.push({ start: uniqueAtoms[i], end: uniqueAtoms[j] });
        }
      }
    }

    return { atoms: uniqueAtoms, bonds: bondData, color: atomColor };
  }, [crystalSystem]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Render Atoms */}
        {atoms.map((pos, i) => (
          <mesh key={`atom-${i}`} position={pos} castShadow>
            <sphereGeometry args={[isHex ? 0.2 : 0.25, 32, 32]} />
            <meshPhysicalMaterial 
              color={color} 
              metalness={0.8}
              roughness={0.15}
              clearcoat={1}
            />
          </mesh>
        ))}
        {/* Render Bonds */}
        {bonds.map((bond, i) => {
          const distance = bond.start.distanceTo(bond.end);
          const orientation = new THREE.Matrix4();
          orientation.lookAt(bond.start, bond.end, new THREE.Object3D().up);
          orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
          
          return (
            <mesh 
              key={`bond-${i}`} 
              position={bond.start.clone().lerp(bond.end, 0.5)} 
              quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)}
            >
              <cylinderGeometry args={[0.04, 0.04, distance, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export function Insight3D({ crystalSystem = "Cubic" }: { crystalSystem?: string }) {
  return (
    <div className="w-full h-[400px] glass-panel rounded-3xl overflow-hidden relative cursor-grab active:cursor-grabbing">
      <div className="absolute top-4 left-4 z-10 w-full max-w-[80%] pointer-events-none">
        <p className="inline-block text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-mono font-semibold border border-primary/20 backdrop-blur-sm">
          Simulated Lattice: {crystalSystem}
        </p>
      </div>
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        <Lattice crystalSystem={crystalSystem} />
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
      </Canvas>
    </div>
  );
}
