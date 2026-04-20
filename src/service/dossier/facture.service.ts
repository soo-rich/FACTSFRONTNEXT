import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { FactureListType, InvoiceState } from '@/types/soosmart/dossier/facture.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import instance from '../axios-manager/instance'
import type { TreeNodeType } from '@/types/soosmart/dossier/TreeNode.type'

const url = `invoice`

export class FactureService {
  static FACTURE_KEY = 'facture'

  static async PostData(id_borderau: any) {
    return (await instance.post(`${url}`, { bordereau_id:id_borderau })).data
  }

  static async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<FactureListType>>(url, {
        params: params
      })
    ).data
  }

  static async paid(id: string, status: InvoiceState) {
    return (await instance.patch<boolean>(url + `/change-state`, {
      numero:id,
      state: status
    })).data
  }

  static async getThree(numero: string) {
    return (await instance.get<TreeNodeType>(`${url}/tree/${numero}`)).data
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete<void>(`${url}/${id}`)).data
  }
}
