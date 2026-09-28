"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Subshell colors
const subshellColors: Record<string, string> = {
  s: "#06b6d4", // cyan
  p: "#a855f7", // purple
  d: "#f59e0b", // amber
  f: "#ef4444", // red
};

interface OrbitalInfo {
  shell: number;
  subshell: string;
  electrons: number;
}

export function parseElectronConfig(config: string): OrbitalInfo[] {
  const orbitals: OrbitalInfo[] = [];
  const regex = /(\d)([spdf])(\d+)/g;
  let match;
  while ((match = regex.exec(config)) !== null) {
    orbitals.push({
      shell: parseInt(match[1]),
      subshell: match[2],
      electrons: parseInt(match[3]),
    });
  }
  return orbitals;
}

// Nucleus
function Nucleus({ atomicNumber }: { atomicNumber: number }) {
  const nucleusRef = useRef<THREE.Group>(null);
  const scale = Math.min(0.3 + atomicNumber * 0.005, 0.7);

  useFrame((_, delta) => {
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y += delta * 0.5;
      nucleusRef.current.rotation.x += delta * 0.2;
    }
  });

  // Generate proton/neutron spheres clustered in the center
  const particles = useMemo(() => {
    const pts: { pos: THREE.Vector3; isProton: boolean }[] = [];
    const count = Math.min(atomicNumber * 2, 40); // visual cap
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * scale * 0.8;
      pts.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        isProton: i % 2 === 0,
      });
    }
    return pts;
  }, [atomicNumber, scale]);

  return (
    <group ref={nucleusRef}>
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff6b35"
          emissive="#ff4500"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Inner glow halo */}
      <mesh>
        <sphereGeometry args={[scale * 1.3, 32, 32]} />
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.15} />
      </mesh>
      {/* Protons and Neutrons */}
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshPhysicalMaterial
            color={p.isProton ? "#ff4444" : "#4488ff"}
            emissive={p.isProton ? "#ff2222" : "#2255cc"}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// A single orbital ring (elliptical path)
function OrbitalRing({
  radius,
  tiltX,
  tiltY,
  tiltZ,
  color,
}: {
  radius: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  color: string;
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }
    return pts;
  }, [radius]);

  const lineGeom = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <group rotation={[tiltX, tiltY, tiltZ]}>
      <line>
        {/* @ts-ignore */}
        <bufferGeometry attach="geometry" {...lineGeom} />
        <lineBasicMaterial color={color} transparent opacity={0.3} linewidth={1} />
      </line>
    </group>
  );
}

// Electron sphere that orbits
function Electron({
  radius,
  speed,
  startAngle,
  tiltX,
  tiltY,
  tiltZ,
  color,
}: {
  radius: number;
  speed: number;
  startAngle: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(startAngle);

  useFrame((_, delta) => {
    angleRef.current += delta * speed;
    if (meshRef.current) {
      meshRef.current.position.set(
        Math.cos(angleRef.current) * radius,
        0,
        Math.sin(angleRef.current) * radius
      );
    }
  });

  return (
    <group rotation={[tiltX, tiltY, tiltZ]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
      {/* Electron trail glow */}
      <mesh ref={(ref) => {
        if (ref) {
          // Follow the electron mesh above
          const update = () => {
            ref.position.copy(meshRef.current?.position || new THREE.Vector3());
          };
          // Attach to parent frame update
          ref.onBeforeRender = update;
        }
      }}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Full atomic model scene
function AtomModel({
  orbitals,
  atomicNumber,
}: {
  orbitals: OrbitalInfo[];
  atomicNumber: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Group orbitals by shell and compute ring data
  const shellData = useMemo(() => {
    const shells = new Map<number, OrbitalInfo[]>();
    orbitals.forEach((o) => {
      if (!shells.has(o.shell)) shells.set(o.shell, []);
      shells.get(o.shell)!.push(o);
    });

    const data: {
      radius: number;
      electrons: { tiltX: number; tiltY: number; tiltZ: number; speed: number; startAngle: number; color: string }[];
      rings: { tiltX: number; tiltY: number; tiltZ: number; color: string }[];
    }[] = [];

    shells.forEach((subshells, shellNum) => {
      const baseRadius = shellNum * 1.2 + 0.8;

      subshells.forEach((sub, subIdx) => {
        const color = subshellColors[sub.subshell] || "#ffffff";
        const subRadius = baseRadius + subIdx * 0.3;

        // Determine how many distinct orbital rings this subshell has
        const orbitalCount =
          sub.subshell === "s" ? 1 :
          sub.subshell === "p" ? 3 :
          sub.subshell === "d" ? 5 :
          sub.subshell === "f" ? 7 : 1;

        const rings: typeof data[0]["rings"] = [];
        const electrons: typeof data[0]["electrons"] = [];

        let electronsPlaced = 0;

        for (let orbIdx = 0; orbIdx < orbitalCount && electronsPlaced < sub.electrons; orbIdx++) {
          // Each orbital ring gets a unique tilt
          const tiltX = sub.subshell === "s" ? 0 :
                        sub.subshell === "p" ? (orbIdx * Math.PI) / 3 :
                        (orbIdx * Math.PI) / orbitalCount;
          const tiltY = sub.subshell === "s" ? (Math.PI / 6) * subIdx :
                        (orbIdx * Math.PI) / (orbitalCount + 1);
          const tiltZ = sub.subshell === "d" || sub.subshell === "f" ?
                        (orbIdx * Math.PI) / (orbitalCount * 0.7) : 0;

          const rRadius = subRadius + orbIdx * 0.08;

          rings.push({ tiltX, tiltY, tiltZ, color });

          // Each orbital can hold 2 electrons
          const eCount = Math.min(2, sub.electrons - electronsPlaced);
          for (let e = 0; e < eCount; e++) {
            electrons.push({
              tiltX,
              tiltY,
              tiltZ,
              speed: 1.5 - shellNum * 0.12 + Math.random() * 0.3,
              startAngle: (e * Math.PI) + (orbIdx * Math.PI / 3),
              color,
            });
            electronsPlaced++;
          }
        }

        data.push({ radius: subRadius, rings, electrons });
      });
    });

    return data;
  }, [orbitals]);

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        <Nucleus atomicNumber={atomicNumber} />

        {shellData.map((shell, si) =>
          shell.rings.map((ring, ri) => (
            <OrbitalRing
              key={`ring-${si}-${ri}`}
              radius={shell.radius}
              tiltX={ring.tiltX}
              tiltY={ring.tiltY}
              tiltZ={ring.tiltZ}
              color={ring.color}
            />
          ))
        )}

        {shellData.map((shell, si) =>
          shell.electrons.map((el, ei) => (
            <Electron
              key={`electron-${si}-${ei}`}
              radius={shell.radius}
              speed={el.speed}
              startAngle={el.startAngle}
              tiltX={el.tiltX}
              tiltY={el.tiltY}
              tiltZ={el.tiltZ}
              color={el.color}
            />
          ))
        )}
      </group>
    </Float>
  );
}

// Main exported component
export function ElectronConfigViewer({
  electronConfiguration,
  atomicNumber,
  symbol,
  name,
}: {
  electronConfiguration: string;
  atomicNumber: number;
  symbol: string;
  name: string;
}) {
  const orbitals = useMemo(
    () => parseElectronConfig(electronConfiguration),
    [electronConfiguration]
  );

  // Group for legend
  const shellSummary = useMemo(() => {
    const map = new Map<number, { subshells: string[]; total: number }>();
    orbitals.forEach((o) => {
      if (!map.has(o.shell))
        map.set(o.shell, { subshells: [], total: 0 });
      const entry = map.get(o.shell)!;
      entry.subshells.push(`${o.shell}${o.subshell}${o.electrons}`);
      entry.total += o.electrons;
    });
    return map;
  }, [orbitals]);

  return (
    <div className="w-full flex flex-col">
      {/* 3D Canvas */}
      <div className="w-full h-[450px] bg-black/30 rounded-2xl overflow-hidden relative cursor-grab active:cursor-grabbing border border-zinc-800/50">
        {/* Element overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-700/50">
            <span className="text-zinc-400 text-xs font-mono">#{atomicNumber}</span>
            <span className="text-3xl font-bold text-white ml-2">{symbol}</span>
            <span className="text-zinc-300 text-sm ml-2">{name}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex gap-3 flex-wrap">
          {Object.entries(subshellColors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700/50">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-xs text-zinc-300 font-mono">{key}-orbital</span>
            </div>
          ))}
        </div>

        <Canvas shadows camera={{ position: [0, 3, 10], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#a855f7" />

          <Sparkles count={80} scale={15} size={1.5} speed={0.3} opacity={0.15} color="#06b6d4" />

          <AtomModel orbitals={orbitals} atomicNumber={atomicNumber} />
          <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} minDistance={3} maxDistance={25} />
        </Canvas>
      </div>

      {/* Shell breakdown table */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array.from(shellSummary.entries()).map(([shell, info]) => (
          <div key={shell} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Shell {shell}</div>
            <div className="text-lg font-bold text-white mt-1">{info.total} e⁻</div>
            <div className="text-xs text-zinc-400 font-mono mt-1">
              {info.subshells.join(" ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
