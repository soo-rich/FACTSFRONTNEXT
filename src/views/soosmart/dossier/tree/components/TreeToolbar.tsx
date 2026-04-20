'use client'

import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { TreeNodeEnumType } from '@/types/soosmart/dossier/TreeNode.type'
import { NODE_TYPE_CONFIG } from './utils'

interface TreeToolbarProps {
  searchQuery: string
  filterType: TreeNodeEnumType | 'ALL'
  onSearchChange: (query: string) => void
  onFilterChange: (type: TreeNodeEnumType | 'ALL') => void
  onExpandAll: () => void
  onCollapseAll: () => void
  onResetView: () => void
  onToggleStats: () => void
  showStats: boolean
}

const TreeToolbar = ({
  searchQuery,
  filterType,
  onSearchChange,
  onFilterChange,
  onExpandAll,
  onCollapseAll,
  onResetView,
  onToggleStats,
  showStats
}: TreeToolbarProps) => {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      {/* Search */}
      <TextField
        size='small'
        placeholder='Rechercher...'
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-search text-lg' />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position='end'>
                <IconButton size='small' onClick={() => onSearchChange('')}>
                  <i className='tabler-x text-sm' />
                </IconButton>
              </InputAdornment>
            ) : null
          }
        }}
        className='min-w-[200px]'
      />

      {/* Filter by type */}
      <TextField
        select
        size='small'
        value={filterType}
        onChange={e => onFilterChange(e.target.value as TreeNodeEnumType | 'ALL')}
        className='min-w-[160px]'
      >
        <MenuItem value='ALL'>Tous les types</MenuItem>
        {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => (
          <MenuItem key={type} value={type}>
            <span className='flex items-center gap-2'>
              <i className={`${config.icon} text-sm`} />
              {config.label}
            </span>
          </MenuItem>
        ))}
      </TextField>

      {/* Actions */}
      <div className='flex items-center gap-1 ml-auto'>
        <Tooltip title='Tout développer'>
          <IconButton size='small' onClick={onExpandAll}>
            <i className='tabler-arrows-maximize text-lg' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Tout réduire'>
          <IconButton size='small' onClick={onCollapseAll}>
            <i className='tabler-arrows-minimize text-lg' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Réinitialiser la vue'>
          <IconButton size='small' onClick={onResetView}>
            <i className='tabler-focus-centered text-lg' />
          </IconButton>
        </Tooltip>
        <Tooltip title={showStats ? 'Masquer les stats' : 'Statistiques'}>
          <IconButton size='small' onClick={onToggleStats} color={showStats ? 'primary' : 'default'}>
            <i className='tabler-chart-bar text-lg' />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default TreeToolbar
