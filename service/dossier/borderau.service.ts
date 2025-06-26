import AxiosInstance from '@/service/axios-manager/axios-instance';
import { CustomresponseType } from '@/types/customresponse.type';
import { BorderauType } from '@/types/dossier/borderau.type';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';

const url = `borderau`;

export class BorderauService {
  static BORDERAU_KEY = 'borderau';

  async PostData(id_proforma: string) {
    return (await AxiosInstance.post<BorderauType>(`${url}/${id_proforma}`, {})).data;
  }
  async getAll(params?: ParamRequests) {
    return (await AxiosInstance.get<CustomresponseType<BorderauType>>(`${url}`, { params: params }))
      .data;
  }
  async getAllWhoNoUseTocreateFacture(params?: ParamRequests) {
    return (
      await AxiosInstance.get<CustomresponseType<BorderauType>>(`${url}/not-use`, {
        params: params,
      })
    ).data;
  }
  async Updatedata(id: string, data: any) {
    throw new Error('Method not implemented.');
  }
  async DeleteDAta(id: string) {
    return (await AxiosInstance.delete(`${url}/${id}`)).data;
  }
}
