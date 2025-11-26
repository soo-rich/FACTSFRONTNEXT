'use client'

import { useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import { Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'


import Tooltip from '@mui/material/Tooltip'

import Button from '@mui/material/Button'

import UtiliMetod from '@/utils/utilsmethod'

import TableGeneric from '@/components/table/TableGeneric'
import { BorderauService } from '@/service/dossier/borderau.service'
import type { BorderauType } from '@/types/soosmart/dossier/borderau.type'
import { FactureService } from '@/service/dossier/facture.service'
import AdoptedSwitchComponent from '@views/soosmart/dossier/AdopteComponent'

import CustomIconButton from '@core/components/mui/IconButton'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import Link from "@components/Link";
import { DocumentService } from '@/service/document/document.service'


const columnHelper = createColumnHelper<BorderauType>()

const BordereauList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [notadopted, setNotadopte] = useState<boolean>(false)
  const [filter, setFilter] = useState('')

  // hooks
  const { lang: locale } = useParams()

  const querykey = useMemo(() => [BorderauService.BORDERAU_KEY, pageIndex, pageSize, notadopted], [pageIndex, pageSize, notadopted])

  const { data, isLoading, isError } = useQuery({
    queryKey: querykey,
    queryFn: async () => {
      return notadopted
        ? await BorderauService.getAllWhoNoUseTocreateFacture({
          page: pageIndex,
          pagesize: pageSize
        })
        : await BorderauService.getAll({
          page: pageIndex,
          pagesize: pageSize
        })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await BorderauService.DeleteDAta(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: querykey
        })
        .then(r => r)
      toast.success('Bordereau supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la Bordereau')
      console.error('Erreur lors de la suppression de la Bordereau')
    }
  })

  const AdoptMutation = useMutation({
    mutationFn: async (id: string) => {
      return await FactureService.PostData(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [BorderauService.BORDERAU_KEY, pageIndex, pageSize]
        })
        .then(r => r)
      toast.success('Bordereau adoptée avec succès')
    },
    onError: (error) => {
      toast.error((error as any).response.data.message || 'Erreur lors de l\'adoption de la Bordereau')
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
        cell: ({ row }) => <Typography>{UtiliMetod.formatDate(row.original.date)}</Typography>
      }),

      // columnHelper.accessor('total_ht', {
      //   header: 'Total HT',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('total_ttc', {
        header: 'Total TTC (Fcfa)',
        cell: info => info.getValue()
      }),

      // columnHelper.accessor('total_tva', {
      //   header: 'Total TVA',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('numeroProforma', {
        header: 'Numero Proforma',
        cell: ({ row }) => (<Link href={getLocalizedUrl(`/dossier/${row.original.numeroProforma}`, locale as Locale)}>{row.original.numeroProforma}</Link>)
      }),
      columnHelper.accessor('adopte', {
        header: 'Status',
        cell: ({ row }) =>
          row.original.adopte ? 'Adoptée' :
            <Button color={'primary'} variant={'outlined'} className={'hover:bg-primary hover:text-white'}
              onClick={() => AdoptMutation.mutate(row.original.id)}>Adopter</Button>

      }),
      columnHelper.display({
        id: 'actions', // Important : donner un ID à la colonne display
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip title={'Voir le PDF'}>
              <CustomIconButton
                href={getLocalizedUrl(`/docs/${row.original.numero}`, locale as Locale)}
                className="cursor-pointer text-green-600 hover:text-green-800"
              >
                <i className="tabler-file-type-pdf" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip title={'Télécharger le PDF'}>
              <CustomIconButton
                onClick={() => DocumentService.generatePdf(row.original.numero)}
                className="cursor-pointer  hover:text-green-800"
              >
                <i className="tabler-download" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip title={`Supprimer ${row.original.numero}`} placement={'top'}>
              <CustomIconButton
                onClick={() => UtiliMetod.SuppressionConfirmDialog({
                  data: row.original.reference,
                  confirmAction: () => DeleteMutation.mutate(row.original.id)
                })
                }
                className="cursor-pointer flex items-center gap-2 text-textSecondary"
              >
                <i className="tabler-trash text-red-600" />
              </CustomIconButton>
            </Tooltip>


          </div>
        ),
        enableHiding: true // Permet de cacher cette colonne
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <TableGeneric
        tabledata={data?.content}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        ComponentOther={<AdoptedSwitchComponent checked={notadopted} handleChange={setNotadopte} />}
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


export default BordereauList
