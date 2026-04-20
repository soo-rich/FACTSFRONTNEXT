import type { AxiosError, AxiosInstance } from 'axios'
import { getSession } from 'next-auth/react'
import { toast } from 'react-toastify'

export const InterceptorAxios = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async config => {
      const session = await getSession()

      const excludeUrls = ['auth/login', 'auth/refresh-token', 'auth/forget-password']

      if (session) {
        // ne pas ajouter le token sur les route t'authentication
        if (!excludeUrls.some(url => config.url?.includes(url))) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${session?.bearer}`
        }
      }

      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
}

export const InterceptorErrorHandler = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    response => {
      return response
    },
    async (error: AxiosError) => {
      const { response, config } = error

      if (response) {
        if (response.status === 401 && config && !(config as any).__isRetry) {
          // Marquer la requête comme un retry pour éviter les boucles infinies
          ;(config as any).__isRetry = true

          // Récupérer la session mise à jour (le callback jwt aura fait le refresh)
          const session = await getSession()

          if (session?.bearer && !session?.error) {
            config.headers.Authorization = `Bearer ${session.bearer}`

            // Re-exécuter la requête avec le nouveau token
            return instance(config)
          }

          // Si le refresh a échoué, on redirige vers le login
          toast.error('Session expirée, veuillez vous reconnecter')
        } else if (response.status === 403) {
          toast.error(`${(response as any)?.data.message ?? ''} \n Veuillez vous reconnecter`)
        }
      }

      return Promise.reject(error)
    }
  )
}

export const InterceptorRemoveParamsNull = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
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
