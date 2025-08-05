import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { BorderauType } from '@/types/soosmart/dossier/borderau.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'

const url = `borderau`

export class BorderauService {
  static BORDERAU_KEY = 'borderau'

  static async PostData(id_proforma: string) {
    return (await instance.post<BorderauType>(`${url}/${id_proforma}`, {})).data
  }

  static async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<BorderauType>>(`${url}`, {
        params: params
      })
    ).data
  }

  static async getAllWhoNoUseTocreateFacture(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<BorderauType>>(`${url}/not-use`, {
        params: params
      })
    ).data
  }

  static async Updatedata(id: string, data: any) {
    throw new Error('Method not implemented.')
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete(`${url}/${id}`)).data
  }
}
