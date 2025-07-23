'use client'
import { forwardRef, useState } from 'react'
import type { ReactElement, Ref } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import type { SlideProps } from '@mui/material/Slide'

import { signOut } from 'next-auth/react'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const RedirectModalToLogin = ({ show }: { show: boolean }) => {
  const [open, setOpen] = useState<boolean>(show)

  const handleRedirect = () => {
    handleUserLogout()
    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    } catch (error) {
      console.error(error)

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleRedirect}
      TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      closeAfterTransition={false}
    >
      <DialogTitle id='alert-dialog-slide-title'>Session expirée</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          Votre session a expiré ou est invalide. Veuillez vous reconnecter pour continuer.
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleRedirect} variant='contained' color='primary'>
          Se reconnecter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RedirectModalToLogin
