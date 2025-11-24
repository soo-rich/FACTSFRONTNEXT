import { useState } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";

import { Tree3D } from "./Tree3D";
import type { TreeNodeType } from "@/types/soosmart/dossier/TreeNode.type";

export default function TreeScene({ tree }: { tree: TreeNodeType }) {
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null);

  return (
    <div className="relative w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />

        {/* Éclairage néon futuriste */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#ff00ff" />
        <pointLight position={[10, -5, 10]} intensity={0.8} color="#00ff00" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" />

        {/* Fond étoilé */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Arbre 3D */}
        <Tree3D node={tree} onNodeClick={setSelectedNode} />

        {/* Contrôles de caméra */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Panel d'information du nœud sélectionné */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-900 to-blue-900 bg-opacity-95 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl border border-cyan-500 max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-cyan-400">{selectedNode.type}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="tabler-x text-xl" />
            </button>
          </div>
          <div className="space-y-2">
            {selectedNode.numero && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Numéro:</span>
                <span className="font-semibold">{selectedNode.numero}</span>
              </div>
            )}
            {selectedNode.reference && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Référence:</span>
                <span className="font-semibold">{selectedNode.reference}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Enfants:</span>
              <span className="font-semibold">{selectedNode.children?.length || 0}</span>
            </div>
            {selectedNode.adopt !== null && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Adopté:</span>
                <span className={`font-semibold ${selectedNode.adopt ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedNode.adopt ? 'Oui' : 'Non'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
