'use client'
import { useEffect } from 'react'

import { useLocation } from 'react-use'
import { Grid2 } from '@mui/material'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

import { getSession, signOut } from 'next-auth/react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

import type { ComponentDictonaryParamsType } from '@/types/componentTypes'

const PathGenerate = ({ dictionary }: ComponentDictonaryParamsType) => {
  const trad = ['order_slip','purchase_order']

  //hook to get the current path
  const { pathname } = useLocation()

  const table = pathname?.split('/')

  const handlesignOut = async () => {
    const session = (await getSession()) as any

    const decoded: any = jwtDecode(session?.bearer || '')

    // Vérifiez si le token est expiré
    const isValid = decoded.exp * 1000 > Date.now()

    if (!isValid) {
      toast('Le token a expiré, veuillez vous reconnecter.', {
        type: 'error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false
      })

      setTimeout(async () => {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
      }, 5000)
    }
  }

  useEffect(() => {
    handlesignOut().then(r => r)
  }, [pathname])

  return (
    <Grid2 size={12} className={'mbe-4'}>
      <Breadcrumbs>
        {table?.map((item, index) => {
          if (item === '') return null // Skip empty segments
          if (item === 'dashboard') return null


          const folder = item.replace(/-/g, ' ').replace(/_/g, ' ')
          const folderName = folder.charAt(0).toUpperCase() + folder.slice(1)

          if (item === 'fr' || item === 'en' || item === 'dashboard') {
            if (table[2] === 'dashboard') {
              return <Typography key={index}>{dictionary['navigation'].dashboard}</Typography>
            } else {
              return (
                <Typography component={Link} underline={'hover'} color={'primary'} key={index} href={`/`}>
                  {dictionary['navigation'].dashboard}
                </Typography>
              )
            }
          }

          if (index === table.length - 1) {
            if (trad.includes(item)) {
              // @ts-ignore
              return <Typography key={index}>{dictionary['navigation'].case[String(item)]}</Typography>
            }

            if (item==='invoice') {
              // @ts-ignore
              return <Typography key={index}>{dictionary['navigation'][String(item)]}</Typography>
            }


            return <Typography key={index}>{folderName}</Typography>
          }

          return (
            <Typography key={index} component={Link} underline={'hover'} color={'secondary'} href={`/${item}`}>
              {folderName}
            </Typography>
          )
        })}
      </Breadcrumbs>
    </Grid2>
  )
}

export default PathGenerate
