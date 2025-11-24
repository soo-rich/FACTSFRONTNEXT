import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type * as THREE from "three";

import type { TreeNodeType } from "@/types/soosmart/dossier/TreeNode.type";
import { COLORS } from "@/utils/treenode.utils";

export function Node3D({ node, position }: { node: TreeNodeType; position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  // animation breathing
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(Date.now() * 0.002 + ref.current.id) * 0.002;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={COLORS[node.type]} />
      </mesh>

      <Text position={[position[0], position[1] + 0.8, position[2]]} fontSize={0.3} color="white">
        {node.type}
      </Text>
    </group>
  );
}
