import { Article_QuantiteSave } from '@/types/dossier/Article_Quantite';
import { ProformaSave, ProformaType } from '@/types/dossier/proforma.type';
import AxiosInstance from '@/service/axios-manager/axios-instance';
import { CustomresponseType } from '@/types/customresponse.type';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';

const url = `proforma`;
export class ProformaService {
  static PROFORMA_KEY = 'proforma';

  async PostData(data: ProformaSave) {
    return (await AxiosInstance.post<ProformaType>(url, data)).data;
  }
  async getAll(params?: ParamRequests) {
    return (await AxiosInstance.get<CustomresponseType<ProformaType>>(url, { params: params }))
      .data;
  }

  async getAllNumeroList() {
    return (await AxiosInstance.get<string[]>(url + '/numero')).data;
  }
  async getAllnotAdopted(params?: ParamRequests) {
    return (
      await AxiosInstance.get<CustomresponseType<ProformaType>>(url + '/not-adoped', {
        params: params,
      })
    ).data;
  }

  async getbyNumero(numero: string) {
    return (await AxiosInstance.get<ProformaType>(url + `/${numero}`)).data;
  }

  async updatereference(id: string, newreference: string) {
    return (await AxiosInstance.get<void>(url + `/reference/${id}?ref=${newreference}`)).data;
  }

  async Updatedata(id: string, article_quantite: Article_QuantiteSave[]) {
    return (await AxiosInstance.put<ProformaType>(url + `/${id}`, article_quantite)).data;
  }
  async DeleteDAta(numero: string) {
    return (await AxiosInstance.delete<any>(url + `/${numero}`)).data;
  }
}
