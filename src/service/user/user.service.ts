import instance from '@/service/axios-manager/instance'
import type { UtilisateurDto, UtilisateurUpdate, UtilsateurRegister } from '@/types/soosmart/utilisateur.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'

const url = `user`

export class UserService {
  static USER_KEY = 'user'

  static async getAllorOnebyEmail({
                                    email,
                                    params
                                  }: {
    email?: string;
    params?: ParamRequests;
  }) {
    return (
      await instance.get<CustomresponseType<UtilisateurDto>>(
        url + (email ? `/${email}` : ''),
        { params: params }
      )
    ).data
  }

  static async create(user: UtilsateurRegister) {
    return (await instance.post<UtilisateurDto>(url, user)).data
  }

  static async useConnect() {
    return (await instance.get<UtilisateurDto>(url+'/me')).data
  }

  static async update({ id, user }: { id: string, user: UtilisateurUpdate }) {
    return (await instance.put<UtilisateurDto>(url + `/${id}`, user)).data
  }

  static async delete(id: string) {
    return (await instance.delete<null>(url + `/${id}`)).data
  }

  static async activateorDesactivate(id: string) {
    return (await instance.get<boolean>(url + `/${id}/activate`)).data
  }

  static async changepassword(value: {
    oldPassword: string;
    newPassword: string;
  }) {
    return (await instance.post<boolean>(url + `/change-password`, value)).data
  }
}
