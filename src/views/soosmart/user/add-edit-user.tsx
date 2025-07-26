import {AddEditFormType} from "@/types/soosmart/add-edit-modal.type";
import {
  userCreateSchema,
  UtilisateurDto,
  UtilisateurUpdate,
  UtilsateurRegister
} from "@/types/soosmart/utilisateur.type";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Controller, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {UserService} from "@/service/user/user.service";
import {toast} from "react-toastify";
import {Grid2} from "@mui/material";
import CustomTextField from "@core/components/mui/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {useState} from "react";

const AddEditUser = ({data: user, onSuccess, onCancel}: AddEditFormType<UtilisateurDto>) => {
  const queryClient = useQueryClient();
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm<UtilsateurRegister>({
    resolver: valibotResolver(userCreateSchema),
    defaultValues: {
      email: user?.email ?? '',
      nom: user?.nom ?? '',
      numero: String(user?.telephone ?? 0) ?? '',
      username: user?.username ?? '',
      prenom: user?.prenom ?? '',
      password: 'user1234',
    },
  })

  const AddMutation = useMutation({
    mutationFn: async (data: UtilsateurRegister) => {
      return await UserService.create(data);
    },
    onSuccess: () => {
      toast.success('Ajout OK');
      reset();
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      });
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  })


  const UpdateMutation = useMutation({
    mutationFn: async (data: UtilsateurRegister) => {
      if (!user?.id) {
        toast.warning('Aucun utilisateur à mettre à jour');
        return;
      }
      const updateData: UtilisateurUpdate = {...data, id: user.id}
      return await UserService.update({id: user.id, user: updateData});
    },
    onSuccess: () => {
      toast.success('Mise à jour OK');
      reset();
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      });
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  })

  const handleCancel = () => {
    reset(
      {
        email: '',
        nom: '',
        prenom: '',
        password: '',
        username: ''
      }
    );
    if (onCancel) {
      onCancel();
    }
  }

  const submitForm = (data: UtilsateurRegister) => {
    if (user) {
      UpdateMutation.mutate(data);
    } else {
      AddMutation.mutate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <Grid2 container direction={'column'} spacing={3}>
        <Controller render={
          ({field}) => (
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
          )
        } name={'nom'} control={control}/>
        <Controller render={
          ({field}) => (
            <CustomTextField
              {...field}
              fullWidth

              label={'Prenom'}
              error={!!errors.prenom}
              {...(errors.password && {
                error: true,
                helperText: errors?.prenom?.message
              })}
            />
          )
        } name={'prenom'} control={control}/>
        <Controller render={
          ({field}) => (
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
          )
        } name={'email'} control={control}/>
        <Controller render={
          ({field}) => (
            <CustomTextField
              {...field}
              fullWidth
              label={'Numero'}
              error={!!errors.numero}
              {...(errors.numero && {
                error: true,
                helperText: errors?.numero?.message
              })}
            />
          )
        } name={'numero'} control={control}/>

        <Grid2 size={12} direction={'row'} container spacing={2} sx={{
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}>

          <Grid2 hidden={!!user} size={6}>

            <Controller render={
              ({field}) => (
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
              )
            } name={'username'} control={control}/>
          </Grid2>

          <Grid2 hidden={!!user} size={6}>
            <Controller
              name='password'
              control={control}

              render={({field}) => (<CustomTextField
                {...field}
                fullWidth
                label='Password'
                disabled={true}
                placeholder='············'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                onChange={e => {
                  field.onChange(e.target.value)

                }}
                {...((errors.password) && {
                  error: true,
                  helperText: errors?.password?.message
                })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'}/>
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />)}/>
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2>
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={AddMutation.isPending || UpdateMutation.isPending}
          >
            {AddMutation.isPending || UpdateMutation.isPending
              ? 'Traitement...'
              : user ? 'Mettre à jour' : 'Ajouter'
            }
          </Button>
          <Button
            variant="outlined"
            color="error"
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
