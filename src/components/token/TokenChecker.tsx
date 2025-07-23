'use client'

// React Imports

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { jwtDecode } from 'jwt-decode'
import { getSession } from 'next-auth/react'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import RedirectModalToLogin from './RedirectModalToLogin'

const LoadingProgress = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Box sx={{ mt: 2, fontSize: '1.2rem', color: '#555' }}>Vérification en cours...</Box>
    </Box>
  )
}

const ProviderTokenCheker = ({ children }: { children: ReactNode }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    const checkToken = async () => {
      const session = await getSession() as any

      if (session) {
        const token = session?.bearer

        if (token) {
          try {
            const decoded: any = jwtDecode(token)

            // Vérifiez si le token est expiré
            const isValid = decoded.exp * 1000 > Date.now()

            setIsTokenValid(isValid)
          } catch (error) {
            console.error('Error decoding token:', error)
            setIsTokenValid(false)
          }
        } else {
          setIsTokenValid(false)
        }
      } else {
        setIsTokenValid(false)
      }
    }

    checkToken()
  }, [])

  if (isTokenValid === false) {
    return <RedirectModalToLogin show={true} />
  }

  if (isTokenValid === null) {
    // Vous pouvez afficher un loader pendant la vérification
    return <LoadingProgress />
  }

  return <>{children}</>
}

export default ProviderTokenCheker
