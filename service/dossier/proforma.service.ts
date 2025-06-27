import { Article_QuantiteSave } from "@/types/dossier/Article_Quantite";
import { ProformaSave, ProformaType } from "@/types/dossier/proforma.type";
import instance from "@/service/axios-manager/instance";
import { CustomresponseType } from "@/types/customresponse.type";
import { ParamRequests } from "@/types/pagination/paramrequestion.type";

const url = `proforma`;

export class ProformaService {
  static PROFORMA_KEY = "proforma";

  async PostData(data: ProformaSave) {
    return (await instance.post<ProformaType>(url, data)).data;
  }
  async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProformaType>>(url, {
        params: params,
      })
    ).data;
  }

  async getAllNumeroList() {
    return (await instance.get<string[]>(url + "/numero")).data;
  }
  async getAllnotAdopted(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProformaType>>(
        url + "/not-adoped",
        {
          params: params,
        },
      )
    ).data;
  }

  async getbyNumero(numero: string) {
    return (await instance.get<ProformaType>(url + `/${numero}`)).data;
  }

  async updatereference(id: string, newreference: string) {
    return (
      await instance.get<void>(url + `/reference/${id}?ref=${newreference}`)
    ).data;
  }

  async Updatedata(id: string, article_quantite: Article_QuantiteSave[]) {
    return (await instance.put<ProformaType>(url + `/${id}`, article_quantite))
      .data;
  }
  async DeleteDAta(numero: string) {
    return (await instance.delete<any>(url + `/${numero}`)).data;
  }
}
