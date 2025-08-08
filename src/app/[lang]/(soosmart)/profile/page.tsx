import Grid from '@mui/material/Grid2'

import ProfileUserLeftOverview from '@views/soosmart/profile/user-left-overview'
import UserRight from '@views/soosmart/profile/user-right'


const ProfilePage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <ProfileUserLeftOverview />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <UserRight  />
      </Grid>
    </Grid>
  )
}

export default ProfilePage
