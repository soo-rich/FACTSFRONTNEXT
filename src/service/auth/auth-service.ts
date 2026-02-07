import { minLength, object, pipe, string } from 'valibot'

import instance from '@/service/axios-manager/instance'

export const schemaLogin = object({
  username: pipe(string(), minLength(2, 'entre 2 caracteres au minimum')),
  password: pipe(string(), minLength(6, 'entre 6 caracteres au minimum'))
})

export class AuthService {
  static async login(data: { username: string; password: string }, hostname?: string) {

    console.log('login', hostname)

    return (

      // await instance.post<{ bearer: string; refresh: string }>(
      //   'auth/login',
      //   data
      // )
      await instance.post<{ bearer: string; refresh: string }>(
        'auth/login',
        data,
       {
        baseURL: hostname ? `http://${hostname}:4000/api/` : undefined
       }
      )
    ).data
  }

  static async refreshToken(refreshToken: string) {
    return (
      await instance.post<{ bearer: string; refresh: string }>(
        'auth/refresh-token',
        {
          refresh: refreshToken
        }
      )
    ).data
  }

  static async logout() {
    return (await instance.post('auth/logout', {})).data
  }
}
