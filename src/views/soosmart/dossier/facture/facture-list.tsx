'use client'

import { useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import { Tooltip, Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

// MUI Imports
import UtiliMetod from '@/utils/utilsmethod'

import TableGeneric from '@/components/table/TableGeneric'
import { FactureService } from '@/service/dossier/facture.service'
import type { FactureListType } from '@/types/soosmart/dossier/facture.type'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import CustomIconButton from '@core/components/mui/IconButton'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'
import FileTree from '../tree/FileTree'
import OptionMenu from '@core/components/option-menu'
import RenderClientOrProject from '@views/soosmart/dossier/components/RenderClientOrProject'
import { PDFService } from '@/service/pdf/pdf.service'

const columnHelper = createColumnHelper<FactureListType>()

const FactureList = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')
  const [id, setID] = useState('')

  // hooks
  const { lang: locale } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: [FactureService.FACTURE_KEY, pageIndex, pageSize],
    queryFn: async () => {
      return await FactureService.getAll({
        page: pageIndex,
        pagesize: pageSize
      })
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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

  const showTree = (id: string) => {
    setID(id)
    setTimeout(() => {
      setOpen(true)
    }, 500)
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('bordereau.proforma.reference', {
        header: 'Reference',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('numero', {
        header: 'Numéro',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('bordereau.proforma.client.nom', {
        header: 'Client',
        cell: ({ row }) => (
          <RenderClientOrProject
            for_who={{
              client: row.original?.bordereau?.proforma?.client,
              projet: row.original?.bordereau?.proforma?.projet
            }}
          />
        )
      }),
      columnHelper.accessor('createdat', {
        header: 'Créé le',
        cell: ({ row }) => <Typography>{UtiliMetod.formatDate(row.original.createdat)}</Typography>
      }),

      // columnHelper.accessor('total_ht', {
      //   header: 'Total HT',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('bordereau.proforma.total_ttc', {
        header: 'Total TTC (Fcfa)',
        cell: info => info.getValue()
      }),

      // columnHelper.accessor('total_tva', {
      //   header: 'Total TVA',
      //   cell: info => info.getValue()
      // }),
      columnHelper.display({
        id: 'actions', // Important: donner un ID à la colonne display
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
                  text: 'Hiérarchie du document',
                  icon: 'tabler-hierarchy-3',
                  menuItemProps: {
                    onClick: () => showTree(row.original.id)
                  }
                },
                {
                  text: 'Télécharger le PDF',
                  icon: 'tabler-download',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => {
                      PDFService.downloadPdfByNumero(row.original.numero)
                    }
                  }
                },
                {
                  text: 'Supprimer',
                  icon: 'tabler-trash text-red-600 hover:text-red-800',
                  menuItemProps: {
                    onClick: () =>
                      UtiliMetod.SuppressionConfirmDialog({
                        data: row.original.bordereau.proforma.reference,
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
    [DeleteMutation, locale]
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

      <DefaultDialog dialogMaxWidth='lg' open={open} setOpen={setOpen} title='Hiérarchie du document'>
        <FileTree numero={id}></FileTree>
      </DefaultDialog>
    </>
  )
}

export default FactureList
