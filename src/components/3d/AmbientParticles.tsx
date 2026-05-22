"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Floating glowing orbs 
function GlowOrbs() {
  const group = useRef<THREE.Group>(null);

  const orbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.5,
      color: i % 3 === 0 ? "#C9956A" : i % 3 === 1 ? "#8EA8A6" : "#A77C5B",
    })),
  []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.1;
    group.current.rotation.x = Math.cos(clock.elapsedTime * 0.03) * 0.05;
  });

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={orb.position}>
            <sphereGeometry args={[orb.scale, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              transparent
              opacity={0.12}
              emissive={orb.color}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Fine dust particles
function DustParticles({ count = 600 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => 
    Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      speed: 0.003 + Math.random() * 0.008,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 30,
      factor: 10 + Math.random() * 20,
    })),
  [count]);

  useFrame(() => {
    particles.forEach((p, i) => {
      p.t += p.speed;
      const a = Math.sin(p.t * 0.5) * p.factor;
      const b = Math.cos(p.t * 0.3) * p.factor;
      dummy.position.set(p.x + a * 0.1, p.y + b * 0.1, p.z);
      dummy.scale.setScalar(Math.abs(Math.sin(p.t)) * 0.5 + 0.1);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshBasicMaterial color="#C9956A" transparent opacity={0.25} />
    </instancedMesh>
  );
}

// Thin connecting lines
function WebLines() {
  const ref = useRef<THREE.LineSegments>(null);

  const { positions } = useMemo(() => {
    const pts: number[] = [];
    const nodes = Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 10,
    }));
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i < j) {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 14) {
            pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        }
      });
    });
    return { positions: new Float32Array(pts) };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.008;
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#A77C5B" transparent opacity={0.08} />
    </lineSegments>
  );
}

export default function AmbientParticles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ fov: 65, position: [0, 0, 30] }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#C9956A" />
        <pointLight position={[-10, -10, 5]} intensity={0.2} color="#8EA8A6" />
        <GlowOrbs />
        <DustParticles count={500} />
        <WebLines />
      </Canvas>
    </div>
  );
}
