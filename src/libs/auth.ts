// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

import { AuthService } from '@/service/auth/auth-service'
import { JwtUtils } from '@/service/jwt/JwtUtils'

/**
 * Appelle l'endpoint de refresh pour obtenir un nouveau couple accessToken / refreshToken.
 * En cas d'échec, retourne le token avec une erreur "RefreshAccessTokenError"
 * afin de forcer la déconnexion côté client.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refresh) {
      throw new Error('No refresh token available')
    }

    const res = await AuthService.refreshToken(token.refresh)

    if (!res.access_token || !res.refresh_token) {
      throw new Error('Invalid refresh response')
    }

    const userInfo = JwtUtils.decode(res.access_token)

    return {
      ...token,
      bearer: res.access_token,
      refresh: res.refresh_token,
      accessTokenExpires: Date.now() + res.expires_in * 1000,
      name: userInfo?.nom + ' ' + userInfo?.prenom || token.name,
      email: userInfo?.email ?? token.email,
      numero: userInfo?.numero,
      role: userInfo?.role,
      image: userInfo?.image,
      error: undefined
    }
  } catch (error) {
    console.error('RefreshAccessTokenError', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        hostname: { label: 'Hostname', type: 'text' }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null

          const res = await AuthService.login(
            {
              username: credentials.username,
              password: credentials.password
            },
          )

          if (res.access_token && res.refresh_token) {
            const userInfo = JwtUtils.decode(res.access_token)

            return {
              id: userInfo?.sub,
              email: userInfo?.email,
              name: userInfo?.nom + ' ' + userInfo?.prenom || 'Utilisateur',
              numero: userInfo?.numero,
              role: userInfo?.role,
              image: userInfo?.image,
              bearer: res.access_token,
              refresh: res.refresh_token,
              expires_in: res.expires_in
            }
          }

          return null
        } catch (e: any) {
          console.log(e.response)
          throw new Error(e.message)
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',

    // Durée max de la session (24h) — le refresh token maintiendra la session active
    maxAge: 24 * 60 * 60
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    /**
     * Callback JWT — appelé à chaque accès au token.
     * Stratégie de rotation :
     * 1. À la première connexion (user existe) : on stocke les infos + la date d'expiration.
     * 2. Si le token n'est pas encore expiré : on le retourne tel quel.
     * 3. S'il est expiré : on appelle refreshAccessToken pour le renouveler.
     */
    async jwt({ token, user }) {
      // Première connexion : l'objet user est fourni par authorize()
      if (user) {
        return {
          ...token,
          bearer: user.bearer,
          refresh: user.refresh,
          numero: user.numero,
          role: user.role,
          image: user.image,
          accessTokenExpires: Date.now() + (user.expires_in ?? 3600) * 1000
        }
      }

      // Token toujours valide — on le retourne directement
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Token expiré — on tente un refresh
      return await refreshAccessToken(token)
    },

    /**
     * Callback session — expose les données du JWT au client.
     * Si une erreur de refresh est présente, elle est propagée pour forcer la déconnexion.
     */
    async session({ session, token }) {
      session.bearer = token.bearer
      session.refresh = token.refresh
      session.error = token.error

      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.numero = token.numero
        session.user.image = token.image as string | undefined
      }

      return session
    }
  }
}
