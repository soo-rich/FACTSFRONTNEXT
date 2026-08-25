import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { BorderauOneType, BorderauType } from '@/types/soosmart/dossier/borderau.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { OneQueryDocs } from '@/types/soosmart/dossier/DocumentDTO'
import { toApiPagination } from '@/utils/pagination'

const url = `bordereau`

type BorderauQuery = ParamRequests & {
  adopted?: boolean

  /** Omis : aucun filtre. `false` ne retient que les bordereaux sans bon de commande. */
  bon_commande?: boolean
}

export class BorderauService {
  static BORDERAU_KEY = 'bordereau'

  static queryKey = {
    all: (query?: BorderauQuery) => [BorderauService.BORDERAU_KEY, 'all', query],
    one: (query: OneQueryDocs) => [BorderauService.BORDERAU_KEY, 'one', query]
  }

  static async PostData(id_proforma: string) {
    return (await instance.post<BorderauType>(`${url}`, { proforma_id: id_proforma })).data
  }

  static async getAll(params?: BorderauQuery) {
    return (
      await instance.get<CustomresponseType<BorderauType>>(`${url}`, {
        params: toApiPagination(params)
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
