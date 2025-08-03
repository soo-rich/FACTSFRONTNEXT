import {ProformaType} from "@/types/soosmart/dossier/proforma.type";
import { ClientType } from "../client.type";

export type DocumentDTO = {
  client: ClientType,
  total_letters:string,
} & Omit<ProformaType, 'client' | 'adopted'>


export enum DocumentTypes {
  PROFORMA = 'PROFORMA',
  BORDERAU = 'BORDERAU',
  FACTURE = 'FACTURE'
}
