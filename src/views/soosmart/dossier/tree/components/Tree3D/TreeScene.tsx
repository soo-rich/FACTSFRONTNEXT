import { useState, useMemo } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";

import { Tree3D } from "./Tree3D";
import type { TreeNodeType, TreeNodeEnumType } from "@/types/soosmart/dossier/TreeNode.type";

export default function TreeScene({ tree }: { tree: TreeNodeType }) {
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TreeNodeEnumType | "ALL">("ALL");
  const [showStats, setShowStats] = useState(true);

  // Calculer les statistiques de l'arbre
  const stats = useMemo(() => {
    const calculate = (node: TreeNodeType, depth = 0): any => {
      const stats = {
        total: 1,
        byType: { [node.type]: 1 } as Record<string, number>,
        maxDepth: depth,
        adopted: node.adopt ? 1 : 0,
        notAdopted: !node.adopt ? 1 : 0
      };

      node.children?.forEach(child => {
        const childStats = calculate(child, depth + 1);

        stats.total += childStats.total;
        stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
        stats.adopted += childStats.adopted;
        stats.notAdopted += childStats.notAdopted;

        Object.entries(childStats.byType).forEach(([type, count]) => {
          stats.byType[type] = (stats.byType[type] || 0) + (count as number);
        });
      });

      return stats;
    };

    return calculate(tree);
  }, [tree]);

  // Fonction pour toggler le collapse d'un nœud
  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);

      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }

      return newSet;
    });
  };

  // Filtrer les nœuds selon la recherche
  const matchesSearch = (node: TreeNodeType): boolean => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    return (
      node.type.toLowerCase().includes(query) ||
      node.numero?.toLowerCase().includes(query) ||
      node.reference?.toLowerCase().includes(query) ||
      false
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Barre de recherche et filtres */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-black bg-opacity-50 backdrop-blur-md p-4 rounded-xl border border-cyan-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher (numéro, référence, type)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 bg-gray-900 text-white rounded-lg border border-cyan-500/50 focus:border-cyan-500 outline-none text-sm min-w-[250px]"
          />
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            title="Statistiques"
          >
            <i className="tabler-chart-bar" />
          </button>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TreeNodeEnumType | "ALL")}
          className="px-3 py-2 bg-gray-900 text-white rounded-lg border border-cyan-500/50 focus:border-cyan-500 outline-none text-sm"
        >
          <option value="ALL">Tous les types</option>
          <option value="FACTURE">Factures</option>
          <option value="BORDEREAU">Bordereaux</option>
          <option value="BON_DE_COMMANDE">Bons de commande</option>
          <option value="PROFORMA">Proformas</option>
        </select>
      </div>

      {/* Panel de statistiques */}
      {showStats && (
        <div className="absolute top-4 left-4 mt-32 z-10 bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-95 backdrop-blur-md p-6 rounded-xl border border-cyan-500 shadow-2xl shadow-cyan-500/20 min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-cyan-400">📊 Statistiques</h3>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-400 hover:text-white"
            >
              <i className="tabler-x" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total nœuds:</span>
              <span className="font-bold text-white">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profondeur max:</span>
              <span className="font-bold text-white">{stats.maxDepth}</span>
            </div>

            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="text-gray-400 mb-2">Par type:</div>
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-300">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${(((count as number) / stats.total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white w-6 text-right">{String(count)}</span>
                  </div>
                </div>
              ))}
            </div>

            {stats.adopted > 0 && (
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="text-gray-400 mb-2">Adoption:</div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">✓ Adoptés: {stats.adopted}</span>
                  <span className="text-red-400">✗ Non adoptés: {stats.notAdopted}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        <Tree3D
          node={tree}
          onNodeClick={setSelectedNode}
          collapsedNodes={collapsedNodes}
          onToggleCollapse={toggleCollapse}
          searchQuery={searchQuery}
          filterType={filterType}
          matchesSearch={matchesSearch}
        />

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
        <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-900 to-blue-900 bg-opacity-95 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl border border-cyan-500 max-w-md z-10">
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
