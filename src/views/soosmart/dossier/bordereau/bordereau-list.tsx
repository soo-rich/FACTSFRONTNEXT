'use client'

import { useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import { Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'


import Tooltip from '@mui/material/Tooltip'

// import Button from '@mui/material/Button'
import UtiliMetod from '@/utils/utilsmethod'

import TableGeneric from '@/components/table/TableGeneric'
import { BorderauService } from '@/service/dossier/borderau.service'
import type { BorderauType } from '@/types/soosmart/dossier/borderau.type'
import { FactureService } from '@/service/dossier/facture.service'
import AdoptedSwitchComponent from '@views/soosmart/dossier/AdopteComponent'

import CustomIconButton from '@core/components/mui/IconButton'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import Link from '@components/Link'
import { DocumentService } from '@/service/document/document.service'
import OptionMenu from '@core/components/option-menu'


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
      return await BorderauService.getAll({
        page: pageIndex,
        pagesize: pageSize,
        adopted: notadopted
      })
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
      columnHelper.accessor('proforma.reference', {
        header: 'Reference',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('numero', {
        header: 'Numéro',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('proforma.client.nom', {
        header: 'Client',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('createdat', {
        header: 'Créé le',
        cell: ({ row }) => <Typography>{UtiliMetod.formatDate(row.original.createdat)}</Typography>
      }),

      // columnHelper.accessor('total_ht', {
      //   header: 'Total HT',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('proforma.total_ttc', {
        header: 'Total TTC (Fcfa)',
        cell: info => info.getValue()
      }),

      // columnHelper.accessor('total_tva', {
      //   header: 'Total TVA',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('proforma.numero', {
        header: 'Numero Proforma',
        cell: ({ row }) => (
          <Link href={getLocalizedUrl(`/dossier/${row.original.proforma.numero}`, locale as Locale)}>
            {row.original.proforma.numero}
          </Link>
        )
      }),

      /*  columnHelper.accessor('adopte', {
        header: 'Status',
        cell: ({ row }) =>
          row.original.adopte ? (
            'Adoptée'
          ) : (
            <Button
              color={'primary'}
              variant={'outlined'}
              className={'hover:bg-primary hover:text-white'}
              onClick={() => AdoptMutation.mutate(row.original.id)}
            >
              Adopter
            </Button>
          )
      }),*/
      columnHelper.display({
        id: 'actions', // Important : donner un ID à la colonne display
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Tooltip title={'Voir le PDF'}>
              <CustomIconButton
                href={getLocalizedUrl(`/docs/${row.original.numero}`, locale as Locale)}
                className='cursor-pointer text-green-600 hover:text-green-800'
              >
                <i className='tabler-file-type-pdf' />
              </CustomIconButton>
            </Tooltip>

            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Télécharger le PDF',
                  icon: 'tabler-download hover:text-green-600 text-green-900',
                  menuItemProps: {
                    onClick: () => DocumentService.generatePdf(row.original.numero)
                  }
                },
                {
                  text: row.original.invoice ? 'Facture déjà creer' : 'Creer la facture',
                  icon: 'tabler-check hover:text-green-600 text-green-900',
                  menuItemProps: {
                    disabled: !!row.original.invoice,
                    onClick: () => AdoptMutation.mutate(row.original.id)
                  }
                },
                {
                  text: `Supprimer ${row.original.numero}`,
                  icon: 'tabler-trash hover:text-red-900 text-red-600',
                  menuItemProps: {
                    disabled: !!row.original.invoice,
                    onClick: () =>
                      UtiliMetod.SuppressionConfirmDialog({
                        data: row.original.proforma.reference,
                        confirmAction: () => DeleteMutation.mutate(row.original.id)
                      })
                  }
                }
              ]}
            />
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
