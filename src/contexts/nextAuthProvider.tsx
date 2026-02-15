'use client'

// Third-party Imports
import { useEffect } from 'react'

import { signOut, SessionProvider, useSession } from 'next-auth/react'
import type { SessionProviderProps } from 'next-auth/react'

/**
 * Composant interne qui surveille la session.
 * Si le serveur retourne une erreur de refresh (RefreshAccessTokenError),
 * on force la déconnexion.
 */
function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // Le refresh token est invalide / expiré — on déconnecte l'utilisateur
      signOut({ callbackUrl: '/login' })
    }
  }, [session?.error])

  return <>{children}</>
}

export const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  return (
    <SessionProvider
      {...rest}

      // Re-vérifier la session toutes les 5 minutes pour que le callback jwt
      // puisse détecter l'expiration et rafraîchir le token automatiquement
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  )
}
