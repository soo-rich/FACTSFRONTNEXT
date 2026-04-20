'use client'

import Grid from '@mui/material/Grid'

import OverviewCards from '@views/soosmart/dashboard/component/OverviewCards'
import GrowthCard from '@views/soosmart/dashboard/component/GrowthCard'
import MonthlyRevenueChart from '@views/soosmart/dashboard/component/MonthlyRevenueChart'
import ProformaStatusChart from '@views/soosmart/dashboard/component/ProformaStatusChart'
import InvoiceStatusChart from '@views/soosmart/dashboard/component/InvoiceStatusChart'
import RevenueByClientChart from '@views/soosmart/dashboard/component/RevenueByClientChart'
import TopArticlesTable from '@views/soosmart/dashboard/component/TopArticlesTable'
import ClientRankingTable from '@views/soosmart/dashboard/component/ClientRankingTable'
import MonthlyDocumentsChart from '@views/soosmart/dashboard/component/MonthlyDocumentsChart'

const SoosmartDash = () => {
  return (
    <Grid container spacing={6}>
      {/* Overview KPI cards */}
      <Grid size={{ xs: 12 }}>
        <OverviewCards />
      </Grid>

      {/* Growth card + Monthly revenue chart */}
      <Grid size={{ xs: 12, md: 4 }}>
        <GrowthCard />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <MonthlyRevenueChart />
      </Grid>

      {/* Proforma & Invoice status pie charts */}
      <Grid size={{ xs: 12, md: 6 }}>
        <ProformaStatusChart />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <InvoiceStatusChart />
      </Grid>

      {/* Revenue by client bar chart */}
      <Grid size={{ xs: 12 }}>
        <RevenueByClientChart />
      </Grid>

      {/* Monthly documents + Top articles */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MonthlyDocumentsChart />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TopArticlesTable />
      </Grid>

      {/* Client ranking table */}
      <Grid size={{ xs: 12 }}>
        <ClientRankingTable />
      </Grid>
    </Grid>
  )
}

export default SoosmartDash
