import { CustomresponseType } from "@/types/customresponse.type";
import { ProjetType, SaveProjet, UpdateProjet } from "@/types/projet.type";
import instance from "@/service/axios-manager/instance";
import { ParamRequests } from "@/types/pagination/paramrequestion.type";

const url = `projet`;

export class ProjetService {
  static PROJT_KEY = "projet";

  async saveProjet(data: SaveProjet) {
    return (await instance.post<ProjetType>(url, data)).data;
  }

  async getAllProjet(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProjetType>>(url, {
        params: params,
      })
    ).data;
  }

  async updateProjet(data: UpdateProjet, id: string) {
    return (await instance.put<ProjetType>(url + `/${id}`, data)).data;
  }

  async deleteProjet(id: string) {
    return (await instance.delete<ProjetType>(url + `/${id}`)).data;
  }

  async changeOffre(id: string) {
    return (await instance.get<boolean>(url + `/${id}`)).data;
  }
}
