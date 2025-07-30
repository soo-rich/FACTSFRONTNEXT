import instance from "@/service/axios-manager/instance";
import {ProjetType, SaveProjet, UpdateProjet} from "@/types/soosmart/projet.type";
import {ParamRequests} from "@/types/soosmart/pagination/paramrequestion.type";
import {CustomresponseType} from "@/types/soosmart/customresponse.type";


const url = `projet`;

export class ProjetService {
  static PROJT_KEY = "projet";

  static async saveProjet(data: SaveProjet) {
    return (await instance.post<ProjetType>(url, data)).data;
  }

  static async getAllProjet(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProjetType>>(url, {
        params,
      })
    ).data;
  }

  static async searchProjet(search?: string) {
    return (
      await instance.get<ProjetType[]>(url + "/search", {
        params: {
          search: search,
        },
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
