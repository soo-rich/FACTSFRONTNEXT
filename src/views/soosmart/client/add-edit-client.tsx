import { useMutation } from '@tanstack/react-query'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { Grid2 } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

import Typography from '@mui/material/Typography'
import 'react-international-phone/style.css'
import { PhoneInput } from 'react-international-phone'
import Button from '@mui/material/Button'

import CustomTextField from '@core/components/mui/TextField'

import type { ClientSave, ClientType } from '@/types/soosmart/client.type'
import { schemaClient } from '@/types/soosmart/client.type'
import { ClientService } from '@/service/client/client.service'

import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'

const AddEditClient = ({ data: client, onCancel, onSuccess }: AddEditFormType<ClientType>) => {


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientSave>({
    resolver: valibotResolver(schemaClient),
    defaultValues: {
      nom: client?.nom ?? '',
      lieu: client?.lieu ?? '',
      telephone: client?.telephone ?? '',
      sigle: client?.sigle ?? '',
      potentiel: client?.potentiel ?? false
    }
  })

  const addMutation = useMutation({
    mutationFn: async (data: ClientSave) => {
      return( await ClientService.saveClient(data))
    },
    onSuccess: data => {
      toast.success(`Client ${data.nom} ajouté avec succès`)
      reset()

      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du client")
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ClientSave) => {
      if (!client?.id) {
        throw new Error("l'ID du client est requis pour la mise à jour")
      }

      return await ClientService.updateClient(client.id, data)
    },
    onSuccess: () => {
      toast.success(`Client ${data.nom} mis à jour avec succès`)
      reset()

      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du client')
    }
  })

  const onSubmit = (data: ClientSave) => {
    if (client) {
      updateMutation.mutate(data)
    } else {
      addMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    reset({
      nom: '',
      lieu: '',
      telephone: '',
      sigle: '',
      potentiel: false
    })

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <Grid2 container direction={'column'} spacing={3}>
        <Grid2 container direction={'row'} spacing={3}>
          <Grid2 size={{md: client ? 12 : 10, xl: client ? 12 : 10,sm:  12 ,xs: 10 }}>
            <Controller
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={'Nom'}
                  error={!!errors.nom}
                  {...(errors.nom && {
                    error: true,
                    helperText: errors?.nom?.message
                  })}
                />
              )}
              name={'nom'}
              control={control}
            />
          </Grid2>

          {client ? null : (
            <Grid2
              size={2}
              container
              sx={{
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              <Controller
                render={({ field }) => (
                  <div className={'flex items-center gap-2 sm:flex-col'}>
                    <Typography>Potentiel</Typography>
                    <Checkbox {...field} checked={field.value} />
                  </div>
                )}
                name={'potentiel'}
                control={control}
              />
            </Grid2>
          )}
        </Grid2>
        <Controller
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label={'Sigle'}
              error={!!errors.sigle}
              {...(errors.sigle && {
                error: true,
                helperText: errors?.sigle?.message
              })}
            />
          )}
          name={'sigle'}
          control={control}
        />

        <Controller
          render={({ field }) => (
            <div className={'w-full flex flex-col gap-2 focus:text-primary'}>
              <Typography variant={'body2'}> Telephone </Typography>
              <PhoneInput className={'w-full'} inputClassName={'w-full'} {...field} defaultCountry={'tg'} />
            </div>
          )}
          name={'telephone'}
          control={control}
        />

        <Controller
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label={'Lieu'}
              error={!!errors.lieu}
              {...(errors.lieu && {
                error: true,
                helperText: errors?.lieu?.message
              })}
            />
          )}
          name={'lieu'}
          control={control}
        />
      </Grid2>
      <Grid2>
        <div className='flex justify-center gap-4 mt-6'>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {addMutation.isPending || updateMutation.isPending ? 'Traitement...' : client ? 'Mettre à jour' : 'Ajouter'}
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={handleCancel}
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            Annuler
          </Button>
        </div>
      </Grid2>
    </form>
  )
}

export default AddEditClient
