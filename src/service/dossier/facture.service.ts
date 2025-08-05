import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { FactureType } from '@/types/soosmart/dossier/facture.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import instance from '../axios-manager/instance'

const url = `facture`

export class FactureService {
  static FACTURE_KEY = 'facture'

  static async PostData(id_borderau: any) {
    return (await instance.post<FactureType>(`${url}/${id_borderau}`, {})).data
  }

  static async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<FactureType>>(url, {
        params: params
      })
    ).data
  }

  static async paid(id: string) {
    return (
      await instance.get<boolean>(url + `/paid/${id}`)
    ).data
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete<void>(`${url}/${id}`)).data
  }
}
