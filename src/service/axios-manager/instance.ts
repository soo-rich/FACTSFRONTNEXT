import axios from 'axios'

import {
  InterceptorAxios,
  InterceptorErrorHandler,
  InterceptorRemoveParamsNull
} from '@/service/axios-manager/interceptor'

const locationHostname = typeof window !== 'undefined' ? window.location.hostname : ''

const instance = axios.create({
  baseURL: locationHostname,
  timeout: 10000
})

InterceptorAxios(instance)
InterceptorRemoveParamsNull(instance)
InterceptorErrorHandler(instance)

export default instance
