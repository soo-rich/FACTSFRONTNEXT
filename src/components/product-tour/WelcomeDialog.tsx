'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface WelcomeDialogProps {
  open: boolean
  onStart: () => void
  onSkip: () => void
  onLater: () => void
}

const WelcomeDialog = ({ open, onStart, onSkip, onLater }: WelcomeDialogProps) => {
  return (
    <Dialog
      open={open}
      maxWidth='xs'
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.lightOpacity',
              fontSize: '1.25rem',
              flexShrink: 0
            }}
          >
            <i className='tabler-map-route' style={{ color: 'var(--mui-palette-primary-main)', fontSize: '1.25rem' }} />
          </Box>
          <Typography variant='h5' component='span' sx={{ fontWeight: 600 }}>
            Bienvenue dans SOOSMART !
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 1 }}>
        <Typography color='text.secondary' sx={{ lineHeight: 1.7 }}>
          Souhaitez-vous faire un rapide tour de l&apos;application pour découvrir les fonctionnalités principales ?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <i className='tabler-clock' style={{ color: 'var(--mui-palette-text-disabled)', fontSize: '0.875rem' }} />
          <Typography variant='caption' color='text.disabled'>
            Environ 2 minutes
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Button
          size='small'
          color='inherit'
          onClick={onSkip}
          sx={{ color: 'text.disabled', fontSize: '0.8125rem' }}
        >
          Ne plus afficher
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size='small' variant='outlined' color='secondary' onClick={onLater}>
            Plus tard
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={onStart}
            endIcon={<i className='tabler-arrow-right' />}
          >
            Démarrer
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default WelcomeDialog
