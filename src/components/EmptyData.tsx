import type { ReactNode } from 'react'

import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

const EmptyData = (props: { message?: string; icon?: ReactNode; size?: number }) => {
  const { message, icon, size = 86 } = props

  return (
    <Card>
      <CardContent className=' grid grid-cols-1 text-center min-h-[200px] place-content-center place-items-center p-4 rounded-md'>
        {icon ? icon : <span className='icon-[nonicons--not-found-16] text-center' style={{ fontSize: size }} />}
        <Typography variant='body1'>{message || 'Aucune donnée à afficher'}</Typography>
      </CardContent>
    </Card>
  )
}

export default EmptyData
