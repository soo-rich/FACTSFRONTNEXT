import AxiosInstance from '@/service/axios-manager/axios-instance';
import { CustomresponseType } from '@/types/customresponse.type';
import { ParamRequests } from '@/types/pagination/paramrequestion.type';
import { UtilisateurDto } from '@/types/utilisateur.type';

const url = `user`;
export class UserService {
  static USER_KEY = 'user';

  static async getAllorOnebyEmail({ email, params }: { email?: string; params?: ParamRequests }) {
    return (
      await AxiosInstance.get<CustomresponseType<UtilisateurDto>>(
        url + (email ? `/${email}` : ''),
        { params: params }
      )
    ).data;
  }

  static async create(user: UtilisateurDto) {
    return (await AxiosInstance.post<UtilisateurDto>(url, user)).data;
  }

  static async update(id: string, user: UtilisateurDto) {
    return (await AxiosInstance.put<UtilisateurDto>(url + `/${id}`, user)).data;
  }

  static async delete(id: string) {
    return (await AxiosInstance.delete<null>(url + `/${id}`)).data;
  }

  static async activateorDesactivate(id: string) {
    return (await AxiosInstance.get<boolean>(url + `/${id}/activate`)).data;
  }

  static async changepassword(value: { oldPassword: string; newPassword: string }) {
    return (await AxiosInstance.post<boolean>(url + `/change-password`, value)).data;
  }
}
