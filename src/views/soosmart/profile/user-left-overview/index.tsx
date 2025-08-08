// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserDetails from './UserDetails'

const ProfileUserLeftOverview = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails />
      </Grid>
    </Grid>
  )
}

export default ProfileUserLeftOverview
