import axios from 'axios';
import {
  InterceptorAxios,
  InterceptorErrorHandler,
  InterceptorRemoveParamsNull,
} from '@/service/axios-manager/interceptor';

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

InterceptorAxios(AxiosInstance);
InterceptorRemoveParamsNull(AxiosInstance);
InterceptorErrorHandler(AxiosInstance);

export default AxiosInstance;
