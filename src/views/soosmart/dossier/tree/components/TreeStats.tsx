'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import type { TreeStatsData } from './types'
import { NODE_TYPE_CONFIG } from './utils'

interface TreeStatsProps {
  stats: TreeStatsData
}

const TreeStats = ({ stats }: TreeStatsProps) => {
  return (
    <Card className='shadow-md'>
      <CardContent className='space-y-4'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <CustomAvatar color='primary' skin='light' variant='rounded' size={36}>
            <i className={classnames('tabler-chart-treemap', 'text-[20px]')} />
          </CustomAvatar>
          <div>
            <Typography variant='subtitle1' className='font-bold'>
              Statistiques
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {stats.total} document{stats.total > 1 ? 's' : ''} • Profondeur: {stats.maxDepth}
            </Typography>
          </div>
        </div>

        <Divider />

        {/* By type */}
        <div className='space-y-2'>
          <Typography variant='caption' color='text.secondary' className='font-semibold uppercase tracking-wide'>
            Par type
          </Typography>
          {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => {
            const count = stats.byType[type] ?? 0
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0

            return (
              <div key={type} className='flex items-center gap-3'>
                <CustomAvatar color={config.color} skin='light' variant='rounded' size={24}>
                  <i className={classnames(config.icon, 'text-[14px]')} />
                </CustomAvatar>
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-center mb-0.5'>
                    <Typography variant='caption' className='font-medium'>
                      {config.label}
                    </Typography>
                    <Typography variant='caption' className='font-bold'>
                      {count}
                    </Typography>
                  </div>
                  <LinearProgress variant='determinate' value={pct} color={config.color} className='h-1.5 rounded' />
                </div>
              </div>
            )
          })}
        </div>

        <Divider />

        {/* Adoption */}
        <div className='space-y-2'>
          <Typography variant='caption' color='text.secondary' className='font-semibold uppercase tracking-wide'>
            Adoption
          </Typography>
          <div className='flex gap-2 flex-wrap'>
            <Chip
              size='small'
              icon={<i className='tabler-check text-sm' />}
              label={`${stats.adopted} adopté${stats.adopted > 1 ? 's' : ''}`}
              color='success'
              variant='tonal'
            />
            <Chip
              size='small'
              icon={<i className='tabler-x text-sm' />}
              label={`${stats.notAdopted} non adopté${stats.notAdopted > 1 ? 's' : ''}`}
              color='error'
              variant='tonal'
            />
            {stats.unknown > 0 && (
              <Chip
                size='small'
                label={`${stats.unknown} non défini${stats.unknown > 1 ? 's' : ''}`}
                variant='outlined'
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TreeStats
