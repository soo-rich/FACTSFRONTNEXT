'use client'

import {useMemo, useState} from 'react'

import {Typography} from '@mui/material'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {createColumnHelper} from '@tanstack/react-table'

import {toast} from 'react-toastify'

// MUI Imports
import UtiliMetod from '@/utils/utilsmethod'
import CustomIconButton from '@core/components/mui/IconButton'
import OptionMenu from '@core/components/option-menu'
import TableGeneric from '@/components/table/TableGeneric'
import {BorderauService} from '@/service/dossier/borderau.service'
import {ProformaService} from '@/service/dossier/proforma.service'
import type {ProformaType} from '@/types/soosmart/dossier/proforma.type'
import Checkbox from "@mui/material/Checkbox";
import AdoptedSwitchComponent from "@views/soosmart/dossier/AdopteComponent";


const columnHelper = createColumnHelper<ProformaType>()

const ProformaList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [notadopted, setNotadopte] = useState<boolean>(false)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [proformaselect, setProformaSelect] = useState<ProformaType | undefined>(undefined)

  const {data, isLoading, isError} = useQuery({
    queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize, notadopted],
    queryFn: async () => {
      return notadopted
        ? await ProformaService.getAllnotAdopted({
          page: pageIndex,
          pagesize: pageSize
        })
        : await ProformaService.getAll({
          page: pageIndex,
          pagesize: pageSize
        })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ProformaService.DeleteDAta(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
        })
        .then(r => r)
      toast.success('Proforma supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la proforma')
      console.error('Erreur lors de la suppression de la proforma')
    }
  })

  const AdoptMutation = useMutation({
    mutationFn: async (id: string) => {
      return await BorderauService.PostData(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
        })
        .then(r => r)
      toast.success('Proforma adoptée avec succès')
    },
    onError: (error) => {
      toast.error((error as any).reponse.data.message || "Erreur lors de l'adoption de la proforma")
      console.error("Erreur lors de l'adoption de la proforma")
    }
  })

  const columns = useMemo(
    () => [
      columnHelper.accessor('adopted', {
        header: 'Adoptée',
        cell: ({row}) => <Checkbox checked={row.original.adopted}/>
      }),
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
            <CustomIconButton
              onClick={() => {
                setProformaSelect(row.original)
                setIsModalOpen(true)
              }}
              className='cursor-pointer text-yellow-600 hover:text-yellow-800'
            >
              <i className='tabler-edit'/>
            </CustomIconButton>

            <OptionMenu
              iconButtonProps={{size: 'medium'}}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Details',
                  icon: 'tabler-eye',
                  menuItemProps: {className: 'flex items-center gap-2 text-textSecondary'}
                }, {
                  text: 'Adapter',
                  icon: 'tabler-check',
                  menuItemProps: {
                    disabled: row.original.adopted,
                    className: row.original.adopted ? 'flex items-center gap-2 text-text Secondary line-through' :
                      'flex items-center gap-2 text-textSecondary',

                    onClick: () => {
                      AdoptMutation.mutate(row.original.id)
                    }
                  }
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
        ComponentOther={<AdoptedSwitchComponent checked={notadopted} handleChange={setNotadopte}/>}
        page={pageIndex}
        visibleColumns={true}
        SetPage={setPageIndex}
        pageSize={pageSize}
        SetPageSize={setPageSize}
        globalFilter={filter}
        setGlobalFilter={setFilter}
        totalElements={data?.totalElements}
        buttonadd={{
          action: () => setIsModalOpen(true)
        }}
      />
    </>
  )
}


export default ProformaList
