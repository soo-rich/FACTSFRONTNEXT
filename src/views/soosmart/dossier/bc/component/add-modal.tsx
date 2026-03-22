'use client'

import { useMemo, useState } from 'react'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'

import { PurchaseOrderService } from '@/service/dossier/purchaseOrder.service'
import { ProformaService } from '@/service/dossier/proforma.service'
import { BorderauService } from '@/service/dossier/borderau.service'
import { PurchaseOrderSave, schemaPurchaseOrder } from '@/types/soosmart/dossier/purchaseOrder.type'
import { valibotResolver } from '@hookform/resolvers/valibot'

const AddModalBc = () => {
  const queryClient = useQueryClient()
  const [pageIndexP, setPageIndexP] = useState(0)
  const [pageIndexB, setPageIndexB] = useState(0)
  const [filterP, setFilterP] = useState('')
  const [filterB, setFilterB] = useState('')
  const [pageSize] = useState(12)

  const queryKeyProforma = useMemo(
    () => [
      ProformaService.queryKey.all({
        page: pageIndexP,
        pagesize: pageSize,
        adopted: true,
        search: filterP
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageIndexP, filterP]
  )

  const queryKeyBordereau = useMemo(
    () => [BorderauService.queryKey.all({ page: pageIndexB, pagesize: pageSize, adopted: true, search: filterB })],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageIndexB, filterB]
  )

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<PurchaseOrderSave>({
    resolver: valibotResolver(schemaPurchaseOrder),
    defaultValues: {
      filename: '',
      file: null,
      proforma_id: undefined,
      bordereau_id: undefined
    }
  })

  const AddMutatation = useMutation({
    mutationFn: async () => {},
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: PurchaseOrderService.queryKey.all()
      })
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const Submit = async () => {}

  const resultQuery = useQueries({
    queries: [
      {
        queryKey: queryKeyProforma,
        queryFn: async () => {
          return await ProformaService.getAll({
            page: pageIndexP,
            pagesize: pageSize,
            adopted: true,
            search: filterP
          })
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true
      },
      {
        queryKey: queryKeyBordereau,
        queryFn: async () => {
          return await BorderauService.getAll({
            page: pageIndexB,
            pagesize: pageSize,
            adopted: true,
            search: filterP
          })
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true
      }
    ]
  })

  const [] = resultQuery

  return (
    <div>
      {/* Your modal content goes here */}
      <h2>Ajouter un nouveau BC</h2>
    </div>
  )
}

export default AddModalBc
