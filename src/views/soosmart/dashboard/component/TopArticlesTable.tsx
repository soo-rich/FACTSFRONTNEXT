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
import { useQuery } from '@tanstack/react-query'

import { StatAPIService } from '@/service/statistique/stat-api.service'
import UtiliMetod from '@/utils/utilsmethod'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'

const TopArticlesTable = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [StatAPIService.STAT_KEY, 'articles', 'top'],
    queryFn: () => StatAPIService.getTopArticles({ limit: 10 }),
    refetchOnWindowFocus: true
  })

  if (isLoading) return <LoadingWithoutModal />
  if (isError || !data) return <ErrorView />

  return (
    <Card className='h-full'>
      <CardHeader title='Top articles' subheader='Articles les plus vendus' />
      <CardContent className='p-0'>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell align='right'>Quantité</TableCell>
                <TableCell align='right'>Revenu</TableCell>
                <TableCell align='right'>Prix moyen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((article, index) => (
                <TableRow key={article.id} hover>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Typography variant='body2' color='text.secondary' className='min-w-[20px]'>
                        {index + 1}.
                      </Typography>
                      <Typography variant='body2' className='truncate max-w-[200px]'>
                        {article.libelle}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2'>{UtiliMetod.formatDevise(article.totalQuantite)}</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2'>{UtiliMetod.formatDevise(article.totalRevenue)} FCFA</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2'>{UtiliMetod.formatDevise(article.averagePrice)} FCFA</Typography>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <Typography variant='body2' color='text.secondary'>
                      Aucun article trouvé
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

export default TopArticlesTable
