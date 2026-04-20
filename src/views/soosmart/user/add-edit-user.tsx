import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'
import { Grid as Grid2 } from '@mui/material'
import { styled } from '@mui/material/styles'

import Button from '@mui/material/Button'

import MenuItem from '@mui/material/MenuItem'

import { Upload } from 'lucide-react'

import CustomTextField from '@core/components/mui/TextField'

import type { UtilisateurDto, UtilsateurRegister } from '@/types/soosmart/utilisateur.type'
import { userCreateSchema, userUpdateSchema } from '@/types/soosmart/utilisateur.type'
import { UserService } from '@/service/user/user.service'
import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'
import CustomAvatar from '@/@core/components/mui/Avatar'

import Utilsmethod from '@/utils/utilsmethod'
import CustomPhoneInput from '@components/CustomInput/CustomPhoneInput'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const AddEditUser = ({ data: user, onSuccess, onCancel }: AddEditFormType<UtilisateurDto>) => {
  const queryClient = useQueryClient()
  const [imageUrl, setImageUrl] = useState<string>('https://picsum.photos/200')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UtilsateurRegister>({
    resolver: valibotResolver(user !== undefined ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      image: undefined,
      email: user?.email ?? '',
      nom: user?.nom ?? '',
      numero: user?.numero ?? '288',
      username: user?.username ?? '',
      prenom: user?.prenom ?? '',
      role: user?.role.toUpperCase() ?? 'USER'
    }
  })

  const image = watch('image')

  useEffect(() => {
    if (image) {
      setImageUrl(URL.createObjectURL(image))
    } else if (user?.image) {
      Utilsmethod.getFileFormApi(user?.image.storageKey).then(value => {
        if (value) {
          setImageUrl(value)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  const AddMutation = useMutation({
    mutationFn: async (data: UtilsateurRegister) => {
      return await UserService.create(data)
    },
    onSuccess: () => {
      toast.success('Ajout OK')
      reset({
        email: '',
        nom: '',
        prenom: '',
        username: '',
        numero: '',
        role: 'USER'
      })

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY]
      })

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'utilisateur")
    }
  })

  const UpdateMutation = useMutation({
    mutationFn: async (data: UtilsateurRegister) => {
      if (!user?.id) {
        toast.warning('Aucun utilisateur à mettre à jour')

        return
      }

      const updateData: UtilsateurRegister = { ...data }

      return await UserService.update({ id: user.id, user: updateData })
    },
    onSuccess: () => {
      toast.success('Mise à jour OK')
      reset()

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY]
      })

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'utilisateur")
    }
  })

  const handleCancel = () => {
    reset({
      email: '',
      nom: '',
      prenom: '',
      username: '',
      role: 'USER'
    })

    if (onCancel) {
      onCancel()
    }
  }

  const submitForm = (data: UtilsateurRegister) => {
    if (user) {
      UpdateMutation.mutate(data)
    } else {
      AddMutation.mutate(data)
    }
  }

  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
      <Grid2 spacing={2} direction={'column'} container>
        <CustomAvatar alt='user-profile' src={imageUrl} variant='rounded' size={220} />

        <div className='w-1/3'>
          <Controller
            render={({ field }) => (
              <Button component='label' role={undefined} variant='contained' tabIndex={-1} startIcon={<Upload />}>
                Télécharger une image
                <VisuallyHiddenInput
                  type='file'
                  accept='image/*'
                  onChange={(event: any) => field.onChange(event.target.files[0])}
                  multiple
                />
              </Button>
            )}
            control={control}
            name='image'
          />
        </div>
      </Grid2>
      <Grid2 container direction={'column'} spacing={3}>
        <Controller
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
        <Controller
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label={'Prenom'}
              error={!!errors.prenom}
              {...(errors.prenom && {
                error: true,
                helperText: errors?.prenom?.message
              })}
            />
          )}
          name={'prenom'}
          control={control}
        />
        <Controller
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type={'email'}
              label={'Email'}
              error={!!errors.email}
              {...(errors.email && {
                error: true,
                helperText: errors?.email?.message
              })}
            />
          )}
          name={'email'}
          control={control}
        />
        <Controller
          render={({ field }) => (
            <CustomPhoneInput
              label={'Telephone principal'}
              required
              value={field.value ?? ''}
              onChange={field.onChange}
              {...(errors.numero && {
                error: true,
                helperText: errors?.numero?.message
              })}
            />
          )}
          name={'numero'}
          control={control}
        />

        <Grid2
          size={12}
          direction={'row'}
          container
          spacing={2}
          sx={{
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}
        >
          <Grid2 hidden={!!user} size={6}>
            <Controller
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={'Username'}
                  error={!!errors.username}
                  {...(errors.username && {
                    error: true,
                    helperText: errors?.username?.message
                  })}
                />
              )}
              name={'username'}
              control={control}
            />
          </Grid2>
          <Grid2 size={user ? 12 : 6}>
            <Controller
              render={({ field }) => (
                <CustomTextField
                  select
                  {...field}
                  fullWidth
                  label={'Role'}
                  error={!!errors.role}
                  {...(errors.role && {
                    error: true,
                    helperText: errors?.role?.message
                  })}
                >
                  <MenuItem value={'USER'}>Utilisateur</MenuItem>
                  <MenuItem value={'ADMIN'}>Administrateur</MenuItem>
                </CustomTextField>
              )}
              name={'role'}
              control={control}
            />
          </Grid2>
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
            {AddMutation.isPending || UpdateMutation.isPending ? 'Traitement...' : user ? 'Mettre à jour' : 'Ajouter'}
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

export default AddEditUser
