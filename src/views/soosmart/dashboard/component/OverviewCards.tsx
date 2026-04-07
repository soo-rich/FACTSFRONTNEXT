'use client'

import { useRouter, useParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import classnames from 'classnames'

import type { ThemeColor } from '@core/types'
import CustomAvatar from '@core/components/mui/Avatar'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import UtilsMetod from '@/utils/utilsmethod'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

type StatCardItem = {
  title: string
  value: string
  icon: string
  color: ThemeColor
  link?: string
}

const StatCard = ({ item }: { item: StatCardItem }) => {
  const router = useRouter()
  const { lang: locale } = useParams()

  const handleClick = () => {
    if (item.link) {
      router.push(getLocalizedUrl(item.link, locale as Locale))
    }
  }

  return (
    <Card className={classnames('h-full', { 'cursor-pointer': !!item.link })} onClick={handleClick}>
      <CardContent className='flex items-center gap-4'>
        <CustomAvatar color={item.color} skin='light' variant='rounded' size={42}>
          <i className={classnames(item.icon, 'text-[26px]')} />
        </CustomAvatar>
        <div className='flex flex-col'>
          <Typography variant='h5'>{item.value}</Typography>
          <Typography variant='body2' color='text.secondary'>
            {item.title}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

const OverviewCards = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'dashboard'],
    queryFn: StatAPIService.getDashboard,
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  const cards: StatCardItem[] = [
    {
      title: 'Clients',
      value: String(data.totalClients),
      icon: 'tabler-users',
      color: 'primary',
      link: 'client'
    },
    {
      title: 'Proformas',
      value: String(data.totalProformas),
      icon: 'tabler-file',
      color: 'secondary',
      link: 'proforma'
    },
    {
      title: 'Bordereaux',
      value: String(data.totalBordereaux),
      icon: 'tabler-file-report',
      color: 'info',
      link: 'order_slip'
    },
    {
      title: 'Factures',
      value: String(data.totalInvoices),
      icon: 'tabler-file-description',
      color: 'success',
      link: 'facture'
    },
    {
      title: "Chiffre d'affaires HT",
      value: `${UtilsMetod.formatDevise(data.totalRevenueHT)} FCFA`,
      icon: 'tabler-currency-dollar',
      color: 'warning'
    },
    {
      title: 'Factures payées',
      value: `${UtilsMetod.formatDevise(data.paidInvoicesAmount)} FCFA`,
      icon: 'tabler-check',
      color: 'success'
    },
    {
      title: 'Factures impayées',
      value: `${UtilsMetod.formatDevise(data.unpaidInvoicesAmount)} FCFA`,
      icon: 'tabler-alert-circle',
      color: 'error'
    },
    {
      title: 'Articles',
      value: String(data.totalArticles),
      icon: 'tabler-box',
      color: 'info',
      link: 'article'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard item={card} />
        </Grid>
      ))}
    </Grid>
  )
}

export default OverviewCards
