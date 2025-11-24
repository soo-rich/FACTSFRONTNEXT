import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

import type { TreeNodeType } from "@/types/soosmart/dossier/TreeNode.type";
import { Node3D } from "./Node3D";

export function Tree3D({
  node,
  depth = 0,
  angle = 0,
  radius = 4,
  onNodeClick
}: {
  node: TreeNodeType;
  depth?: number;
  angle?: number;
  radius?: number;
  onNodeClick?: (node: TreeNodeType) => void;
}) {
  const groupRef = useRef<any>();

  const x = Math.cos(angle) * radius;
  const y = -depth * 2.5;
  const z = Math.sin(angle) * radius;

  const childCount = node.children?.length || 0;

  // Animation de rotation douce
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nœud principal */}
      <Node3D node={node} position={[x, y, z]} onNodeClick={onNodeClick} />

      {/* Lignes de connexion vers les enfants avec animation */}
      {node.children?.map((child, i) => {
        const step = (Math.PI * 2) / childCount;
        const childAngle = angle + (i - childCount / 2) * step;
        const childRadius = radius + 3;
        const childX = Math.cos(childAngle) * childRadius;
        const childY = -(depth + 1) * 2.5;
        const childZ = Math.sin(childAngle) * childRadius;

        return (
          <group key={child.id}>
            {/* Ligne de connexion animée avec effet néon */}
            <Line
              points={[
                [x, y, z],
                [childX, childY, childZ]
              ]}
              color="#00ffff"
              lineWidth={2}
              transparent
              opacity={0.6}
              dashed={false}
            />

            {/* Particules le long de la ligne */}
            <AnimatedParticle
              start={[x, y, z]}
              end={[childX, childY, childZ]}
              delay={i * 0.2}
            />

            {/* Enfant récursif */}
            <Tree3D
              node={child}
              depth={depth + 1}
              angle={childAngle}
              radius={childRadius}
              onNodeClick={onNodeClick}
            />
          </group>
        );
      })}
    </group>
  );
}

// Composant pour les particules animées le long des lignes
function AnimatedParticle({
  start,
  end,
  delay
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay: number;
}) {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      const t = ((state.clock.elapsedTime + delay) % 2) / 2;

      meshRef.current.position.x = start[0] + (end[0] - start[0]) * t;
      meshRef.current.position.y = start[1] + (end[1] - start[1]) * t;
      meshRef.current.position.z = start[2] + (end[2] - start[2]) * t;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
