import type { AxiosError, AxiosInstance } from 'axios'
import { getSession } from 'next-auth/react'

export const InterceptorAxios = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      const session = await getSession()

      if (session) {
        // ne pas ajouter le token sur les route t'authentication
        if (!config?.url?.includes('auth/login')) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${session?.bearer}`
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

export const InterceptorErrorHandler = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      const { response } = error

      if (response) {
        console.log('response', response.data)

        /*if (response.status === 403) {
                  toast.error('')
                }else if (response.status === 401) {
                  toast.error('<UNK> Mauvais Identifiant <UNK>');
                }*/
      }

      return Promise.reject(error)
    }
  )
}

export const InterceptorRemoveParamsNull = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    if (config.params) {
      config.params = Object.fromEntries(
        Object.entries(config.params).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== null && value !== undefined && value !== ''
        )
      )
    }

    return config
  })
}
