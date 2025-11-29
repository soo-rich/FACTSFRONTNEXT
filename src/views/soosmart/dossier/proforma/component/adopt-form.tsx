import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

import { Controller, useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { Grid2, RadioGroup } from '@mui/material'

import Typography from '@mui/material/Typography'

import FormControlLabel from '@mui/material/FormControlLabel'

import Radio from '@mui/material/Radio'

import type { Accept } from 'react-dropzone'

import Button from '@mui/material/Button'

import { ThumbsUp } from 'lucide-react'

import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'
import type { PurchaseOrderSave } from '@/types/soosmart/dossier/purchaseOrder.type'
import { schemaPurchaseOrder } from '@/types/soosmart/dossier/purchaseOrder.type'
import { PurchaseOrderService } from '@/service/dossier/purchaseOrder.service'
import { FileUploaderRestrictions } from '@components/CustomInput/FileUploader'


const AdoptForm = (props: AddEditFormType<any>) => {
  const { onSuccess, onCancel, data } = props

  // States
  const [value, setValue] = useState<'image' | 'pdf'>('image')
  const [accept, setAccept] = useState<Accept>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as any).value)
  }


  const {
    control,
    handleSubmit,
    reset
  } = useForm<PurchaseOrderSave>({
    resolver: valibotResolver(schemaPurchaseOrder),
    defaultValues: {
      filename: '',
      numeroProforma: data?.numero ?? '',
      file: undefined
    }
  })

  const AdoptMutation = useMutation({
    mutationFn: async (data: PurchaseOrderSave) => {
      return await PurchaseOrderService.PostData(data)
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }

      handleCancel()

      toast.success('Proforma adoptée avec succès')
    },
    onError: (error) => {
      toast.error((error as any).reponse.data.message || 'Erreur lors de l\'adoption de la proforma')
      console.error('Erreur lors de l\'adoption de la proforma')
    }
  })

  const handleSubmitForm = (data: PurchaseOrderSave) => {
    AdoptMutation.mutate(data)
  }

  const handleCancel = () => {

    reset({
      filename: '',
      numeroProforma: '',
      file: undefined
    })

    if (onCancel) {
      onCancel()
    }

  }

  useEffect(() => {
    if (value === 'image') {
      setAccept({
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png']
      })
    } else {
      setAccept({
        'application/pdf': ['.pdf']
      })
    }
  }, [value])


  return <form onSubmit={handleSubmit(handleSubmitForm)} noValidate className={'flex flex-col gap-4 '}>
    <Grid2 container direction={'column'} size={12} gap={6} spacing={3}>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Typography color="text.primary">Type de fichier</Typography>
        <RadioGroup row aria-label="controlled" name="controlled" value={value} onChange={handleChange}>
          <FormControlLabel value="image" control={<Radio />} label="Imgae" />
          <FormControlLabel value="pdf" control={<Radio />} label="Pdf" />
        </RadioGroup>
      </Grid2>
      <Controller render={({ field }) => (
        <FileUploaderRestrictions setFile={field.onChange} controls={control} maxFiles={1} accept={accept} />
      )} name={'file'} control={control} />
    </Grid2>

    <Grid2 container direction={'row'} size={12} spacing={3} sx={{
      justifyContent: 'space-evenly',
      alignItems: 'center',
      gap: 1
    }}>
      <Button size={'small'} className={'rounded-2xl hover:bg-green-500/50 hover:text-green-600'} variant="contained"
        color="primary" type="submit"
        endIcon={<ThumbsUp size={20} className={'text-sm'} />} disabled={AdoptMutation.isPending}>
        Adopter
      </Button>
      <Button size={'small'} className={'rounded-2xl hover:bg-red-500/50 hover:text-red-600'} variant="tonal"
        color="inherit"
        endIcon={<CloseIcon />} disabled={AdoptMutation.isPending} onClick={handleCancel}>
        Annuler
      </Button>
    </Grid2>
  </form>
}

export default AdoptForm
