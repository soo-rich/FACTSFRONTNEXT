// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserDetails from './UserDetails'
import type { UtilisateurDto } from '@/types/soosmart/utilisateur.type'

const ProfileUserLeftOverview = ({ userData }: { userData: UtilisateurDto }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails user={userData} />
      </Grid>
    </Grid>
  )
}

export default ProfileUserLeftOverview
