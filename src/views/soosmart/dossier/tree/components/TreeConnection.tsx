'use client'

import type { TreeNodePosition } from './types'
import { getTypeConfig } from './utils'

interface TreeConnectionProps {
  from: TreeNodePosition
  to: TreeNodePosition
}

const CARD_HEIGHT = 120

const TreeConnection = ({ from, to }: TreeConnectionProps) => {
  const fromConfig = getTypeConfig(from.node.type)

  const x1 = from.x
  const y1 = from.y + CARD_HEIGHT
  const x2 = to.x
  const y2 = to.y

  const midY = y1 + (y2 - y1) / 2

  // Stepped path: vertical down, horizontal, vertical down
  const path = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`

  return (
    <g>
      <path
        d={path}
        fill='none'
        stroke='var(--mui-palette-divider)'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Arrow head at destination */}
      <polygon
        points={`${x2 - 4},${y2 - 6} ${x2 + 4},${y2 - 6} ${x2},${y2}`}
        fill={`var(--mui-palette-${fromConfig.color}-main)`}
        opacity='0.8'
      />
    </g>
  )
}

export default TreeConnection
