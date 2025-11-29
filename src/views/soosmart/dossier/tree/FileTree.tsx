'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import { Box, Square } from 'lucide-react'

import { FactureService } from '@/service/dossier/facture.service'
import LoadingWithoutModal from '@/components/LoadingWithoutModal'
import ErrorView from '@/components/ErrorView'
import TreeScene from './components/Tree3D/TreeScene'
import { Tree2DView } from './components/Tree2D'


const FileTree = ({ numero }: { numero: string }) => {
  const [type, setType] = useState<'2d' | '3d'>('2d')

  const querykey = useMemo(() => [FactureService.FACTURE_KEY, numero, 'tree'], [numero])

  const { data, isError, isLoading } = useQuery({
    queryKey: querykey,
    queryFn: async () => await FactureService.getThree(numero),
    enabled: !!numero
  })

  const handleType = (event: React.MouseEvent<HTMLElement>, newType: '2d' | '3d') => {
    setType(newType)
  }

  return isLoading ? (
    <LoadingWithoutModal />
  ) : isError ? (
    <ErrorView />
  ) : (
    data && (
      <div className="grid grid-cols-1 gap-2">
        <div className="flex justify-between mb-2">
          <div className="mr-2 flex items-center gap-2">
            <Typography>
              Type de vue : <span className="uppercase text-xl">{type}</span>
            </Typography>
          </div>
          <ToggleButtonGroup exclusive value={type} onChange={handleType} aria-label="text alignment">
            <Tooltip title="Vue 2D">
              <ToggleButton value="2d" aria-label="2d">
                <Square size={24} />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Vue 3D">
              <ToggleButton value="3d" aria-label="3d">
                <Box size={24} />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </div>
        <div className="h-[60dvh] border border-gray-300 rounded-md">
          {type === '2d' ? <Tree2DView tree={data} /> : <TreeScene tree={data} />}
        </div>
      </div>
    )
  )
}

export default FileTree
