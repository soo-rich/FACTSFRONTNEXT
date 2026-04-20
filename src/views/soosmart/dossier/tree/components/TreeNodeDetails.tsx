'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import type { TreeNodeType } from '@/types/soosmart/dossier/TreeNode.type'
import { getTypeConfig } from './utils'

interface TreeNodeDetailsProps {
  node: TreeNodeType
  onClose: () => void
}

const TreeNodeDetails = ({ node, onClose }: TreeNodeDetailsProps) => {
  const config = getTypeConfig(node.type)
  const originConfig = node.createdFrom ? getTypeConfig(node.createdFrom.type) : null

  return (
    <Card className='min-w-[280px] max-w-[320px] shadow-xl'>
      <CardContent className='p-0'>
        {/* Header */}
        <div
          className='px-4 py-3 flex items-center justify-between'
          style={{ backgroundColor: `var(--mui-palette-${config.color}-lightOpacity)` }}
        >
          <div className='flex items-center gap-3'>
            <CustomAvatar color={config.color} skin='light' variant='rounded' size={36}>
              <i className={classnames(config.icon, 'text-[20px]')} />
            </CustomAvatar>
            <div>
              <Typography variant='subtitle1' className='font-bold'>
                {config.label}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Détails du document
              </Typography>
            </div>
          </div>
          <IconButton size='small' onClick={onClose}>
            <i className='tabler-x text-lg' />
          </IconButton>
        </div>

        <Divider />

        {/* Details */}
        <div className='p-4 space-y-3'>
          <DetailRow label='Type' value={config.label} icon='tabler-category' />

          {node.numero && <DetailRow label='Numéro' value={node.numero} icon='tabler-hash' />}

          {node.reference && <DetailRow label='Référence' value={node.reference} icon='tabler-tag' />}

          {originConfig && <DetailRow label='Créé depuis' value={originConfig.label} icon='tabler-route' />}

          {node.createdFrom?.numero && (
            <DetailRow label='Numéro source' value={node.createdFrom.numero} icon='tabler-hash' />
          )}

          {node.createdFrom?.reference && (
            <DetailRow label='Référence source' value={node.createdFrom.reference} icon='tabler-link' />
          )}

          <DetailRow label='Enfants' value={`${node.children?.length ?? 0} document(s)`} icon='tabler-sitemap' />

          <Divider />

          {/* Adoption status */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <i className='tabler-check-circle text-textSecondary' />
              <Typography variant='body2' color='text.secondary'>
                Adoption
              </Typography>
            </div>
            {node.adopt !== null ? (
              <Chip
                size='small'
                label={node.adopt ? 'Adopté' : 'Non adopté'}
                color={node.adopt ? 'success' : 'error'}
                variant='tonal'
              />
            ) : (
              <Chip size='small' label='Non défini' variant='outlined' />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const DetailRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className='flex items-start gap-2'>
    <i className={classnames(icon, 'text-textDisabled mt-0.5')} />
    <div className='flex-1 min-w-0'>
      <Typography variant='caption' color='text.disabled' className='block leading-tight'>
        {label}
      </Typography>
      <Typography variant='body2' className='font-medium truncate'>
        {value}
      </Typography>
    </div>
  </div>
)

export default TreeNodeDetails
