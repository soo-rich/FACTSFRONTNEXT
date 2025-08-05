import instance from '@/service/axios-manager/instance'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { ClientSave, ClientType } from '@/types/soosmart/client.type'

const api = 'client'

export class ClientService {
  static CLIENT_KEY = 'client'

  static async getClients(params?: ParamRequests) {
    return (
      await instance.get<CustomresponseType<ClientType>>(api, {
        params: params
      })
    ).data
  }

  static async getClientsByNom(search?: string) {
    return (
      await instance.get<ClientType[]>(`${api}/search`, {
        params: {
          search: search ?? ''
        }
      })
    ).data
  }

  static async saveClient(client: ClientSave) {
    return (await instance.post<ClientType>(api, client)).data
  }

  static async updateClient(id: string, client: ClientSave) {
    return (await instance.put<ClientType>(api + '/' + id, client)).data
  }

  static async deleteClient(id: string) {
    return (await instance.delete<void>(api + '/' + id)).data
  }

  static async changePotentiel(id: string) {
    return (await instance.get<boolean>(api + '/' + id)).data
  }
}
