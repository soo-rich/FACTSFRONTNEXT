import { CustomresponseType } from "@/types/customresponse.type";
import { ProjetType, SaveProjet, UpdateProjet } from "@/types/projet.type";
import instance from "@/service/axios-manager/instance";
import { ParamRequests } from "@/types/pagination/paramrequestion.type";

const url = `projet`;

export class ProjetService {
  static PROJT_KEY = "projet";

  static async saveProjet(data: SaveProjet) {
    return (await instance.post<ProjetType>(url, data)).data;
  }

  static async getAllProjet(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProjetType>>(url, {
        params: params,
      })
    ).data;
  }

  static async updateProjet(data: UpdateProjet, id: string) {
    return (await instance.put<ProjetType>(url + `/${id}`, data)).data;
  }

  static async deleteProjet(id: string) {
    return (await instance.delete<ProjetType>(url + `/${id}`)).data;
  }

  static async changeOffre(id: string) {
    return (await instance.get<boolean>(url + `/${id}`)).data;
  }
}
