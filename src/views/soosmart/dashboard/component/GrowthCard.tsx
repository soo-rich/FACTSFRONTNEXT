'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useQuery } from '@tanstack/react-query'
import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import UtilsMetod from '@/utils/utilsmethod'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const GrowthCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'growth'],
    queryFn: StatAPIService.getGrowthComparison,
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  const isPositive = data.growthRate >= 0
  const growthColor = isPositive ? 'success' : 'error'
  const growthIcon = isPositive ? 'tabler-trending-up' : 'tabler-trending-down'

  return (
    <Card className='h-full'>
      <CardHeader title='Croissance mensuelle' />
      <CardContent className='flex flex-col gap-6'>
        <div className='flex items-center gap-4'>
          <CustomAvatar color={growthColor} skin='light' variant='rounded' size={48}>
            <i className={classnames(growthIcon, 'text-[28px]')} />
          </CustomAvatar>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <Typography variant='h4'>{UtilsMetod.formatDevise(data.currentPeriodRevenue)} FCFA</Typography>
              <Chip
                label={`${isPositive ? '+' : ''}${data.growthRate.toFixed(1)}%`}
                color={growthColor}
                size='small'
                variant='tonal'
              />
            </div>
            <Typography variant='body2' color='text.secondary'>
              Mois en cours ({data.currentPeriodCount} proforma{data.currentPeriodCount > 1 ? 's' : ''})
            </Typography>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <CustomAvatar color='secondary' skin='light' variant='rounded' size={48}>
            <i className={classnames('tabler-calendar-minus', 'text-[28px]')} />
          </CustomAvatar>
          <div className='flex flex-col'>
            <Typography variant='h5'>{UtilsMetod.formatDevise(data.previousPeriodRevenue)} FCFA</Typography>
            <Typography variant='body2' color='text.secondary'>
              Mois précédent ({data.previousPeriodCount} proforma{data.previousPeriodCount > 1 ? 's' : ''})
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GrowthCard
