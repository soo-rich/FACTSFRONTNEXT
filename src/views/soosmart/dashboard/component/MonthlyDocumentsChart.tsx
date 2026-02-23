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

const MonthlyDocumentsChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'documents', 'monthly'],
    queryFn: () => StatAPIService.getMonthlyDocuments(),
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  return (
    <Card className='h-full'>
      <CardHeader title='Documents générés par mois' subheader='12 derniers mois' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[300px]'>
            <ResponsiveContainer>
              <BarChart data={data} style={{ direction: 'ltr' }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='label' tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [value, name === 'count' ? 'Nombre de documents' : name]}
                />
                <Legend formatter={() => 'Nombre de documents'} />
                <Bar dataKey='count' fill='var(--mui-palette-info-main)' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default MonthlyDocumentsChart
