import { CustomresponseType } from '@/types/customresponse.type';
import { ProjetType, SaveProjet, UpdateProjet } from '@/types/projet.type';
import AxiosInstance from '@/service/axios-manager/axios-instance';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';

const url = `projet`;
export class ProjetService {
  static PROJT_KEY = 'projet';

  async saveProjet(data: SaveProjet) {
    return (await AxiosInstance.post<ProjetType>(url, data)).data;
  }

  async getAllProjet(params?: ParamRequests) {
    return (await AxiosInstance.get<CustomresponseType<ProjetType>>(url, { params: params })).data;
  }

  async updateProjet(data: UpdateProjet, id: string) {
    return (await AxiosInstance.put<ProjetType>(url + `/${id}`, data)).data;
  }

  async deleteProjet(id: string) {
    return (await AxiosInstance.delete<ProjetType>(url + `/${id}`)).data;
  }

  async changeOffre(id: string) {
    return (await AxiosInstance.get<boolean>(url + `/${id}`)).data;
  }
}
