import { CustomresponseType } from '@/types/customresponse.type';
import { FactureType } from '@/types/dossier/facture.type';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';
import AxiosInstance from '../axios-manager/axios-instance';

const url = `facture`;
export class FactureService {
  static FACTURE_KEY = 'facture';

  async PostData(id_borderau: any) {
    return (await AxiosInstance.post<FactureType>(`${url}/${id_borderau}`, {})).data;
  }
  async getAll(params?: ParamRequests) {
    return (await AxiosInstance.get<CustomresponseType<FactureType>>(url, { params: params })).data;
  }
  async Updatedata(id: string, data: any) {
    throw new Error('Method not implemented.');
  }

  async DeleteDAta(id: string) {
    return (await AxiosInstance.delete<void>(`${url}/${id}`)).data;
  }
}
