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
import AddProforma from "@views/soosmart/dossier/proforma/add-proforma";
import Tooltip from "@mui/material/Tooltip";


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
          queryKey: [[ProformaService.PROFORMA_KEY, pageIndex, pageSize], [BorderauService.BORDERAU_KEY]]
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
        cell: ({row}) => <Tooltip placement={'top'} title={row.original.adopted ? 'Adopter' : 'Nom Adopter'}><Checkbox
          checked={row.original.adopted}/></Tooltip>
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
            {!row.original.adopted ? (<CustomIconButton
              onClick={() => {
                AdoptMutation.mutate(row.original.id)
              }}
              className='cursor-pointer text-primary'
            >
              <i className='tabler-check'/>
            </CustomIconButton>) : null}

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
      <AddProforma open={isModalOpen} handleClose={() => setIsModalOpen(false)} onSucces={() => {
        queryClient
          .invalidateQueries({
            queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
          })
          .then(r => r)
      }}/>
    </>
  )
}


export default ProformaList
