'use client'

import Grid from '@mui/material/Grid2'

import { useQuery } from '@tanstack/react-query'

import ProfileUserLeftOverview from "./user-left-overview"
import UserRight from "./user-right"
import { UserService } from '@/service/user/user.service'
import ErrorView from '@/components/ErrorView'
import LoadingWithoutModal from '@/components/LoadingWithoutModal'


const ProfilIndex = () => {



  const { data: userData, isLoading, isError } = useQuery(
    {
      queryKey: [UserService.USER_KEY + 'info'],
      queryFn: UserService.useConnect,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  )


  return isError ? <ErrorView /> : isLoading ? <LoadingWithoutModal /> : userData && (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <ProfileUserLeftOverview userData={userData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <UserRight />
      </Grid>
    </Grid>
  )
}

export default ProfilIndex
