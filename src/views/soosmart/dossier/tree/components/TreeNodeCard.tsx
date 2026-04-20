'use client'

import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import type { TreeNodeType } from '@/types/soosmart/dossier/TreeNode.type'
import type { TreeNodePosition } from './types'
import { getTypeConfig } from './utils'

interface TreeNodeCardProps {
  position: TreeNodePosition
  isSelected: boolean
  isCollapsed: boolean
  onSelect: (node: TreeNodeType) => void
  onToggleCollapse: (nodeId: string) => void
}

const CARD_WIDTH = 220

const TreeNodeCard = ({ position, isSelected, isCollapsed, onSelect, onToggleCollapse }: TreeNodeCardProps) => {
  const { node } = position
  const config = getTypeConfig(node.type)
  const originConfig = node.createdFrom ? getTypeConfig(node.createdFrom.type) : null
  const hasChildren = node.children && node.children.length > 0

  return (
    <div
      className='absolute'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
        width: `${CARD_WIDTH}px`,
        zIndex: isSelected ? 20 : 10
      }}
    >
      <div
        onClick={() => onSelect(node)}
        className={classnames(
          'relative rounded-lg border-2 bg-backgroundPaper cursor-pointer transition-all duration-200',
          'hover:shadow-lg hover:-translate-y-0.5',
          {
            'border-primary shadow-md shadow-primary/20': isSelected,
            'border-divider hover:border-primary/40': !isSelected
          }
        )}
      >
        {/* Header colored bar */}
        <div
          className='h-1.5 rounded-t-md'
          style={{
            backgroundColor: `var(--mui-palette-${config.color}-main)`
          }}
        />

        <div className='p-3'>
          {/* Type row */}
          <div className='flex items-center gap-2 mb-2'>
            <CustomAvatar color={config.color} skin='light' variant='rounded' size={32}>
              <i className={classnames(config.icon, 'text-[18px]')} />
            </CustomAvatar>
            <div className='flex-1 min-w-0'>
              <Typography variant='subtitle2' className='font-semibold truncate leading-tight'>
                {config.label}
              </Typography>
            </div>
          </div>

          {/* Numero */}
          {node.numero && (
            <div className='flex items-center gap-1.5 mb-1'>
              <i className='tabler-hash text-textDisabled text-sm' />
              <Typography variant='caption' className='text-textSecondary font-medium truncate'>
                {node.numero}
              </Typography>
            </div>
          )}

          {/* Reference */}
          {node.reference && (
            <div className='flex items-center gap-1.5 mb-1'>
              <i className='tabler-tag text-textDisabled text-sm' />
              <Typography variant='caption' className='text-textSecondary truncate'>
                {node.reference}
              </Typography>
            </div>
          )}

          {node.createdFrom && originConfig && (
            <div className='flex items-center gap-1.5 mt-2 rounded-md bg-actionHover px-2 py-1'>
              <i className='tabler-route text-textDisabled text-sm' />
              <Typography variant='caption' className='text-textSecondary truncate'>
                Depuis {originConfig.label}
              </Typography>
            </div>
          )}

          {/* Footer: adoption status + children */}
          <div className='flex items-center justify-between mt-2 pt-2 border-t border-divider'>
            {/* Adoption badge */}
            <div>
              {node.adopt !== null ? (
                <Chip
                  size='small'
                  label={node.adopt ? 'Adopté' : 'Non adopté'}
                  color={node.adopt ? 'success' : 'error'}
                  variant='tonal'
                  className='text-[10px] h-5'
                />
              ) : (
                <Chip size='small' label='—' variant='outlined' className='text-[10px] h-5' />
              )}
            </div>

            {/* Children collapse toggle */}
            {hasChildren && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  onToggleCollapse(node.id)
                }}
                className={classnames(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors',
                  'text-textSecondary hover:text-primary hover:bg-primaryLight/10'
                )}
                title={isCollapsed ? 'Développer' : 'Réduire'}
              >
                <i className='tabler-sitemap text-sm' />
                <span className='font-medium'>{node.children.length}</span>
                <i className={`tabler-chevron-${isCollapsed ? 'down' : 'up'} text-xs`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreeNodeCard
