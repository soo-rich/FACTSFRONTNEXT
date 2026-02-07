import axios from 'axios'

import {
  InterceptorAxios,
  InterceptorErrorHandler,
  InterceptorRemoveParamsNull
} from '@/service/axios-manager/interceptor'

const locationHostname = typeof window !== 'undefined' ? window.location.hostname : ''

const instance = axios.create({
  baseURL: `http://${locationHostname}:4000/api/`,
  timeout: 10000
})

InterceptorAxios(instance)
InterceptorRemoveParamsNull(instance)
InterceptorErrorHandler(instance)

export default instance
