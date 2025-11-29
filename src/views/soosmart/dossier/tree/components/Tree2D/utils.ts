import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import type { TreeNode2DPosition, TreeStats } from './types'

export const getNodeColor = (type: TreeNodeEnumType): string => {
  const colors = {
    FACTURE: 'bg-gradient-to-br from-blue-500 to-blue-700',
    BORDEREAU: 'bg-gradient-to-br from-purple-500 to-purple-700',
    BON_DE_COMMANDE: 'bg-gradient-to-br from-green-500 to-green-700',
    PROFORMA: 'bg-gradient-to-br from-orange-500 to-orange-700'
  }

  return colors[type] || 'bg-gradient-to-br from-gray-500 to-gray-700'
}

export const getNodeIcon = (type: TreeNodeEnumType): string => {
  const icons = {
    FACTURE: 'tabler-file-invoice',
    BORDEREAU: 'tabler-file-text',
    BON_DE_COMMANDE: 'tabler-shopping-cart',
    PROFORMA: 'tabler-file-dollar'
  }

  return icons[type] || 'tabler-file'
}

export const calculateTreePositions = (
  node: TreeNodeType,
  level: number = 0,
  offset: number = 0,
  levelWidths: number[] = []
): TreeNode2DPosition[] => {
  const HORIZONTAL_SPACING = 250
  const VERTICAL_SPACING = 150
  const START_X = 500
  const START_Y = 100

  const positions: TreeNode2DPosition[] = []

  // Calculer la largeur de ce niveau
  if (!levelWidths[level]) {
    levelWidths[level] = 0
  }

  const x = START_X + offset * HORIZONTAL_SPACING
  const y = START_Y + level * VERTICAL_SPACING

  const position: TreeNode2DPosition = {
    x,
    y,
    node,
    level
  }

  positions.push(position)

  // Traiter les enfants
  if (node.children && node.children.length > 0) {
    const childrenWidth = node.children.length
    const startOffset = offset - (childrenWidth - 1) / 2

    node.children.forEach((child, index) => {
      const childOffset = startOffset + index
      const childPositions = calculateTreePositions(child, level + 1, childOffset, levelWidths)

      positions.push(...childPositions)
    })
  }

  return positions
}

export const calculateTreeStats = (node: TreeNodeType, depth: number = 0): TreeStats => {
  const stats: TreeStats = {
    total: 1,
    byType: { [node.type]: 1 } as Record<TreeNodeEnumType, number>,
    maxDepth: depth,
    adopted: node.adopt ? 1 : 0,
    notAdopted: !node.adopt ? 1 : 0
  }

  node.children?.forEach(child => {
    const childStats = calculateTreeStats(child, depth + 1)

    stats.total += childStats.total
    stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth)
    stats.adopted += childStats.adopted
    stats.notAdopted += childStats.notAdopted

    Object.entries(childStats.byType).forEach(([type, count]) => {
      const nodeType = type as TreeNodeEnumType

      stats.byType[nodeType] = (stats.byType[nodeType] || 0) + count
    })
  })

  return stats
}

export const matchesSearch = (node: TreeNodeType, searchQuery: string): boolean => {
  if (!searchQuery) return true

  const query = searchQuery.toLowerCase()

  return (
    node.type.toLowerCase().includes(query) ||
    node.numero?.toLowerCase().includes(query) ||
    node.reference?.toLowerCase().includes(query) ||
    false
  )
}

export const matchesFilter = (node: TreeNodeType, filterType: TreeNodeEnumType | 'ALL'): boolean => {
  if (filterType === 'ALL') return true

  return node.type === filterType
}
