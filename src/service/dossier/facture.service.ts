import instance from '../axios-manager/instance';

import { CustomresponseType } from '@/types/customresponse.type';
import { FactureType } from '@/types/dossier/facture.type';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';

const url = `facture`;

export class FactureService {
  static FACTURE_KEY = 'facture';

  async PostData(id_borderau: any) {
    return (await instance.post<FactureType>(`${url}/${id_borderau}`, {})).data;
  }
  async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<FactureType>>(url, {
        params: params,
      })
    ).data;
  }
  async Updatedata(id: string, data: any) {
    throw new Error('Method not implemented.');
  }

  async DeleteDAta(id: string) {
    return (await instance.delete<void>(`${url}/${id}`)).data;
  }
}
