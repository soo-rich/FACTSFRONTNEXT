import instance from "@/service/axios-manager/instance";
import { CustomresponseType } from "@/types/customresponse.type";
import { ParamRequests } from "@/types/pagination/paramrequestion.type";
import { UtilisateurDto, UtilisateurUpdate, UtilsateurRegister } from '@/types/utilisateur.type';

const url = `user`;

export class UserService {
  static USER_KEY = "user";

  static async getAllorOnebyEmail({
    email,
    params,
  }: {
    email?: string;
    params?: ParamRequests;
  }) {
    return (
      await instance.get<CustomresponseType<UtilisateurDto>>(
        url + (email ? `/${email}` : ""),
        { params: params },
      )
    ).data;
  }

  static async create(user: UtilsateurRegister) {
    return (await instance.post<UtilisateurDto>(url, user)).data;
  }

  static async update({id, user}:{ id: string, user: UtilisateurUpdate }) {
    return (await instance.put<UtilisateurDto>(url + `/${id}`, user)).data;
  }

  static async delete(id: string) {
    return (await instance.delete<null>(url + `/${id}`)).data;
  }

  static async activateorDesactivate(id: string) {
    return (await instance.get<boolean>(url + `/${id}/activate`)).data;
  }

  static async changepassword(value: {
    oldPassword: string;
    newPassword: string;
  }) {
    return (await instance.post<boolean>(url + `/change-password`, value)).data;
  }
}
