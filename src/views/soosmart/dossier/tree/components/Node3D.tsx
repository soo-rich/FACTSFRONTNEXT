import { useRef, useState } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import type * as THREE from "three";
import * as THREE_NS from "three";

import type { TreeNodeType } from "@/types/soosmart/dossier/TreeNode.type";
import { COLORS } from "@/utils/treenode.utils";

export function Node3D({
  node,
  position,
  onNodeClick
}: {
  node: TreeNodeType;
  position: [number, number, number];
  onNodeClick?: (node: TreeNodeType) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { camera, controls } = useThree();

  // Animation de respiration et glow pulsant
  useFrame((state) => {
    if (ref.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;

      ref.current.position.y = position[1] + breathe;

      // Scale au survol avec spring
      const targetScale = hovered ? 1.4 : clicked ? 1.2 : 1;

      ref.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
    }

    // Glow pulsant
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;

      glowRef.current.scale.setScalar(1.5 + pulse * 0.3);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = (hovered ? 0.4 : 0.2) * pulse;
    }
  });

  const handleClick = () => {
    setClicked(!clicked);

    if (onNodeClick) {
      onNodeClick(node);
    }

    // Zoom automatique sur le nœud
    if (ref.current && controls) {
      const targetPosition = new THREE_NS.Vector3(position[0], position[1], position[2]);

      (controls as any).target.copy(targetPosition);
      camera.position.lerp(
        new THREE_NS.Vector3(position[0] + 5, position[1] + 3, position[2] + 5),
        0.5
      );
    }
  };

  return (
    <group>
      {/* Glow externe (halo néon) */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color={COLORS[node.type]}
          transparent
          opacity={0.2}
          side={THREE_NS.BackSide}
        />
      </mesh>

      {/* Nœud principal clickable */}
      <mesh
        ref={ref}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={COLORS[node.type]}
          emissive={COLORS[node.type]}
          emissiveIntensity={hovered ? 1.2 : clicked ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Anneau orbital autour du nœud */}
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={COLORS[node.type]}
          emissive={COLORS[node.type]}
          emissiveIntensity={0.5}
          transparent
          opacity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Texte 3D avec effet néon */}
      <Text
        position={[position[0], position[1] + 1.2, position[2]]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor={COLORS[node.type]}
        outlineOpacity={0.8}
      >
        {node.type}
      </Text>

      {/* Sous-titre avec numéro/référence */}
      {(node.numero || node.reference) && (
        <Text
          position={[position[0], position[1] + 0.8, position[2]]}
          fontSize={0.2}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          {node.numero || node.reference}
        </Text>
      )}

      {/* Info détaillée au survol */}
      {hovered && !clicked && (
        <Html position={[position[0], position[1] - 1.5, position[2]]} center>
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap border border-cyan-500 shadow-lg shadow-cyan-500/50">
            <div className="font-bold text-cyan-400 mb-1">{node.type}</div>
            {node.numero && <div className="text-xs">№ {node.numero}</div>}
            {node.reference && <div className="text-xs">Ref: {node.reference}</div>}
            <div className="text-xs text-gray-300 mt-1">
              {node.children?.length || 0} enfant{(node.children?.length || 0) > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-cyan-400 mt-2">🖱️ Cliquer pour détails</div>
          </div>
        </Html>
      )}
    </group>
  );
}
