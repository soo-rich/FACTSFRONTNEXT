'use client'

import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { FactureService } from '@/service/dossier/facture.service'
import LoadingWithoutModal from '@/components/LoadingWithoutModal'
import ErrorView from '@/components/ErrorView'
import { TreeCanvas } from './components'

const FileTree = ({ numero }: { numero: string }) => {
  const querykey = useMemo(() => [FactureService.FACTURE_KEY, numero, 'tree'], [numero])

  const { data, isError, isLoading } = useQuery({
    queryKey: querykey,
    queryFn: async () => await FactureService.getThree(numero),
    enabled: !!numero
  })

  return isLoading ? (
    <LoadingWithoutModal />
  ) : isError ? (
    <ErrorView />
  ) : (
    data && (
      <div className='h-[calc(100vh-200px)] min-h-[500px]'>
        <TreeCanvas tree={data} />
      </div>
    )
  )
}

export default FileTree
