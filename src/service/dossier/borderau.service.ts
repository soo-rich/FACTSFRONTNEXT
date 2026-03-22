import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { BorderauOneType, BorderauType } from '@/types/soosmart/dossier/borderau.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { OneQueryDocs } from '@/types/soosmart/dossier/DocumentDTO'

const url = `bordereau`

export class BorderauService {
  static BORDERAU_KEY = 'bordereau'

  static async PostData(id_proforma: string) {
    return (await instance.post<BorderauType>(`${url}`, { proforma_id: id_proforma })).data
  }

  static async getAll(params?: ParamRequests & { adopted?: boolean }) {
    return (
      await instance.get<CustomresponseType<BorderauType>>(`${url}`, {
        params: params
      })
    ).data
  }

  static async getOne(query: OneQueryDocs) {
    return (await instance.get<BorderauOneType>(`${url}/one`, { params: { ...query } })).data
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete(`${url}/${id}`)).data
  }
}
