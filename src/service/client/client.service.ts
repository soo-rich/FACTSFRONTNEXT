import type { ClientSave, ClientType } from "@/types/client.type";
import type { CustomresponseType } from "@/types/customresponse.type";

import { ParamRequests } from "@/types/pagination/paramrequestion.type";
import instance from "@/service/axios-manager/instance";

const api = "client";

export class ClientService {
  static CLIENT_KEY = "client";

  async getClients(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ClientType>>(api, {
        params: params,
      })
    ).data;
  }

  async saveClient(client: ClientSave) {
    return (await instance.post<ClientType>(api, client)).data;
  }

  async updateClient(id: string, client: ClientSave) {
    return (await instance.put<ClientType>(api + "/" + id, client)).data;
  }

  async deleteClient(id: string) {
    return (await instance.delete<void>(api + "/" + id)).data;
  }

  async changePotentiel(id: string) {
    return (await instance.get<Boolean>(api + "/" + id)).data;
  }
}
