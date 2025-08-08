'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Component Imports
import { useQuery } from '@tanstack/react-query'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from '@/libs/Recharts'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

type LabelProp = {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

// Color Data
const data = [
  { label: 'Facture', color: '#00d4bd' },
  { label: 'bordereau', color: '#ffe700' },
  { label: 'Proforma', color: '#12e80a' }
]

const RADIAN = Math.PI / 180

const renderCustomizedLabel = (props: LabelProp) => {
  // Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Vars
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" className="max-[400px]:text-xs">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const RechartsPieChart = () => {

  const { data: stats, isLoading, isError } = useQuery(({
    queryKey: [StatAPIService.STAT_KEY + 'chartData'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      return StatAPIService.getChartData().then((res) => {
        return res.map((item) => {
          const color = data.find(d => d.label.toLowerCase() === item.label.toLowerCase())?.color || '#000000'

          return {
            value: item.value || 0,
            name: item.label,
            color: color
          }
        })
      })
    }
  }))


  return (
    <Card className={'h-full'}>
      <CardHeader title="Pie Chart" subheader="" />
      <CardContent>{isLoading ? <LoadingWithoutModal /> : isError ? <ErrorView /> : (<>
          <AppRecharts>
            <div className="bs-[350px]">
              <ResponsiveContainer>
                <PieChart height={350} style={{ direction: 'ltr' }}>
                  <Pie
                    data={stats}
                    innerRadius={80}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={true}
                    stroke="none"
                  >
                    {stats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </AppRecharts>
          <div className="flex justify-center flex-wrap gap-6">
            {stats && stats.map((item, index) => (<Box key={index} className="flex items-center gap-1.5"
                                                       sx={{ '& i': { color: data.find(d => d.label.toLowerCase() === item.name.toLowerCase())?.color || '#000000' } }}>
                <i className="tabler-circle-filled text-xs" />
                <Typography variant="body2">{item.name.toUpperCase()}</Typography>
              </Box>
            ))}
          </div>
        </>
      )}</CardContent>
    </Card>
  )
}

export default RechartsPieChart
