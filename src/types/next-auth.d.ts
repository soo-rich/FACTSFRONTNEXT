import type { DefaultSession } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    bearer?: string
    refresh?: string
    error?: string
    user?: DefaultSession['user'] & {
      id?: string
      numero?: number
      role?: string
    }
  }

  interface User {
    id?: string
    bearer?: string
    refresh?: string
    expires_in?: number
    numero?: number
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    bearer?: string
    refresh?: string
    numero?: number
    role?: string
    accessTokenExpires?: number
    error?: string
  }
}
