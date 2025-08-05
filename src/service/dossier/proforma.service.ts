import type { Article_QuantiteSave } from '@/types/soosmart/dossier/Article_Quantite'
import type { ProformaSave, ProformaType } from '@/types/soosmart/dossier/proforma.type'
import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'

const url = `proforma`

export class ProformaService {
  static PROFORMA_KEY = 'proforma'

  static async PostData(data: ProformaSave) {
    return (await instance.post<ProformaType>(url, data)).data
  }

  static async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProformaType>>(url, {
        params: params
      })
    ).data
  }

  static async getAllNumeroList() {
    return (await instance.get<string[]>(url + '/numero')).data
  }

  static async getAllnotAdopted(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ProformaType>>(url + '/not-adoped', {
        params: params
      })
    ).data
  }

  static async getbyNumero(numero: string) {
    return (await instance.get<ProformaType>(url + `/${numero}`)).data
  }

  static async Updatedata(id: string, article_quantite: Article_QuantiteSave[]) {
    return (await instance.put<ProformaType>(url + `/${id}`, article_quantite)).data
  }

  static async DeleteDAta(numero: string) {
    return (await instance.delete<any>(url + `/${numero}`)).data
  }

  async updatereference(id: string, newreference: string) {
    return (await instance.get<void>(url + `/reference/${id}?ref=${newreference}`)).data
  }
}
