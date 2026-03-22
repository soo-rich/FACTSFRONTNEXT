'use client'

import React, { useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { Controller, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'

import Typography from '@mui/material/Typography'

import Divider from '@mui/material/Divider'

import CardContent from '@mui/material/CardContent'

import Grid from '@mui/material/Grid'

import InputAdornment from '@mui/material/InputAdornment'

import { Radio, RadioGroup } from '@mui/material'

import FormControlLabel from '@mui/material/FormControlLabel'

import Button from '@mui/material/Button'

import { PurchaseOrderService } from '@/service/dossier/purchaseOrder.service'
import { ProformaService } from '@/service/dossier/proforma.service'
import { BorderauService } from '@/service/dossier/borderau.service'
import type { PurchaseOrderSave } from '@/types/soosmart/dossier/purchaseOrder.type'
import { schemaPurchaseOrder } from '@/types/soosmart/dossier/purchaseOrder.type'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import Form from '@/components/Form'

import CustomTextField from '@core/components/mui/TextField'

import CustomAutocomplete from '@core/components/mui/Autocomplete'
import DebouncedInput from '@components/CustomInput/DebounceInput'
import LoadingButton from '@components/button/LoadingButton'
import CustomFileUploaderRestrictions from '@components/CustomInput/CustomFileUploaderRestrictions'

const AddModalBc = () => {
  const queryClient = useQueryClient()
  const [isProforma, setIsProforma] = useState<'pr' | 'br'>('pr')
  const [filterP, setFilterP] = useState('')
  const [filterB, setFilterB] = useState('')
  const [pageSize] = useState(12)

  //hooks
  const { lang: locale } = useParams()
  const router = useRouter()

  const queryKeyProforma = useMemo(
    () => [
      ProformaService.queryKey.all({
        page: 0,
        pagesize: pageSize,
        adopted: true,
        search: filterP
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterP]
  )

  const queryKeyBordereau = useMemo(
    () => [BorderauService.queryKey.all({ page: 0, pagesize: pageSize, adopted: true, search: filterB })],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterB]
  )

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<PurchaseOrderSave>({
    resolver: valibotResolver(schemaPurchaseOrder),
    defaultValues: {
      filename: '',
      file: undefined,
      proforma_id: undefined,
      bordereau_id: undefined
    }
  })

  const AddMutatation = useMutation({
    mutationFn: async (data: PurchaseOrderSave) => {
      return await PurchaseOrderService.PostData(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PurchaseOrderService.queryKey.all()
      })
      toast.success('Purchase order added successfully')
      reset()
      router.push(getLocalizedUrl('purchase_order', locale as Locale))
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const Submit = async (data: PurchaseOrderSave) => {
    AddMutatation.mutate(data)
  }

  const resultQuery = useQueries({
    queries: [
      {
        queryKey: queryKeyProforma,
        queryFn: async () => {
          return (
            await ProformaService.getAll({
              page: 0,
              pagesize: pageSize,
              adopted: true,
              search: filterP
            })
          ).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true
      },
      {
        queryKey: queryKeyBordereau,
        queryFn: async () => {
          return (
            await BorderauService.getAll({
              page: 0,
              pagesize: pageSize,
              adopted: true,
              search: filterP
            })
          ).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true
      }
    ]
  })

  const [{ data: proforma }, { data: bordereau }] = resultQuery

  const handeReset = () => {
    reset({
      filename: '',
      file: undefined,
      proforma_id: undefined,
      bordereau_id: undefined
    })
    setIsProforma('pr')
  }

  return (
    <div>
      {/* Your modal content goes here */}
      <Form noValidate onSubmit={handleSubmit(Submit)} className='w-full'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader
              title={
                <div className='flex items-center gap-2'>
                  <i className='tabler-file-invoice text-primary text-2xl' />
                  <Typography variant='h5'>{'Charger un bon de commande'}</Typography>
                </div>
              }
              subheader='Remplissez les informations suivantes pour ajouter un bon de commande'
            />
            <Divider />
            <CardContent>
              <Grid container spacing={4}>
                {/* Référence */}
                <Grid size={{ xs: 12, md: 12 }}>
                  <Controller
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        label='Nom du fichier'
                        placeholder='Ex: BC-2026-001'
                        fullWidth
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position='start'>
                                <i className='tabler-file text-lg' />
                              </InputAdornment>
                            )
                          }
                        }}
                        error={!!errors.filename}
                        {...(errors.filename && {
                          error: true,
                          helperText: errors?.filename?.message
                        })}
                      />
                    )}
                    name='filename'
                    control={control}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <RadioGroup
                    row
                    name='isProforma'
                    value={isProforma}
                    onChange={event => {
                      const value = (event.target as HTMLInputElement).value as 'pr' | 'br'

                      setIsProforma(value)

                      if (value === 'pr') {
                        setValue('bordereau_id', undefined)
                      } else {
                        setValue('proforma_id', undefined)
                      }
                    }}
                    className='mb-3'
                  >
                    <FormControlLabel
                      value='pr'
                      control={<Radio />}
                      label={
                        <span className='flex items-center gap-1'>
                          <i className='tabler-user text-base' /> Proforma
                        </span>
                      }
                    />
                    <FormControlLabel
                      value='br'
                      control={<Radio />}
                      label={
                        <span className='flex items-center gap-1'>
                          <i className='tabler-briefcase text-base' /> Bordereau
                        </span>
                      }
                    />
                  </RadioGroup>

                  {isProforma === 'pr' ? (
                    <Controller
                      render={({ field }) => (
                        <CustomAutocomplete
                          options={proforma || []}
                          fullWidth
                          onChange={(_event, newvalue) => {
                            field.onChange(newvalue?.id)
                          }}
                          getOptionLabel={option => option.numero + ' - ' + option.reference || ''}
                          renderInput={params => (
                            <DebouncedInput
                              {...params}
                              label='Sélectionner un Proforma'
                              onChange={e => {
                                setFilterP(e || '')
                              }}
                            />
                          )}
                        />
                      )}
                      name='proforma_id'
                      control={control}
                    />
                  ) : (
                    <Controller
                      render={({ field }) => (
                        <CustomAutocomplete
                          options={bordereau || []}
                          fullWidth
                          onChange={(_event, newvalue) => {
                            field.onChange(newvalue?.id)
                          }}
                          getOptionLabel={option => option.numero + ' - ' + option?.proforma?.reference || ''}
                          renderInput={params => (
                            <DebouncedInput
                              {...params}
                              label='Sélectionner un Bordereau'
                              onChange={e => {
                                setFilterB(e || '')
                              }}
                            />
                          )}
                        />
                      )}
                      name='bordereau_id'
                      control={control}
                    />
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Controller
                    render={({ field }) => (
                      <CustomFileUploaderRestrictions
                        setFile={files => field.onChange(files[0])}
                        button={false}
                        showPreview={true}
                        accept={{
                          'application/': ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
                        }}
                      />
                    )}
                    name='file'
                    control={control}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className='flex flex-row gap-3 justify-end'>
                <LoadingButton
                  loading={AddMutatation.isPending}
                  type='submit'
                  variant='contained'
                  startIcon={<i className={'tabler-device-floppy'} />}
                >
                  {'Enregistrer les modifications'}
                </LoadingButton>
                <Button
                  disabled={AddMutatation.isPending}
                  type='reset'
                  variant='tonal'
                  color='secondary'
                  startIcon={<i className='tabler-x' />}
                  onClick={handeReset}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  )
}

export default AddModalBc
