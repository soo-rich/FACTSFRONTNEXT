'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'


import CustomAvatar from '@core/components/mui/Avatar'
import Utilsmethod from '@/utils/utilsmethod'
import type { UtilisateurDto } from '@/types/soosmart/utilisateur.type'

//
const UserDetails = ({ user: userData }: { user: UtilisateurDto }) => {

  return (

    <>
      <Card>
        <CardContent className="flex flex-col pbs-12 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center flex-col gap-4">
              <div className="flex flex-col items-center gap-4">
                <CustomAvatar alt="user-profile" src="https://picsum.photos/200" variant="rounded" size={120} />
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
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
