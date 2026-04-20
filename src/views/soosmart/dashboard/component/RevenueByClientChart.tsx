'use client'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useQuery } from '@tanstack/react-query'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from '@/libs/Recharts'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

const RevenueByClientChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'revenue', 'by-client'],
    queryFn: () => StatAPIService.getRevenueByClient({ limit: 10 }),
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
      <CardHeader title="Chiffre d'affaires par client" subheader='Top 10 clients' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <BarChart data={data} layout='vertical' style={{ direction: 'ltr' }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' tickFormatter={formatValue} tick={{ fontSize: 12 }} />
                <YAxis type='category' dataKey='label' width={120} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`,
                    name === 'totalHT' ? 'Total HT' : 'Total TTC'
                  ]}
                />
                <Legend formatter={(value: string) => (value === 'totalHT' ? 'Total HT' : 'Total TTC')} />
                <Bar dataKey='totalHT' fill='var(--mui-palette-primary-main)' radius={[0, 4, 4, 0]} />
                <Bar dataKey='totalTTC' fill='var(--mui-palette-info-main)' radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default RevenueByClientChart
