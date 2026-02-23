import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import type { NodeTypeConfig, NodeTypeConfigMap, TreeNodePosition, TreeStatsData } from './types'

// ---- Type config ----

export const NODE_TYPE_CONFIG: NodeTypeConfigMap = {
  FACTURE: {
    label: 'Facture',
    icon: 'tabler-file-invoice',
    color: 'primary'
  },
  BORDEREAU: {
    label: 'Bordereau',
    icon: 'tabler-file-text',
    color: 'info'
  },
  BON_DE_COMMANDE: {
    label: 'Bon de commande',
    icon: 'tabler-shopping-cart',
    color: 'success'
  },
  PROFORMA: {
    label: 'Proforma',
    icon: 'tabler-file-dollar',
    color: 'warning'
  }
}

export const getTypeConfig = (type: TreeNodeEnumType): NodeTypeConfig => {
  return (
    NODE_TYPE_CONFIG[type] ?? {
      label: type,
      icon: 'tabler-file',
      color: 'secondary' as const
    }
  )
}

// ---- Layout algorithm ----

const CARD_WIDTH = 220
const H_GAP = 40
const V_GAP = 120
const START_Y = 40

function getSubtreeLeafCount(node: TreeNodeType, collapsed: Set<string>): number {
  if (!node.children || node.children.length === 0 || collapsed.has(node.id)) {
    return 1
  }

  return node.children.reduce((sum, c) => sum + getSubtreeLeafCount(c, collapsed), 0)
}

export function calculatePositions(
  node: TreeNodeType,
  collapsed: Set<string>,
  level = 0,
  startX = 0
): TreeNodePosition[] {
  const positions: TreeNodePosition[] = []
  const unitWidth = CARD_WIDTH + H_GAP
  const subtreeWidth = getSubtreeLeafCount(node, collapsed) * unitWidth

  const x = startX + subtreeWidth / 2
  const y = START_Y + level * (V_GAP + 80)

  positions.push({ x, y, node, level, index: 0 })

  if (node.children && node.children.length > 0 && !collapsed.has(node.id)) {
    let childStartX = startX

    node.children.forEach((child, i) => {
      const childWidth = getSubtreeLeafCount(child, collapsed) * unitWidth
      const childPositions = calculatePositions(child, collapsed, level + 1, childStartX)

      childPositions.forEach((pos, j) => {
        pos.index = j === 0 ? i : pos.index
      })

      positions.push(...childPositions)

      childStartX += childWidth
    })
  }

  return positions
}

// ---- Stats ----

export function calculateStats(node: TreeNodeType, depth = 0): TreeStatsData {
  const stats: TreeStatsData = {
    total: 1,
    maxDepth: depth,
    byType: { [node.type]: 1 },
    adopted: node.adopt === true ? 1 : 0,
    notAdopted: node.adopt === false ? 1 : 0,
    unknown: node.adopt === null ? 1 : 0
  }

  node.children?.forEach(child => {
    const childStats = calculateStats(child, depth + 1)

    stats.total += childStats.total
    stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth)
    stats.adopted += childStats.adopted
    stats.notAdopted += childStats.notAdopted
    stats.unknown += childStats.unknown

    Object.entries(childStats.byType).forEach(([type, count]) => {
      stats.byType[type] = (stats.byType[type] || 0) + count
    })
  })

  return stats
}

// ---- Search & filter ----

export function matchesSearch(node: TreeNodeType, query: string): boolean {
  if (!query.trim()) return true

  const q = query.toLowerCase()

  return (
    node.type.toLowerCase().includes(q) ||
    (node.numero?.toLowerCase().includes(q) ?? false) ||
    (node.reference?.toLowerCase().includes(q) ?? false) ||
    (node.createdFrom?.type.toLowerCase().includes(q) ?? false) ||
    (node.createdFrom?.numero?.toLowerCase().includes(q) ?? false) ||
    (node.createdFrom?.reference?.toLowerCase().includes(q) ?? false) ||
    (getTypeConfig(node.type).label.toLowerCase().includes(q) ?? false)
  )
}

export function matchesFilter(node: TreeNodeType, filterType: TreeNodeEnumType | 'ALL'): boolean {
  if (filterType === 'ALL') return true

  return node.type === filterType
}

// ---- Utilities ----

export function flattenTree(node: TreeNodeType): TreeNodeType[] {
  const nodes: TreeNodeType[] = [node]

  node.children?.forEach(child => {
    nodes.push(...flattenTree(child))
  })

  return nodes
}

export function expandAllIds(node: TreeNodeType): string[] {
  const ids: string[] = []

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      ids.push(...expandAllIds(child))
    })
  }

  return ids
}

export function collapseAllIds(node: TreeNodeType): string[] {
  const ids: string[] = []

  if (node.children && node.children.length > 0) {
    ids.push(node.id)

    node.children.forEach(child => {
      ids.push(...collapseAllIds(child))
    })
  }

  return ids
}
