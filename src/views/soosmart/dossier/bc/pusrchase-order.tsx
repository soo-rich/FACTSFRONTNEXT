'use client'

import { useMemo, useState } from 'react'

import { Grid2, TablePagination } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid2'

import { BorderauService } from '@/service/dossier/borderau.service'
import { PurchaseOrderService } from '@/service/dossier/purchaseOrder.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import DebouncedInput from '@components/CustomInput/DebounceInput'
import TableManualPaginationComponent from '@components/table/TableManualPaginationComponent'
import CardView from '@views/soosmart/dossier/bc/component/cardview'
import UtiliMetod from '@/utils/utilsmethod'


const PurchaseOrderList = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(12)

  const [filter, setFilter] = useState('')


  const { data, isLoading, isError } = useQuery({
    queryKey: [PurchaseOrderService.PURCHASE_ORDER_KEY, pageIndex],
    queryFn: async () => {
      return await PurchaseOrderService.getAll({
        page: pageIndex,
        pagesize: pageSize
      })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const bclistfilter = useMemo(() => {
    if (!data?.content) return []

    return filter ? data?.content?.filter(item => item.numeroProforma === filter) : data?.content
  }, [data, filter])

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await PurchaseOrderService.DeleteDAta(id)
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [BorderauService.BORDERAU_KEY, pageIndex, pageSize]
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
      <Grid container spacing={2} size={{ xs:12, sm:3 }} direction={'row'} sx={{
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <DebouncedInput  className={'md:w-1/3 w-full'} value={filter} onChange={(data) => setFilter(String(data))} label={'Rechercher par proforma'}
                        placeholder={'Rechercher'} />
      </Grid>
      <Grid container spacing={2} size={12} direction={'row'} sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: '1rem'
      }}>

        {
          isLoading
            ? (
              <div className={'w-full place-content-center place-items-center'}>
                <LoadingWithoutModal />
              </div>

            ) : isError
              ? (<div className={'w-full place-content-center place-items-center'}><ErrorView />
              </div>) : bclistfilter.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <CardView bc={item}
                            onRemove={() => UtiliMetod.SuppressionConfirmDialog({
                              data: item.file.filename,
                              confirmAction: () => DeleteMutation.mutate(item.id)
                            })} />
                </Grid2>))

        }

      </Grid>
      <Grid container spacing={2} size={12} direction={'row'} sx={{
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
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
