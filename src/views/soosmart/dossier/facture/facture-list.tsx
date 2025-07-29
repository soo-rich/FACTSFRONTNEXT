'use client'

import {useMemo, useState} from 'react'

import {Typography} from '@mui/material'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {createColumnHelper} from '@tanstack/react-table'

import {toast} from 'react-toastify'

// MUI Imports
import UtiliMetod from '@/utils/utilsmethod'
import OptionMenu from '@core/components/option-menu'
import TableGeneric from '@/components/table/TableGeneric'
import {FactureService} from "@/service/dossier/facture.service";
import {FactureType} from "@/types/soosmart/dossier/facture.type";


const columnHelper = createColumnHelper<FactureType>()

const FactureList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const {data, isLoading, isError} = useQuery({
    queryKey: [FactureService.FACTURE_KEY, pageIndex, pageSize],
    queryFn: async () => {
      return await FactureService.getAll({
        page: pageIndex,
        pagesize: pageSize
      })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await FactureService.DeleteDAta(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [FactureService.FACTURE_KEY, pageIndex, pageSize]
        })
        .then(r => r)
      toast.success('Bordereau supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la Bordereau')
      console.error('Erreur lors de la suppression de la Bordereau')
    }
  })



  const columns = useMemo(
    () => [

      columnHelper.accessor('reference', {
        header: 'Reference',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('numero', {
        header: 'Numéro',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('client', {
        header: 'Client',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('date', {
        header: 'Créé le',
        cell: ({row}) => <Typography>{UtiliMetod.formatDate(row.original.date)}</Typography>
      }),
      columnHelper.accessor('total_ht', {
        header: 'Total HT',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('total_ttc', {
        header: 'Total TTC',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('total_tva', {
        header: 'Total TVA',
        cell: info => info.getValue()
      }),
      columnHelper.display({
        id: 'actions', // Important: donner un ID à la colonne display
        header: 'Actions',
        cell: ({row}) => (
          <div className='flex gap-2'>


            <OptionMenu
              iconButtonProps={{size: 'medium'}}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Details',
                  icon: 'tabler-eye',
                  menuItemProps: {className: 'flex items-center gap-2 text-textSecondary'}
                },

                {
                  text: 'Supprimer',
                  icon: 'tabler-trash text-red-600',
                  menuItemProps: {
                    onClick: () =>
                      UtiliMetod.SuppressionConfirmDialog({
                        data: row.original.reference,
                        confirmAction: () => DeleteMutation.mutate(row.original.id)
                      })
                    ,
                    className: 'flex items-center gap-2 text-textSecondary '
                  }
                }
              ]}
            />
          </div>
        ),
        enableHiding: true // Permet de cacher cette colonne
      })
    ],
    []
  )

  return (
    <>
      <TableGeneric
        tabledata={data?.content}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        page={pageIndex}
        visibleColumns={true}
        SetPage={setPageIndex}
        pageSize={pageSize}
        SetPageSize={setPageSize}
        globalFilter={filter}
        setGlobalFilter={setFilter}
        totalElements={data?.totalElements}

      />
    </>
  )
}


export default FactureList
