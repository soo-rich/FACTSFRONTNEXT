'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import type { TreeNodePosition } from './types'
import TreeNodeCard from './TreeNodeCard'
import TreeConnection from './TreeConnection'
import TreeNodeDetails from './TreeNodeDetails'
import TreeStats from './TreeStats'
import TreeToolbar from './TreeToolbar'
import { calculatePositions, calculateStats, matchesSearch, matchesFilter, collapseAllIds } from './utils'

interface TreeCanvasProps {
  tree: TreeNodeType
}

const MIN_SCALE = 0.3
const MAX_SCALE = 2
const ZOOM_STEP = 0.1

const TreeCanvas = ({ tree }: TreeCanvasProps) => {
  // State
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<TreeNodeEnumType | 'ALL'>('ALL')
  const [showStats, setShowStats] = useState(false)
  const [scale, setScale] = useState(0.85)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)

  // ---- Computed data ----

  const stats = useMemo(() => calculateStats(tree), [tree])

  const positions = useMemo(() => calculatePositions(tree, collapsedNodes), [tree, collapsedNodes])

  // Filter positions by search/filter
  const filteredPositions = useMemo(() => {
    return positions.filter(pos => matchesSearch(pos.node, searchQuery) && matchesFilter(pos.node, filterType))
  }, [positions, searchQuery, filterType])

  const filteredIds = useMemo(() => new Set(filteredPositions.map(p => p.node.id)), [filteredPositions])

  // Connections between visible nodes
  const connections = useMemo(() => {
    const conns: { from: TreeNodePosition; to: TreeNodePosition }[] = []

    filteredPositions.forEach(pos => {
      if (pos.node.children && !collapsedNodes.has(pos.node.id)) {
        pos.node.children.forEach(child => {
          if (filteredIds.has(child.id)) {
            const childPos = filteredPositions.find(p => p.node.id === child.id)

            if (childPos) {
              conns.push({ from: pos, to: childPos })
            }
          }
        })
      }
    })

    return conns
  }, [filteredPositions, filteredIds, collapsedNodes])

  // Calculate SVG canvas bounds
  const canvasBounds = useMemo(() => {
    if (filteredPositions.length === 0) return { width: 800, height: 600 }

    const xs = filteredPositions.map(p => p.x)
    const ys = filteredPositions.map(p => p.y)

    return {
      width: Math.max(800, Math.max(...xs) + 300),
      height: Math.max(600, Math.max(...ys) + 200)
    }
  }, [filteredPositions])

  // ---- Actions ----

  const toggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev)

      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }

      return next
    })
  }, [])

  const handleExpandAll = useCallback(() => {
    setCollapsedNodes(new Set())
  }, [])

  const handleCollapseAll = useCallback(() => {
    const ids = collapseAllIds(tree)

    setCollapsedNodes(new Set(ids))
  }, [tree])

  const handleResetView = useCallback(() => {
    setScale(0.85)
    setTranslate({ x: 0, y: 0 })
    setSelectedNode(null)
  }, [])

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_SCALE))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - ZOOM_STEP, MIN_SCALE))
  }, [])

  // ---- Wheel zoom ----

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * -0.001

      setScale(prev => Math.min(Math.max(MIN_SCALE, prev + delta), MAX_SCALE))
    }

    container.addEventListener('wheel', onWheel, { passive: false })

    return () => container.removeEventListener('wheel', onWheel)
  }, [])

  // ---- Pan ----

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Only if clicking on the canvas background
      const target = e.target as HTMLElement

      if (target === containerRef.current || target.tagName === 'svg' || target.closest('svg')) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y })
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Toolbar */}
      <Card className='rounded-b-none border-b border-divider shadow-none'>
        <CardContent className='py-3'>
          <TreeToolbar
            searchQuery={searchQuery}
            filterType={filterType}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilterType}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            onResetView={handleResetView}
            onToggleStats={() => setShowStats(!showStats)}
            showStats={showStats}
          />
        </CardContent>
      </Card>

      {/* Main area */}
      <div className='flex-1 flex overflow-hidden relative bg-backgroundDefault'>
        {/* Stats sidebar */}
        {showStats && (
          <div className='w-[280px] flex-shrink-0 p-3 border-r border-divider overflow-auto'>
            <TreeStats stats={stats} />
          </div>
        )}

        {/* Tree canvas */}
        <div
          ref={containerRef}
          className='flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {filteredPositions.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <i className='tabler-search-off text-5xl text-textDisabled' />
                <Typography variant='body1' color='text.secondary' className='mt-2'>
                  Aucun résultat trouvé
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  Essayez de modifier vos filtres de recherche
                </Typography>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                width: `${canvasBounds.width}px`,
                height: `${canvasBounds.height}px`,
                position: 'relative'
              }}
            >
              {/* SVG connections */}
              <svg
                className='absolute inset-0 pointer-events-none'
                width={canvasBounds.width}
                height={canvasBounds.height}
                style={{ zIndex: 1 }}
              >
                {connections.map((conn, i) => (
                  <TreeConnection key={`c-${i}`} from={conn.from} to={conn.to} />
                ))}
              </svg>

              {/* Node cards */}
              {filteredPositions.map(pos => (
                <TreeNodeCard
                  key={pos.node.id}
                  position={pos}
                  isSelected={selectedNode?.id === pos.node.id}
                  isCollapsed={collapsedNodes.has(pos.node.id)}
                  onSelect={setSelectedNode}
                  onToggleCollapse={toggleCollapse}
                />
              ))}
            </div>
          )}
        </div>

        {/* Node details panel */}
        {selectedNode && (
          <div className='w-[300px] flex-shrink-0 p-3 border-l border-divider overflow-auto'>
            <TreeNodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
          </div>
        )}

        {/* Zoom controls (bottom-right corner) */}
        <div className='absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-backgroundPaper border border-divider rounded-lg px-2 py-1 shadow-md'>
          <Tooltip title='Zoom arrière'>
            <IconButton size='small' onClick={handleZoomOut} disabled={scale <= MIN_SCALE}>
              <i className='tabler-minus text-sm' />
            </IconButton>
          </Tooltip>
          <Typography variant='caption' className='min-w-[40px] text-center font-medium text-textSecondary'>
            {Math.round(scale * 100)}%
          </Typography>
          <Tooltip title='Zoom avant'>
            <IconButton size='small' onClick={handleZoomIn} disabled={scale >= MAX_SCALE}>
              <i className='tabler-plus text-sm' />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default TreeCanvas
