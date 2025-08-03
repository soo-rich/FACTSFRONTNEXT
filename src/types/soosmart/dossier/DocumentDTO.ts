import {ProformaType} from "@/types/soosmart/dossier/proforma.type";

export type DocumentDTO = {
  client: ClientTypes
} & Omit<ProformaType, 'client' | 'adopted'>


export enum DocumentTypes {
  PROFORMA = 'PROFORMA',
  BORDERAU = 'BORDERAU',
  FACTURE = 'FACTURE'
}
