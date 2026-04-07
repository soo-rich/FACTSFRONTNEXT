'use client'

import { useState } from 'react'

import { useParams } from 'next/navigation'

import { Grid as Grid2, TablePagination } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import { PurchaseOrderService } from '@/service/dossier/purchaseOrder.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import DebouncedInput from '@components/CustomInput/DebounceInput'
import TableManualPaginationComponent from '@components/table/TableManualPaginationComponent'
import CardView from '@views/soosmart/dossier/bc/component/cardview'
import UtilsMetod from '@/utils/utilsmethod'
import Link from '@/components/Link'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

const PurchaseOrderList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(12)

  const [filter, setFilter] = useState('')

  // hooks
  const { lang: locale } = useParams()

  const queryKey = [PurchaseOrderService.queryKey.all({ page: pageIndex, pagesize: pageSize, search: filter })]

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      return await PurchaseOrderService.getAll({
        page: pageIndex,
        pagesize: pageSize,
        search: filter
      })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await PurchaseOrderService.DeleteDAta(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey
        })
        .then(r => r)
      toast.success('Bon de commande supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du Bon de commande')
      console.error('Erreur lors de la suppression du Bon de commande')
    }
  })

  return (
    <>
      <Grid
        container
        spacing={2}
        size={{ xs: 12, sm: 12 }}
        direction={'row'}
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Button
          component={Link}
          href={getLocalizedUrl('purchase_order/create', locale as Locale)}
          size={'small'}
          variant={'contained'}
        >
          Ajouter un bon de commande
        </Button>
        <DebouncedInput value={filter} onChange={data => setFilter(String(data))} placeholder={'Rechercher'} />
      </Grid>
      <Grid
        container
        spacing={2}
        size={12}
        direction={'row'}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: '1rem'
        }}
      >
        {isLoading ? (
          <div className={'w-full place-content-center place-items-center'}>
            <LoadingWithoutModal />
          </div>
        ) : isError ? (
          <div className={'w-full place-content-center place-items-center'}>
            <ErrorView />
          </div>
        ) : (
          data?.content?.map((item, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <CardView
                bc={item}
                onRemove={() =>
                  UtilsMetod.SuppressionConfirmDialog({
                    data: item.file.storageKey,
                    confirmAction: () => DeleteMutation.mutate(item.id)
                  })
                }
              />
            </Grid2>
          ))
        )}
      </Grid>
      <Grid
        container
        spacing={2}
        size={12}
        direction={'row'}
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <TablePagination
          component={() => (
            <TableManualPaginationComponent
              pageIndex={pageIndex}
              pageSize={pageSize}
              rowCount={data?.totalElements ?? 0}
              currentPage={setPageIndex}
            />
          )}
          count={data?.totalElements ?? 0}
          rowsPerPage={pageSize ?? 10}
          page={pageIndex ?? 1}
          onPageChange={(_, page) => {
            setPageIndex(page)
          }}
        />
      </Grid>
    </>
  )
}

export default PurchaseOrderList
