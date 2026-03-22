'use client'

import { useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'

import Chip from '@mui/material/Chip'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import CardHeader from '@mui/material/CardHeader'

import UtiliMetod from '@/utils/utilsmethod'
import CustomIconButton from '@core/components/mui/IconButton'
import TableGeneric from '@/components/table/TableGeneric'
import { ProformaService } from '@/service/dossier/proforma.service'
import type { ProformaQuery, ProformaType } from '@/types/soosmart/dossier/proforma.type'
import { ColorStatusProforma, LabelStatusProforma, StatusProforma } from '@/types/soosmart/dossier/proforma.type'
import AdoptedSwitchComponent from '@views/soosmart/dossier/AdopteComponent'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// import { DocumentService } from '@/service/document/document.service'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import OptionMenu from '@/@core/components/option-menu'
import Link from '@components/Link'
import { BorderauService } from '@/service/dossier/borderau.service'
import RenderClientOrProject from '@views/soosmart/dossier/components/RenderClientOrProject'
import { PDFService } from '@/service/pdf/pdf.service'

const columnHelper = createColumnHelper<ProformaType>()

const ProformaList = ({ props }: { props?: Partial<ProformaQuery> }) => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [notadopted, setNotadopte] = useState<boolean>(props?.adopted ?? false)
  const [filter, setFilter] = useState('')

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // hooks
  const { lang: locale } = useParams()
  const router = useRouter()

  const queryKey = useMemo(
    () => [
      ProformaService.queryKey.all({
        page: pageIndex,
        pagesize: pageSize,
        adopted: notadopted,
        search: filter,
        end: endDate,
        start: startDate,
        client_id: props?.client_id,
        projet_id: props?.projet_id
      })
    ],
    [filter, pageIndex, pageSize, notadopted, startDate, endDate, props?.client_id, props?.projet_id]
  )

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      return await ProformaService.getAll({
        page: pageIndex,
        pagesize: pageSize,
        adopted: notadopted,
        search: filter,
        end: endDate,
        start: startDate,
        client_id: props?.client_id,
        projet_id: props?.projet_id
      })
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true
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
      return await ProformaService.AdoptProforma(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey
        })
        .then(r => r)
      toast.success('Proforma adoptée avec succès')
    },
    onError: () => {
      toast.error("Erreur lors de l'adoption de la proforma")
      console.error("Erreur lors de l'adoption de la proforma")
    }
  })

  const CreateBLMutation = useMutation({
    mutationFn: async (id: string) => {
      return await BorderauService.PostData(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey
        })
        .then(r => r)
      toast.success('Borderau de livraison créé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la création du borderau de livraison')
      console.error('Erreur lors de la création du borderau de livraison')
    }
  })

  const handleClickToAdopt = (id: string) => {
    AdoptMutation.mutate(id)
  }

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
      columnHelper.display({
        id: 'Client',
        header: 'Client',
        cell: ({ row }) => (
          <RenderClientOrProject for_who={{ client: row.original.client, projet: row.original.projet }} />
        )
      }),
      columnHelper.accessor('createdat', {
        header: 'Date de création',
        cell: ({ row }) => <Typography>{UtiliMetod.formatDate(row.original.createdat)}</Typography>
      }),

      // columnHelper.accessor('total_ht', {
      //   header: 'Total HT',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('total_ttc', {
        header: 'Total TTC (Fcfa)',
        cell: info => UtiliMetod.formatDevise(info.getValue())
      }),

      columnHelper.accessor('adopted', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={LabelStatusProforma[row.original.status]}
            variant='tonal'
            color={ColorStatusProforma[row.original.status]}
          />
        )
      }),
      ...(notadopted
        ? [
            columnHelper.accessor('bordereau.numero', {
              header: 'Bordereau',
              cell: ({ row }) => row.original.bordereau?.numero || 'N/A',
              enableSorting: false
            })
          ]
        : []),
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
            {/*<Tooltip title={'Télécharger le PDF'}>
              <CustomIconButton
                onClick={() => DocumentService.generatePdf(row.original.numero)}
                className="cursor-pointer  hover:text-green-800"
              >
                <i className="tabler-download" />
              </CustomIconButton>
            </Tooltip>*/}

            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                ...(row.original.status === StatusProforma.PENDING && !row.original.adopted
                  ? [
                      {
                        text: 'Adopter',
                        icon: 'tabler-check',

                        menuItemProps: {
                          className: 'flex items-center gap-2 text-textSecondary',
                          onClick: () => handleClickToAdopt(row.original.id)
                        }
                      }
                    ]
                  : []),
                ...(row.original.bordereau === null && row.original.status !== StatusProforma.REJECTED
                  ? [
                      {
                        text: 'Creer le borderau',
                        icon: 'tabler-truck-delivery',

                        menuItemProps: {
                          className: 'flex items-center gap-2 text-textSecondary',
                          onClick: () => {
                            CreateBLMutation.mutate(row.original.id)
                          }
                        }
                      }
                    ]
                  : []),
                {
                  text: 'Download',
                  icon: 'tabler-download',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => {
                      PDFService.downloadPdfByNumero(row.original.numero)
                    }
                  }
                },
                ...(!row.original.adopted && row.original.status !== StatusProforma.REJECTED
                  ? [
                      {
                        text: 'Mettre à jour',
                        icon: 'tabler-edit text-yellow-600',

                        menuItemProps: {
                          className: 'flex items-center gap-2 text-textSecondary',
                          onClick: () => {
                            router.push(getLocalizedUrl(`/proforma/${row.original.id}`, locale as Locale))
                          }
                        }
                      }
                    ]
                  : []),
                ...(!row.original.adopted && row.original.status !== StatusProforma.REJECTED
                  ? [
                      {
                        text: 'Delete',
                        icon: 'tabler-trash text-red-600',
                        menuItemProps: {
                          className: 'flex items-center gap-2 text-textSecondary',
                          onClick: () =>
                            UtiliMetod.SuppressionConfirmDialog({
                              data: row.original.reference,
                              confirmAction: () => DeleteMutation.mutate(row.original.id)
                            })
                        }
                      }
                    ]
                  : [])
              ]}
            />
          </div>
        ),
        enableHiding: true // Permet de cacher cette colonne
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notadopted]
  )

  return (
    <>
      <Card>
        <CardHeader>Filtre</CardHeader>
        <CardContent className={'grid grid-cols-2 gap-4'}>
          <AppReactDatepicker
            showYearDropdown
            isClearable={true}
            showMonthDropdown
            selected={startDate}
            id='picker-open-date'
            openToDate={new Date()}
            onChange={(date: Date | null) => setStartDate(date)}
            customInput={<CustomTextField label='Date de Debut' fullWidth />}
          />
          <AppReactDatepicker
            showYearDropdown
            showMonthDropdown
            selected={endDate}
            isClearable={true}
            id='picker-open-date'
            openToDate={new Date()}
            onChange={(date: Date | null) => setEndDate(date)}
            customInput={<CustomTextField label='Date de Fin' fullWidth />}
          />
        </CardContent>
      </Card>

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
        buttonadd={{
          component: Link,
          href: getLocalizedUrl('/proforma/create', locale as Locale)
        }}
      />
    </>
  )
}

export default ProformaList
