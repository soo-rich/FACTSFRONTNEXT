import instance from "@/service/axios-manager/instance";
import {DocumentDTO} from "@/types/soosmart/dossier/DocumentDTO";

const url = "document";

export class DocumentService {
  static REPORT_KEY = url;

  static async genereateReport(numero: string) {
    return (
      await instance.get(`${url}/${numero}`, { responseType: "arraybuffer" })
    ).data;
  }

  static async signDocument(numero: string, signedBy:string) {
    return (
      await  instance.patch<boolean>(`${url}/signe/${numero}`, null, {
        params:{
          signedBy: signedBy
        }
      })
    ).data
  }

  static async getDocumentDate(numero:string){
    return (
      await instance.get<DocumentDTO>(`${url}/data/${numero}`)
    ).data
  }
}
