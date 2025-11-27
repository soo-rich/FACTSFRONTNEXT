'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

// Component Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'


import { AlertTriangle, CheckCheckIcon } from 'lucide-react'

import CustomTextField from '@core/components/mui/TextField'


import { changePasswordSchema } from '@/types/soosmart/utilisateur.type'
import type { ChangePassword } from '@/types/soosmart/utilisateur.type'
import { UserService } from '@/service/user/user.service'

const ChangePassword = () => {

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ChangePassword>
      ({
        resolver: valibotResolver(changePasswordSchema),
        defaultValues: {
          newpassword: '',
          password: '',
          confirmpassword: ''
        }
      })


  const handleMutation = useMutation({
    mutationKey: ['change-password'],
    mutationFn: async (data: ChangePassword) => {
      return await UserService.changepassword({ newPassword: data.newpassword, oldPassword: data.password })
    },
    onSuccess: (data) => {
      data ? toast.success('Password changed successfully') : toast.error('Error changing password')
      setIsOk(data)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Error changing password')
    }
  })

  const submitForm = (data: ChangePassword) => {
    handleMutation.mutateAsync(data)
  }


  // States
  const [isOldPasswordShown, setIsOldPasswordShown] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isOk, setIsOk] = useState(false)

  return (
    <Card>
      <CardHeader title="Change Password" />
      <CardContent className="flex flex-col gap-4">
        <Alert icon={isOk ? <CheckCheckIcon /> : <AlertTriangle />} severity={isOk ? "success" : "warning"} >
          <AlertTitle>{isOk ? "Mot de passe changé avec succès" : "S'assurer que ces exigences sont respectées"}</AlertTitle>
          {isOk ? '' : '8 caractères minimum, majuscules et symboles'}
        </Alert>
        <form onSubmit={handleSubmit(submitForm)}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller render={({ field }) => <CustomTextField
                {...field}
                fullWidth
                label="Mot de passe actuel"
                type={isOldPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setIsOldPasswordShown(!isOldPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isOldPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={!!errors.password}
                {...(errors.password && {
                  error: true,
                  helperText: errors?.password?.message
                })}
              />} control={control} name={"password"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller render={({ field }) => <CustomTextField
                {...field}
                fullWidth
                label="Nouveau mot de passe"
                type={isPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setIsPasswordShown(!isPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={!!errors.newpassword}
                {...(errors.newpassword && {
                  error: true,
                  helperText: errors?.newpassword?.message
                })}
              />} control={control} name={"newpassword"} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller render={({ field }) => <CustomTextField
                {...field}
                fullWidth
                label="Confirmer le mot de passe"
                type={isConfirmPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={!!errors.confirmpassword}
                {...(errors.confirmpassword && {
                  error: true,
                  helperText: errors?.confirmpassword?.message
                })}
              />} control={control} name={"confirmpassword"} />
            </Grid>

            <Grid size={{ xs: 12 }} className="flex gap-4">
              <Button type="submit" disabled={handleMutation.isPending} variant="contained">Changer le mot de passe</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePassword
