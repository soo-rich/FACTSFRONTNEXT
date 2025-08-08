'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { StatAPIService } from '@/service/statistique/stat-api.service'
import TableGeneric from '@components/table/TableGeneric'


import type { TableStat } from '@/types/soosmart/statistique/statistique.type'
import UtiliMetod from '@/utils/utilsmethod'

const columnsHelper = createColumnHelper<TableStat>()

const DocumentList = () => {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(5)

  const { data, isLoading } = useQuery({
    queryKey: ['documentList', page, size],
    queryFn: () => StatAPIService.getListDocument({ page: page, pagesize: size }),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const columns = useMemo(() => [
    columnsHelper.accessor('numero', {
      header: 'Numéro',
      cell: info => info.getValue()
    }),
    columnsHelper.accessor('date', {
      header: 'Creer le .',
      cell: info => info.getValue() ? UtiliMetod.formatDate(info.getValue()) : null
    }), columnsHelper.accessor('total', {
      header: 'Total',
      enableSorting: false,
      cell: info => info.getValue() ? UtiliMetod.formatDevise(info.getValue()) + ' FCFA' : null
    })
  ], [])

  return (
    <TableGeneric displayTableHeaderSession={true} title={'Facture Recent'} tabledata={data?.content} columns={columns}
                  page={page} pageSize={size} isLoading={isLoading}
                  SetPageSize={setSize} SetPage={setPage} totalElements={data?.totalElements} />)

}


export default DocumentList
