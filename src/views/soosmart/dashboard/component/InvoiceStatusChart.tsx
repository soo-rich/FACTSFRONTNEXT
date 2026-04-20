'use client'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from '@/libs/Recharts'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

const COLORS = [
  { key: 'pending', label: 'En attente', color: '#ffe700' },
  { key: 'paid', label: 'Payées', color: '#00d4bd' },
  { key: 'partiallyPaid', label: 'Partiellement payées', color: '#826af9' },
  { key: 'canceled', label: 'Annulées', color: '#ff4c51' }
]

type LabelProp = {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

const RADIAN = Math.PI / 180

const renderLabel = (props: LabelProp) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent === 0) return null

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central' className='max-[400px]:text-xs'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const InvoiceStatusChart = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'invoice', 'status'],
    queryFn: StatAPIService.getInvoiceStatus,
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  const chartData = COLORS.map(item => ({
    name: item.label,
    value: data[item.key as keyof typeof data] as number,
    color: item.color
  }))

  return (
    <Card className='h-full'>
      <CardHeader title='Statut des Factures' subheader={`Taux de paiement: ${data.paymentRate.toFixed(1)}%`} />
      <CardContent>
        <AppRecharts>
          <div className='bs-[300px]'>
            <ResponsiveContainer>
              <PieChart style={{ direction: 'ltr' }}>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  dataKey='value'
                  label={renderLabel as any}
                  labelLine={false}
                  stroke='none'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center flex-wrap gap-6 mt-4'>
          {COLORS.map((item, index) => (
            <Box key={index} className='flex items-center gap-1.5' sx={{ '& i': { color: item.color } }}>
              <i className='tabler-circle-filled text-xs' />
              <Typography variant='body2'>{item.label}</Typography>
            </Box>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default InvoiceStatusChart
