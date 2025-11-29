'use client'

// MUI Imports
import { useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'


import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'
import Utilsmethod from '@/utils/utilsmethod'
import type { UtilisateurDto } from '@/types/soosmart/utilisateur.type'
import AddEditUser from '../../user/add-edit-user'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { UserService } from '@/service/user/user.service'

//
const UserDetails = ({ user: userData }: { user: UtilisateurDto }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const queryKey = useMemo(() => [userData.image + '-file'], [userData.image])

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return (await Utilsmethod.getFileFormApi(userData.image ?? '', 'minio'))
    },
    enabled: !!userData.image
  })

  const handleSucces = () => {
    queryClient.invalidateQueries({ queryKey: queryKey })
    queryClient.invalidateQueries({ queryKey: [UserService.USER_KEY + 'info'] })
    setOpen(false)
  }


  return (

    <>
      <Card>
        <CardContent className="flex flex-col pbs-12 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center flex-col gap-4">
              <div className="flex flex-col items-center gap-4">
                <CustomAvatar alt="user-profile" src={data?.presigned || "https://picsum.photos/200"} variant="rounded" size={120} />
                <Typography variant="h5">{`${userData.nom} ${userData.prenom}`}</Typography>
              </div>
              <Chip label={userData.role} color="info" size="small" variant="tonal" />
            </div>
          </div>
          <div>
            <Typography variant="h5">Details</Typography>
            <Divider className="mlb-4" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Nom:
                </Typography>
                <Typography>{userData.nom}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Prenom:
                </Typography>
                <Typography>{userData.prenom}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Username:
                </Typography>
                <Typography>{userData.username}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Email:
                </Typography>
                <Typography>{userData.email}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Status
                </Typography>
                <Chip label={userData.actif ? 'Activer' : 'Desactiver'} color={userData.actif ? 'success' : 'error'}
                  size="small" variant="tonal" />
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Contact:
                </Typography>
                <Typography color="text.primary">{userData.telephone}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Inscription:
                </Typography>
                <Typography color="text.primary">{Utilsmethod.formatDate(userData.dateCreation)}</Typography>
              </div>
            </div>
          </div>
          <Divider className="mlb-4" />
          <div className='flex justify-center'>
            <Button variant='contained' color='primary' onClick={() => { setOpen(true) }}>
              Mettre à jour le profil
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth scroll='body'
        closeAfterTransition={false}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-8 sm:pbe-6 sm:pli-16'>
          {'Mettre à jour le profil'}
          <Typography component='span' className='flex flex-col text-center'>
            {'Mettre à jour les informations du profil utilisateur'}
          </Typography>
        </DialogTitle>
        <DialogContent className="sm:pbs-0 sm:pbe-6 sm:pli-8">
          <AddEditUser data={userData} onCancel={() => setOpen(false)} onSuccess={() => handleSucces()} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserDetails
