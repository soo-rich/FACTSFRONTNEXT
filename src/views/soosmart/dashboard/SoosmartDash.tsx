'use client'


import Grid from '@mui/material/Grid2'


import { DocumentStatCard }  from '@views/soosmart/dashboard/component/DocumentStatCard'
import DocumentList from '@views/soosmart/dashboard/component/DocumentList'
import RechartsPieChart from '@views/soosmart/dashboard/component/RechartsPieChart'

const SoosmartDash = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DocumentStatCard />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <DocumentList />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <RechartsPieChart />
      </Grid>
    </Grid>
  )
}

export default SoosmartDash
