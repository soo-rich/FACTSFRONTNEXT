'use client'

// React Imports
import {useState} from 'react'

// Next Imports
import Link from 'next/link'
import {useParams, useRouter, useSearchParams} from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Type Imports
import type {Locale} from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import {getLocalizedUrl} from '@/utils/i18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import {Controller, type SubmitHandler, useForm} from "react-hook-form";
import zod from 'zod'
import {schemaLogin} from "@/service/auth/auth-service";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";


type formdata = zod.infer<typeof schemaLogin>

const Login = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const {lang: locale} = useParams()


  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting, isValidating, isSubmitSuccessful}

  } = useForm<formdata>(
    {
      resolver: zodResolver(schemaLogin),
      defaultValues: {
        username: 'ulrich',
        password: '123456789'
      },
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      criteriaMode: 'all',
      shouldFocusError: true,
      shouldUnregister: true
    }
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const onSubmit: SubmitHandler<formdata> = async (data: formdata) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    })

    if (res && res.ok && res.error === null) {
      // Vars
      const redirectURL = searchParams.get('redirectTo') ?? '/'

      router.replace(getLocalizedUrl(redirectURL, locale as Locale))
    } else {
      if (res?.error) {
        const error = JSON.parse(res.error)
      }
    }
  }

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center mbe-6'>
            <Logo/>
          </Link>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>{`Bienvenue a ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>
              Veuillez vous connecter pour continuer
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Controller
              name='username'
              control={control}
              rules={{required: true}}
              render={({field}) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  label='Username'
                  onChange={e => {
                    field.onChange(e.target.value)

                  }}
                  {...((errors.username) && {
                    error: true,
                    helperText: errors?.password?.message
                  })}
                  placeholder='Enter your  username'/>)}
            />
            <Controller
              name='password'
              control={control}
              rules={{required: true}}
              render={({field}) => (<CustomTextField
                {...field}
                fullWidth
                label='Password'
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
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox/>} label='Remember me'/>
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/', locale as Locale)}
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              {isSubmitting?'En cours':'Connexion'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default Login
