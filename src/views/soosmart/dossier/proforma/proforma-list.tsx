'use client'

import { useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import { Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'

import Button from '@mui/material/Button'

import Chip from '@mui/material/Chip'

import UtiliMetod from '@/utils/utilsmethod'
import CustomIconButton from '@core/components/mui/IconButton'
import TableGeneric from '@/components/table/TableGeneric'
import { ProformaService } from '@/service/dossier/proforma.service'
import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'
import AdoptedSwitchComponent from '@views/soosmart/dossier/AdopteComponent'
import AddProforma from '@views/soosmart/dossier/proforma/add-proforma'


import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import DefaultDialog from '@components/dialogs/unique-modal/DefaultDialog'
import AdoptForm from '@views/soosmart/dossier/proforma/component/adopt-form'
import AddProformaModal from '@views/soosmart/dossier/proforma/form/add-proforma-modal'


const columnHelper = createColumnHelper<ProformaType>()

const ProformaList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [notadopted, setNotadopte] = useState<boolean>(false)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenAdopt, setIsModalOpenAdopt] = useState(false)
  const [proformaselect, setProformaSelect] = useState<ProformaType | undefined>(undefined)

  // hooks
  const { lang: locale } = useParams()

  const { data, isLoading, isError } = useQuery({
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


  const handleClickToAdopt = (data: ProformaType) => {
    setProformaSelect(data)

    setTimeout(() => {
      setIsModalOpenAdopt(true)
    }, 500)
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
      columnHelper.accessor('client', {
        header: 'Client',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('date', {
        header: 'Date de création',
        cell: ({ row }) => <Typography>{UtiliMetod.formatDate(row.original.date)}</Typography>
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
      columnHelper.accessor('adopted', {
        header: 'Status',
        cell: ({ row }) =>row.original.old?<Chip label={'Rejétée'} variant='tonal' color={'error'}/>: row.original.adopted ? <Chip label={'Adoptée'} variant='tonal' color={'success'}/> :
          <Button disabled={row.original.old} color={'primary'} variant={'outlined'} className={'hover:bg-primary hover:text-white'}
                  onClick={() => handleClickToAdopt(row.original)}>Adopter</Button>
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

            {!row.original.old&&!row.original.adopted&&(<Tooltip title={'mettre a jour'}>
              <CustomIconButton
                onClick={() => {
                  setProformaSelect(row.original)
                  setIsModalOpen(true)
                }}
                className="cursor-pointer text-yellow-600 hover:text-yellow-800"
              >
                <i className="tabler-edit" />
              </CustomIconButton></Tooltip>)}
            <Tooltip title={'Supprimer'}><CustomIconButton
              color={'error'}
              onClick={() => UtiliMetod.SuppressionConfirmDialog({
                data: row.original.reference,
                confirmAction: () => DeleteMutation.mutate(row.original.id)
              })
              }
              className="cursor-pointer "
            >
              <i className="tabler-trash" />
            </CustomIconButton></Tooltip>
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
        buttonadd={{
          action: () => setIsModalOpen(true)
        }}
      />
     {/* <AddProforma data={proformaselect} open={isModalOpen} handleClose={() => {
        setIsModalOpen(false)
        setProformaSelect(undefined)
      }} onSucces={() => {
        setIsModalOpen(false)
        queryClient
          .invalidateQueries({
            queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
          })
          .then(r => r)
      }} />*/}

      <DefaultDialog open={isModalOpenAdopt} setOpen={setIsModalOpenAdopt} onClose={() => {
        setIsModalOpen(false)
        setProformaSelect(undefined)
      }} title={'Adopter la proforma'}>
        <AdoptForm data={proformaselect} onCancel={() => {
          setProformaSelect(undefined)
          setIsModalOpenAdopt(false)
        }} onSuccess={() => {
          queryClient
            .invalidateQueries({
              queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
            })
            .then(r => r)
        }} />
      </DefaultDialog>
      <DefaultDialog dialogMaxWidth={'md'} open={isModalOpen} setOpen={setIsModalOpen} onClose={() => {
        setIsModalOpen(false)
        setProformaSelect(undefined)
      }} title={`Construire un Proforma ${proformaselect?`à partir de ${proformaselect.numero}`:''}`}>
        <AddProformaModal data={proformaselect} onCancel={() => {
          setIsModalOpenAdopt(false)
        }} onSuccess={() => {
          setIsModalOpen(false)
          queryClient
            .invalidateQueries({
              queryKey: [ProformaService.PROFORMA_KEY, pageIndex, pageSize]
            })
            .then(r => r)
        }} />
      </DefaultDialog>
    </>
  )
}


export default ProformaList
