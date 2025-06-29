import axios from 'axios';

import {
  InterceptorAxios,
  InterceptorErrorHandler,
  InterceptorRemoveParamsNull,
} from '@/service/axios-manager/interceptor';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

InterceptorAxios(instance);
InterceptorRemoveParamsNull(instance);
InterceptorErrorHandler(instance);

export default instance;
