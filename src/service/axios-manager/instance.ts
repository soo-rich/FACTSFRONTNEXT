import axios from 'axios'

import {
  InterceptorAxios,
  InterceptorErrorHandler,
  InterceptorRemoveParamsNull
} from '@/service/axios-manager/interceptor'
import { getPublicEnv } from '@/libs/runtimeEnv'

const instance = axios.create({
  timeout: 10000
})

// baseURL résolue à chaque requête (et non à la création) : la valeur provient
// de l'environnement d'exécution, jamais du build.
instance.interceptors.request.use(config => {
  config.baseURL = getPublicEnv().apiUrl

  return config
})

InterceptorAxios(instance)
InterceptorRemoveParamsNull(instance)
InterceptorErrorHandler(instance)

export default instance
