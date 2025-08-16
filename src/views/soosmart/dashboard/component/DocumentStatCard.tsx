'use client'

import type { CardProps } from '@mui/material/Card'

// MUI Imports
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import Divider from '@mui/material/Divider'

import Grid from '@mui/material/Grid2'

import { useQuery } from '@tanstack/react-query'

import type { ThemeColor } from '@core/types'

//Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import type { FactStat } from '@/types/soosmart/statistique/statistique.type'
import type { DashComponementType } from '@/types/componentTypes'

import { StatAPIService } from '@/service/statistique/stat-api.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import Utilsmethod from '@/utils/utilsmethod'
import DashCardStatsSquare from '@views/soosmart/dashboard/component/DashCardStatsSquare'

type Props = CardProps & {
  color: ThemeColor
}

const Card = styled(MuiCard)<Props>(({ color }) => ({
  transition: 'border 0.3s ease-in-out, box-shadow 0.3s ease-in-out, margin 0.3s ease-in-out',
  borderBottomWidth: '2px',
  borderBottomColor: `var(--mui-palette-${color}-darkerOpacity)`,
  '[data-skin="bordered"] &:hover': {
    boxShadow: 'none'
  },
  '&:hover': {
    borderBottomWidth: '3px',
    borderBottomColor: `var(--mui-palette-${color}-main) !important`,
    boxShadow: 'var(--mui-customShadows-lg)',
    marginBlockEnd: '-1px'
  }
}))

const DashCard = ({ props, data }: { props: DashComponementType, data: FactStat }) => {
  // Props
  const { title, avatarIcon, color } = props
  const { total=0, total_today=0, adopted_false=0, adopted_true=0 } = data

  return (
    <Card color={color || 'primary'}>
      <Typography variant={'h5'} className={'pt-5 pl-5'}>{title}</Typography>
      <CardContent className="flex flex-row gap-1">
        <div className={'flex flex-col gap-6'}>
          <div className="flex items-center gap-4">
            <CustomAvatar color={color} skin="light" variant="rounded">
              <i className={classnames(avatarIcon, 'text-[28px]')} />
            </CustomAvatar>
            <Typography variant="h4">{total}</Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography>{total_today} {`genéré${total_today >= 1 ? '' : 's'} aujourd'hui`}</Typography>
          </div>
        </div>
        {
          adopted_true && (<>
              <div>
                <Divider className={'mx-2'} orientation={'vertical'} />
              </div>

              <div className="flex flex-col items-center gap-6">

                <Typography variant="h4">Adopter {adopted_true}</Typography>
                <Typography>Non Adopter {adopted_false}</Typography>
              </div>
            </>
          )
        }

      </CardContent>
    </Card>
  )
}

export const DocumentStatCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: [StatAPIService.STAT_KEY + '/stat'],
    queryFn: async () => {
      return await StatAPIService.getstat()
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  })

  const { data: facture, isLoading: isFacture } = useQuery({
    queryKey: [StatAPIService.STAT_KEY + '/facte'],
    queryFn: async () => {
      return await StatAPIService.getTotalFacture()
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  })

  return (
    <Grid container spacing={6}>

      {data &&
        (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {
              isLoading ? (<LoadingWithoutModal />) :
                (
                  <DashCard props={{ title: 'Proforma', avatarIcon: 'tabler-file', color: 'secondary' }}
                            data={data?.proforma} />)}
          </Grid>)
      }{data &&
      (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {
            isLoading ? (<LoadingWithoutModal />) :
              (
                <DashCard props={{ title: 'Borderau', avatarIcon: 'tabler-file-report', color: 'info' }}
                          data={data?.bordeau} />)}
        </Grid>)
    }{data &&
      (
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          {
            isLoading ? (<LoadingWithoutModal />) :
              (
                <DashCard props={{ title: 'Facture', avatarIcon: 'tabler-file-description', color: 'success' }}
                          data={data?.facture} />)}
        </Grid>)
    }
      {
        isFacture
          ? <LoadingWithoutModal />
          : facture
            ? (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <DashCardStatsSquare avatarIcon={'tabler-file-description'} avatarColor={'primary'} stats={String(Utilsmethod.formatDevise(facture.Paid))+' FCFA'}
                                   statsTitle={'Facture Payer'} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <DashCardStatsSquare avatarIcon={'tabler-file-description'} avatarColor={'warning'} stats={String(Utilsmethod.formatDevise(facture.Unpaid))+' FCFA'}
                                   statsTitle={'Facture Inpayer'} />
                </Grid>
              </>
            )
            : <ErrorView />
      }
    </Grid>
  )
}


// export default DocumentStatCard
