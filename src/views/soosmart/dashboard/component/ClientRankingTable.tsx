'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useQuery } from '@tanstack/react-query'
import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import { StatAPIService } from '@/service/statistique/stat-api.service'
import UtilsMetod from '@/utils/utilsmethod'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const rankColors = ['warning', 'secondary', 'info'] as const

const ClientRankingTable = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'clients', 'ranking'],
    queryFn: () => StatAPIService.getClientRanking({ limit: 10 }),
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  return (
    <Card className='h-full'>
      <CardHeader title='Classement clients' subheader="Par chiffre d'affaires" />
      <CardContent className='p-0'>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Client</TableCell>
                <TableCell align='right'>Proformas</TableCell>
                <TableCell align='right'>Total HT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((client, index) => (
                <TableRow key={client.id} hover>
                  <TableCell>
                    {index < 3 ? (
                      <CustomAvatar color={rankColors[index]} skin='light' variant='rounded' size={28}>
                        <i className={classnames('tabler-trophy', 'text-[16px]')} />
                      </CustomAvatar>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        {index + 1}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <Typography variant='body2' className='font-medium'>
                        {client.sigle || client.nom}
                      </Typography>
                      {client.lieu && (
                        <Typography variant='caption' color='text.secondary'>
                          {client.lieu}
                        </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    <Chip label={client.proformaCount} size='small' variant='tonal' color='primary' />
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2' className='font-medium'>
                      {UtilsMetod.formatDevise(client.totalHT)} FCFA
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <Typography variant='body2' color='text.secondary'>
                      Aucun client trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ClientRankingTable
