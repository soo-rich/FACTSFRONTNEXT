import { minLength, object, pipe, string } from 'valibot'
import axios from 'axios'

import instance from '@/service/axios-manager/instance'
import { getPublicEnv } from '@/libs/runtimeEnv'

type LoginResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

interface User {
  id: string
  isdeleted: boolean
  email: string
  username: string
  role: string
  isActive: boolean
}

export const schemaLogin = object({
  username: pipe(string(), minLength(2, 'entre 2 caracteres au minimum')),
  password: pipe(string(), minLength(6, 'entre 6 caracteres au minimum'))
})

// Instance créée à l'appel : la baseURL provient de l'environnement d'exécution.
const authApi = () =>
  axios.create({
    baseURL: getPublicEnv().apiUrl,
    timeout: 10000
  })

export class AuthService {
  static async login(data: { username: string; password: string }) {
    return (await authApi().post<LoginResponse>('auth/login', data)).data
  }

  static async refreshToken(refreshToken: string) {
    return (
      await authApi().post<LoginResponse>('auth/refresh-token', {
        refresh_token: refreshToken
      })
    ).data
  }

  static async logout() {
    return (await authApi().post('auth/logout', {})).data
  }

  static async forgotUserPassword(email: string) {
    return (await instance.post(`auth/forget-password`, { email: email })).data
  }
}
