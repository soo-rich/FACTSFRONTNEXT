import type { TreeNodeCardProps } from './types'
import { getNodeColor, getNodeIcon } from '@/views/soosmart/dossier/tree/components/Tree2D/utils'

export const TreeNodeCard = ({
  node,
  position,
  isSelected,
  isCollapsed,
  matchesSearch,
  matchesFilter,
  onClick,
  onToggleCollapse
}: TreeNodeCardProps) => {
  const hasChildren = node.children && node.children.length > 0
  const color = getNodeColor(node.type)
  const icon = getNodeIcon(node.type)

  if (!matchesSearch || !matchesFilter) {
    return null
  }

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onClick={() => onClick(node)}
    >
      <div
        className={`
          relative min-w-[200px] p-4 rounded-lg shadow-lg transition-all duration-300
          ${isSelected ? 'ring-4 ring-cyan-400 scale-110' : 'hover:scale-105'}
          ${color}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1">
            <i className={`${icon} text-xl`} />
            <span className="font-bold text-sm uppercase">{node.type}</span>
          </div>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleCollapse(node.id)
              }}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              title={isCollapsed ? 'Développer' : 'Réduire'}
            >
              <i className={`tabler-chevron-${isCollapsed ? 'down' : 'up'} text-lg`} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1 text-sm">
          {node.numero && (
            <div className="flex items-center gap-2">
              <span className="text-white/70">N°:</span>
              <span className="font-semibold text-white">{node.numero}</span>
            </div>
          )}
          {node.reference && (
            <div className="flex items-center gap-2">
              <span className="text-white/70">Ref:</span>
              <span className="font-medium text-white truncate">{node.reference}</span>
            </div>
          )}
          {hasChildren && (
            <div className="flex items-center gap-2 mt-2">
              <i className="tabler-hierarchy-2 text-white/70" />
              <span className="text-white/70 text-xs">
                {node.children.length} enfant{node.children.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Adoption Badge */}
        {node.adopt !== null && (
          <div
            className={`
              absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
              ${node.adopt ? 'bg-green-500' : 'bg-red-500'}
              shadow-lg
            `}
            title={node.adopt ? 'Adopté' : 'Non adopté'}
          >
            <i className={`tabler-${node.adopt ? 'check' : 'x'} text-white text-sm`} />
          </div>
        )}
      </div>
    </div>
  )
}
