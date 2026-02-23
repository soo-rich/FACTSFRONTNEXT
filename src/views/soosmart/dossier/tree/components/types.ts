import type { TreeNodeType, TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import type { ThemeColor } from '@core/types'

// --- Position calculation types ---

export interface TreeNodePosition {
  x: number
  y: number
  node: TreeNodeType
  level: number
  index: number
}

// --- Stats ---

export interface TreeStatsData {
  total: number
  maxDepth: number
  byType: Record<string, number>
  adopted: number
  notAdopted: number
  unknown: number
}

// --- Config for type colors/icons ---

export interface NodeTypeConfig {
  label: string
  icon: string
  color: ThemeColor
}

export type NodeTypeConfigMap = Record<TreeNodeEnumType, NodeTypeConfig>
