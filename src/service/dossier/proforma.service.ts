import type { ProformaQuery, ProformaSave, ProformaSaveV2, ProformaType } from '@/types/soosmart/dossier/proforma.type'
import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'

const url = `proforma`

export class ProformaService {
  static PROFORMA_KEY = 'proforma'

  static async PostData(data: ProformaSave) {
    return (await instance.post<ProformaType>(url, data)).data
  }

  static async PostDataWithArticle(data: ProformaSaveV2) {
    return (await instance.post<ProformaType>(`${url}/with-article`, data)).data
  }

  static async getAll(params?: ParamRequests & ProformaQuery) {
    return (
      await instance.get<CustomresponseType<ProformaType>>(url, {
        params: params
      })
    ).data
  }

  static  async getById(id: string) {
    return (await instance.get<ProformaType>(url + `/${id}`)).data
  }

  static async AdoptProforma(id: string) {
    return (await instance.patch(url + `/adopted/${id}`)).data
  }

  static async Updatedata(id: string, article_quantite: ProformaSaveV2) {
    return (await instance.put<ProformaType>(url + `/${id}`, article_quantite)).data
  }

  static async DeleteDAta(numero: string) {
    return (await instance.delete(url + `/${numero}`)).data
  }

  async updatereference(id: string, newreference: string) {
    return (await instance.get(url + `/reference/${id}?ref=${newreference}`)).data
  }
}
