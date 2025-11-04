import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type {PurchaseOrderSave, PurchaseOrderType} from '@/types/soosmart/dossier/purchaseOrder.type'


const url = `purchase-order`

export class PurchaseOrderService {
  static PURCHASE_ORDER_KEY = 'purchaseOrder'


  static async getAll(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<PurchaseOrderType>>(`${url}`, {
        params: params
      })
    ).data
  }

  static async PostData(bc: PurchaseOrderSave) {
    const formData = new FormData()

    formData.append('bc', bc.file)
    formData.append('proforma', bc.numeroProforma)
    formData.append('filename', bc.filename)

    return (await instance.post<PurchaseOrderType>(`${url}`, formData)).data
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete(`${url}/${id}`)).data
  }

}
