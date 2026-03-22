import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import instance from '@/service/axios-manager/instance'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { PurchaseOrderSave, PurchaseOrderType } from '@/types/soosmart/dossier/purchaseOrder.type'
import type { OneQueryDocs } from '@/types/soosmart/dossier/DocumentDTO'

const url = `purchase-order`

export class PurchaseOrderService {
  static PURCHASE_ORDER_KEY = 'purchaseOrder'

  static queryKey = {
    all: (query?: ParamRequests) => [PurchaseOrderService.PURCHASE_ORDER_KEY, 'all', query],
    one: (query: OneQueryDocs) => [PurchaseOrderService.PURCHASE_ORDER_KEY, 'one', query]
  }

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
    bc.proforma_id ? formData.append('proforma_id', bc.proforma_id) : null
    bc.bordereau_id ? formData.append('bordereau_id', bc.bordereau_id) : null
    formData.append('filename', bc.filename)

    return (await instance.post<PurchaseOrderType>(`${url}`, formData)).data
  }

  static async DeleteDAta(id: string) {
    return (await instance.delete(`${url}/${id}`)).data
  }
}
