import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { Tree3D } from "./Tree3D";
import type { TreeNodeType } from "@/types/soosmart/dossier/TreeNode.type";

export default function TreeScene({ tree }: { tree: TreeNodeType }) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Stars radius={50} />

      <Tree3D node={tree} />

      <OrbitControls />
    </Canvas>
  );
}
