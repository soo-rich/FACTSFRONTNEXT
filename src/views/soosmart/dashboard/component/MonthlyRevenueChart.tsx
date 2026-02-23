'use client'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useQuery } from '@tanstack/react-query'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from '@/libs/Recharts'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

const MonthlyRevenueChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'revenue', 'monthly'],
    queryFn: () => StatAPIService.getMonthlyRevenue(),
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  const formatValue = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`

    return String(value)
  }

  return (
    <Card className='h-full'>
      <CardHeader title="Évolution du chiffre d'affaires" subheader='12 derniers mois' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <AreaChart data={data} style={{ direction: 'ltr' }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='label' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatValue} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`,
                    name === 'totalHT' ? 'Total HT' : 'Total TTC'
                  ]}
                />
                <Legend formatter={(value: string) => (value === 'totalHT' ? 'Total HT' : 'Total TTC')} />
                <Area
                  type='monotone'
                  dataKey='totalHT'
                  stroke='var(--mui-palette-primary-main)'
                  fill='var(--mui-palette-primary-lightOpacity)'
                  strokeWidth={2}
                />
                <Area
                  type='monotone'
                  dataKey='totalTTC'
                  stroke='var(--mui-palette-success-main)'
                  fill='var(--mui-palette-success-lightOpacity)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default MonthlyRevenueChart
