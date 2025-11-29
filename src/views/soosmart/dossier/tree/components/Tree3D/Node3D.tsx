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
  onNodeClick,
  isCollapsed = false,
  onToggleCollapse,
  hasChildren = false,
  nodeSize = 0.5,
  highlightSearch = false
}: {
  node: TreeNodeType;
  position: [number, number, number];
  onNodeClick?: (node: TreeNodeType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (nodeId: string) => void;
  hasChildren?: boolean;
  nodeSize?: number;
  highlightSearch?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const collapseButtonRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [collapseHovered, setCollapseHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { camera, controls } = useThree();

  // Animation de respiration et glow pulsant
  useFrame((state) => {
    if (ref.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;

      ref.current.position.y = position[1] + breathe;

      // Scale au survol avec spring
      const targetScale = hovered ? 1.4 : clicked ? 1.2 : highlightSearch ? 1.3 : 1;

      ref.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
    }

    // Glow pulsant
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;

      glowRef.current.scale.setScalar(1.5 + pulse * 0.3);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = (hovered || highlightSearch ? 0.4 : 0.2) * pulse;
    }

    // Animation du bouton collapse
    if (collapseButtonRef.current) {
      collapseButtonRef.current.rotation.z = isCollapsed ? 0 : Math.PI / 2;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
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

  const handleCollapseClick = (e: any) => {
    e.stopPropagation();

    if (onToggleCollapse) {
      onToggleCollapse(node.id);
    }
  };

  return (
    <group>
      {/* Glow externe (halo néon) - plus grand si recherche correspond */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[nodeSize + 0.2, 32, 32]} />
        <meshBasicMaterial
          color={highlightSearch ? "#ffff00" : COLORS[node.type]}
          transparent
          opacity={0.2}
          side={THREE_NS.BackSide}
        />
      </mesh>

      {/* Nœud principal clickable - taille dynamique */}
      <mesh
        ref={ref}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[nodeSize, 32, 32]} />
        <meshStandardMaterial
          color={COLORS[node.type]}
          emissive={highlightSearch ? "#ffff00" : COLORS[node.type]}
          emissiveIntensity={highlightSearch ? 1.5 : hovered ? 1.2 : clicked ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Bouton Collapse/Expand pour les nœuds avec enfants */}
      {hasChildren && onToggleCollapse && (
        <mesh
          ref={collapseButtonRef}
          position={[position[0] + nodeSize + 0.3, position[1], position[2]]}
          onClick={handleCollapseClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setCollapseHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setCollapseHovered(false);
          }}
        >
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial
            color={collapseHovered ? "#00ffff" : "#ffffff"}
            emissive={collapseHovered ? "#00ffff" : "#ffffff"}
            emissiveIntensity={collapseHovered ? 1 : 0.5}
          />
        </mesh>
      )}

      {/* Ligne verticale pour le bouton + */}
      {hasChildren && onToggleCollapse && !isCollapsed && (
        <mesh position={[position[0] + nodeSize + 0.3, position[1], position[2]]}>
          <boxGeometry args={[0.03, 0.15, 0.03]} />
          <meshStandardMaterial
            color={collapseHovered ? "#00ffff" : "#ffffff"}
            emissive={collapseHovered ? "#00ffff" : "#ffffff"}
            emissiveIntensity={collapseHovered ? 1 : 0.5}
          />
        </mesh>
      )}

      {/* Anneau orbital autour du nœud */}
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[nodeSize + 0.3, 0.02, 16, 100]} />
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
        position={[position[0], position[1] + nodeSize + 0.7, position[2]]}
        fontSize={0.3}
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
          position={[position[0], position[1] + nodeSize + 0.4, position[2]]}
          fontSize={0.18}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          {node.numero || node.reference}
        </Text>
      )}

      {/* Badge nombre d'enfants */}
      {hasChildren && (
        <Html position={[position[0] + nodeSize + 0.5, position[1] + nodeSize, position[2]]}>
          <div className="bg-cyan-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {node.children?.length || 0}
          </div>
        </Html>
      )}

      {/* Info détaillée au survol */}
      {hovered && !clicked && (
        <Html position={[position[0], position[1] - nodeSize - 1, position[2]]} center>
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap border border-cyan-500 shadow-lg shadow-cyan-500/50">
            <div className="font-bold text-cyan-400 mb-1">{node.type}</div>
            {node.numero && <div className="text-xs">№ {node.numero}</div>}
            {node.reference && <div className="text-xs">Ref: {node.reference}</div>}
            <div className="text-xs text-gray-300 mt-1">
              {node.children?.length || 0} enfant{(node.children?.length || 0) > 1 ? 's' : ''}
            </div>
            {hasChildren && (
              <div className="text-xs text-yellow-400 mt-2">
                {isCollapsed ? '➕ Développer' : '➖ Réduire'}
              </div>
            )}
            <div className="text-xs text-cyan-400 mt-2">🖱️ Cliquer pour détails</div>
          </div>
        </Html>
      )}
    </group>
  );
}
