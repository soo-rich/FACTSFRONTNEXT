import instance from '@/service/axios-manager/instance'
import type { UtilisateurDto, UtilsateurRegister } from '@/types/soosmart/utilisateur.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'

const url = `user`

export class UserService {
  static USER_KEY = 'user'

  static async getAll(params?: ParamRequests ) {
    return (
      await instance.get<CustomresponseType<UtilisateurDto>>(url, { params: params })
    ).data
  }

  static async create(user: UtilsateurRegister) {
    const formdata = new FormData()

    Object.entries(user).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formdata.append('image', value)
      } else if (value !== undefined) {
        formdata.append(key, value)
      }
    })

    return (await instance.post<UtilisateurDto>(url, formdata)).data
  }

  static async useConnect() {
    return (await instance.get<UtilisateurDto>(url + '/me')).data
  }

  static async update({ id, user }: { id: string; user: UtilsateurRegister }) {
    const formdata = new FormData()

    Object.entries(user).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formdata.append('image', value)
      } else if (value !== undefined) {
        formdata.append(key, value)
      }
    })

    return (await instance.put<UtilisateurDto>(url + `/${id}`, formdata)).data
  }

  static async delete(id: string) {
    return (await instance.delete<null>(url + `/${id}`)).data
  }

  static async activateorDesactivate(id: string) {
    return (await instance.get<UtilisateurDto>(url + `/${id}/activate`)).data
  }

  static async changepassword(value: { oldPassword: string; newPassword: string }) {
    return (await instance.post<boolean>(url + `/change-password`, value)).data
  }

  static async forgotUserPassword(email: string) {
    return (await instance.get<boolean>(url + `/forget-password`, { params: { email } })).data
  }
}
