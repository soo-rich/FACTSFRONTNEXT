import { ParamRequests } from '@/types/pagination/paramrequestion.type';
import AxiosInstance from '@/service/axios-manager/axios-instance';
import type { ClientSave, ClientType } from '@/types/client.type';
import type { CustomresponseType } from '@/types/customresponse.type';

const api = 'client';

export class ClientService {
  static CLIENT_KEY = 'client';

  async getClients(params?: ParamRequests) {
    return (await AxiosInstance.get<CustomresponseType<ClientType>>(api, { params: params })).data;
  }

  async saveClient(client: ClientSave) {
    return (await AxiosInstance.post<ClientType>(api, client)).data;
  }

  async updateClient(id: string, client: ClientSave) {
    return (await AxiosInstance.put<ClientType>(api + '/' + id, client)).data;
  }

  async deleteClient(id: string) {
    return (await AxiosInstance.delete<void>(api + '/' + id)).data;
  }

  async changePotentiel(id: string) {
    return (await AxiosInstance.get<Boolean>(api + '/' + id)).data;
  }
}
