'use client'

import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'
import { Grid2, TextareaAutosize } from '@mui/material'

import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

import CustomTextField from '@core/components/mui/TextField'
import type { ProjetType, SaveProjet, UpdateProjet } from '@/types/soosmart/projet.type'
import { schemaProjetSave } from '@/types/soosmart/projet.type'
import { ProjetService } from '@/service/projet/projet.service'
import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'

import { ClientService } from '@/service/client/client.service'

import CustomAutocomplete from '@core/components/mui/Autocomplete'

const AddEditProjet = ({ data: projet, onSuccess, onCancel }: AddEditFormType<ProjetType>) => {
  const queryClient = useQueryClient()
  const [clientName, setClientName] = useState<string>('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SaveProjet>({
    resolver: valibotResolver(schemaProjetSave),
    defaultValues: {
      projet_type: projet?.projet_type ?? '',
      description: projet?.description ?? '',
      client_id: projet?.client ?? '',
      offre: projet?.offre ?? false
    }
  })

  const querykey = useMemo(() => [`${ClientService.CLIENT_KEY}+search`, clientName], [clientName])

  const { data } = useQuery({
    queryKey: querykey,
    queryFn: async () => {
      return await ClientService.getClientsByNom(clientName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const AddMutation = useMutation({
    mutationFn: async (data: SaveProjet) => {
      return await ProjetService.saveProjet(data)
    },
    onSuccess: data => {
      toast.success('Ajout OK')
      reset({
        projet_type: '',
        description: '',
        client_id: '',
        offre: false
      })

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [ProjetService.PROJT_KEY]
      })

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du projet")
    }
  })

  const UpdateMutation = useMutation({
    mutationFn: async (data: UpdateProjet) => {
      if (!projet?.id) {
        toast.warning('Aucun projet sélectionné pour la mise à jour')

        return
      }

      return await ProjetService.updateProjet(data, projet?.id)
    },
    onSuccess: () => {
      toast.success('Mise à jour OK')
      reset({
        projet_type: '',
        description: '',
        client_id: '',
        offre: false
      })

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [ProjetService.PROJT_KEY]
      })

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du projet')
    }
  })

  const onSubmit = (data: SaveProjet) => {
    if (projet) {
      UpdateMutation.mutate({
        ...data
      })
    } else {
      console.log(data)
      AddMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    reset({
      projet_type: '',
      description: '',
      client_id: '',
      offre: false
    })

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'space-y-4'}>
      <Grid2 container direction={'column'} spacing={3}>
        <Grid2 container direction={'row'} spacing={3}>
          <Grid2 size={10}>
            <Controller
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={'Nom'}
                  error={!!errors.projet_type}
                  {...(errors.projet_type && {
                    error: true,
                    helperText: errors?.projet_type?.message
                  })}
                />
              )}
              name={'projet_type'}
              control={control}
            />
          </Grid2>

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
                  <Typography>Offre</Typography>
                  <Checkbox {...field} checked={field.value} />
                </div>
              )}
              name={'offre'}
              control={control}
            />
          </Grid2>
        </Grid2>
        <Grid2 container direction={'row'} spacing={3}>
          <Grid2 size={10}>
            <Controller
              render={({ field }) => (
                <CustomAutocomplete
                  options={data || []}
                  hidden={!!projet}
                  fullWidth
                  onChange={(event, newvalue) => {
                    field.onChange(event)

                    if (newvalue) {
                      field.onChange(newvalue.id)
                    } else {
                      field.onChange('')
                    }
                  }}
                  getOptionKey={option => option.id}
                  getOptionLabel={option => {
                    return option.nom + ' - ' + option.sigle
                  }}
                  renderInput={params => {
                    return (
                      <CustomTextField
                        {...params}
                        label={'Client'}
                        fullWidth
                        onChange={event => {
                          const value = event.target.value

                          setClientName(value)
                        }}
                        error={!!errors.client_id}
                        {...(errors.client_id && {
                          error: true,
                          helperText: errors?.client_id?.message
                        })}
                      />
                    )
                  }}
                />
              )}
              name={'client_id'}
              control={control}
            />
          </Grid2>
          <Grid2
            container
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
            size={2}
          >
            <Button
              onClick={() => {}}
              color={'inherit'}
              variant={'contained'}
              startIcon={<i className={'tabler-plus'}></i>}
            >
              Client
            </Button>
          </Grid2>
        </Grid2>
        <Grid2
          size={12}
          container
          direction={'column'}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}
        >
          <Typography>Description</Typography>
          <Controller
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                style={{ height: '20%' }}
                className={
                  'border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-primary h-32'
                }
                placeholder={'Description du projet'}
                error={!!errors.description}
                {...(errors.description && {
                  error: true,
                  helperText: errors?.description?.message
                })}
              />
            )}
            name={'description'}
            control={control}
          />
        </Grid2>
      </Grid2>
      <Grid2>
        <div className='flex justify-center gap-4 mt-6'>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={AddMutation.isPending || UpdateMutation.isPending}
          >
            {AddMutation.isPending || UpdateMutation.isPending ? 'Traitement...' : projet ? 'Mettre à jour' : 'Ajouter'}
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={handleCancel}
            disabled={AddMutation.isPending || UpdateMutation.isPending}
          >
            Annuler
          </Button>
        </div>
      </Grid2>
    </form>
  )
}

export default AddEditProjet
