import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'

export interface TreeNode2DPosition {
  x: number
  y: number
  node: TreeNodeType
  level: number
}

export interface Tree2DProps {
  tree: TreeNodeType
}

export interface TreeNodeCardProps {
  node: TreeNodeType
  position: TreeNode2DPosition
  isSelected: boolean
  isCollapsed: boolean
  matchesSearch: boolean
  matchesFilter: boolean
  onClick: (node: TreeNodeType) => void
  onToggleCollapse: (nodeId: string) => void
}

export interface TreeConnectionProps {
  from: TreeNode2DPosition
  to: TreeNode2DPosition
}

export interface TreeStatsProps {
  stats: TreeStats
  onClose: () => void
}

export interface TreeStats {
  total: number
  byType: Record<TreeNodeEnumType, number>
  maxDepth: number
  adopted: number
  notAdopted: number
}

export interface TreeFiltersProps {
  searchQuery: string
  filterType: TreeNodeEnumType | 'ALL'
  showStats: boolean
  onSearchChange: (query: string) => void
  onFilterChange: (type: TreeNodeEnumType | 'ALL') => void
  onToggleStats: () => void
}

export interface TreeNodeDetailsProps {
  node: TreeNodeType
  onClose: () => void
}
