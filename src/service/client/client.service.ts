
import instance from "@/service/axios-manager/instance";
import {ParamRequests} from "@/types/soosmart/pagination/paramrequestion.type";
import {CustomresponseType} from "@/types/soosmart/customresponse.type";
import {ClientSave, ClientType} from "@/types/soosmart/client.type";

const api = "client";

export class ClientService {
  static CLIENT_KEY = "client";

  static async getClients(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ClientType>>(api, {
        params: params,
      })
    ).data;
  }
  static async getClientsByNom(params?: ParamRequests) {
    return (
      await instance.get<ClientType[]>(`${api}/search`, {
        params: params,
      })
    ).data;
  }

  static async saveClient(client: ClientSave) {
    return (await instance.post<ClientType>(api, client)).data;
  }

  static async updateClient(id: string, client: ClientSave) {
    return (await instance.put<ClientType>(api + "/" + id, client)).data;
  }

  static async deleteClient(id: string) {
    return (await instance.delete<void>(api + "/" + id)).data;
  }

  static async changePotentiel(id: string) {
    return (await instance.get<Boolean>(api + "/" + id)).data;
  }
}
