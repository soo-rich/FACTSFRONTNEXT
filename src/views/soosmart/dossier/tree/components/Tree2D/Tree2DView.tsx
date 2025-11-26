'use client'

import { useState, useMemo, useRef, useEffect } from 'react'

import type { Tree2DProps, TreeNode2DPosition } from './types'
import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import { TreeNodeCard } from './TreeNodeCard'
import { TreeConnection } from './TreeConnection'
import { TreeFilters } from './TreeFilters'
import { TreeStats } from './TreeStats'
import { TreeNodeDetails } from './TreeNodeDetails'
import {
  calculateTreePositions,
  calculateTreeStats,
  matchesSearch as checkMatchesSearch,
  matchesFilter as checkMatchesFilter
} from './utils'

export const Tree2DView = ({ tree }: Tree2DProps) => {
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<TreeNodeEnumType | 'ALL'>('ALL')
  const [showStats, setShowStats] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculer les positions des nœuds
  const positions = useMemo(() => {
    return calculateTreePositions(tree)
  }, [tree])

  // Calculer les statistiques
  const stats = useMemo(() => {
    return calculateTreeStats(tree)
  }, [tree])

  // Gérer le collapse des nœuds
  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }

      return newSet
    })
  }

  // Filtrer les positions visibles
  const visiblePositions = useMemo(() => {
    const visible = new Set<string>()

    const checkVisible = (pos: TreeNode2DPosition): boolean => {
      if (collapsedNodes.has(pos.node.id)) {
        return false
      }

      const parentPos = positions.find((p) =>
        p.node.children?.some((child) => child.id === pos.node.id)
      )

      if (parentPos && !checkVisible(parentPos)) {
        return false
      }

      visible.add(pos.node.id)

      return true
    }

    return positions.filter((pos) => {
      const isVisible = pos.level === 0 || checkVisible(pos)
      const matchSearch = checkMatchesSearch(pos.node, searchQuery)
      const matchFilter = checkMatchesFilter(pos.node, filterType)

      return isVisible && matchSearch && matchFilter
    })
  }, [positions, collapsedNodes, searchQuery, filterType])

  // Créer les connexions
  const connections = useMemo(() => {
    const conns: { from: TreeNode2DPosition; to: TreeNode2DPosition }[] = []

    visiblePositions.forEach((pos) => {
      if (pos.node.children && !collapsedNodes.has(pos.node.id)) {
        pos.node.children.forEach((child) => {
          const childPos = visiblePositions.find((p) => p.node.id === child.id)

          if (childPos) {
            conns.push({ from: pos, to: childPos })
          }
        })
      }
    })

    return conns
  }, [visiblePositions, collapsedNodes])

  // Gestion du zoom avec useEffect pour éviter l'erreur passive event listener
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * -0.001
      const newScale = Math.min(Math.max(0.5, scale + delta), 2)

      setScale(newScale)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => container.removeEventListener('wheel', handleWheel)
  }, [scale])

  // Gestion du drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === e.currentTarget) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Réinitialiser la vue
  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Contrôles en haut */}
      <div className="absolute top-4 left-4 z-20">
        <TreeFilters
          searchQuery={searchQuery}
          filterType={filterType}
          showStats={showStats}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onToggleStats={() => setShowStats(!showStats)}
        />
      </div>

      {/* Stats */}
      {showStats && (
        <div className="absolute top-4 left-4 mt-32 z-20">
          <TreeStats stats={stats} onClose={() => setShowStats(false)} />
        </div>
      )}

      {/* Contrôles de zoom */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setScale(Math.min(scale + 0.1, 2))}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom avant"
        >
          <i className="tabler-zoom-in text-xl" />
        </button>
        <button
          onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom arrière"
        >
          <i className="tabler-zoom-out text-xl" />
        </button>
        <button
          onClick={resetView}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-lg transition-colors"
          title="Réinitialiser"
        >
          <i className="tabler-refresh text-xl" />
        </button>
      </div>

      {/* Détails du nœud sélectionné */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-20">
          <TreeNodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>
      )}

      {/* Canvas de l'arbre */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative w-full h-full transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Dessiner les connexions en premier */}
          {connections.map((conn, index) => (
            <TreeConnection key={`conn-${index}`} from={conn.from} to={conn.to} />
          ))}

          {/* Dessiner les nœuds */}
          {visiblePositions.map((pos) => (
            <TreeNodeCard
              key={pos.node.id}
              node={pos.node}
              position={pos}
              isSelected={selectedNode?.id === pos.node.id}
              isCollapsed={collapsedNodes.has(pos.node.id)}
              matchesSearch={checkMatchesSearch(pos.node, searchQuery)}
              matchesFilter={checkMatchesFilter(pos.node, filterType)}
              onClick={setSelectedNode}
              onToggleCollapse={toggleCollapse}
            />
          ))}
        </div>
      </div>

      {/* Indicateur de zoom */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm text-gray-700 dark:text-gray-200">
        Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
