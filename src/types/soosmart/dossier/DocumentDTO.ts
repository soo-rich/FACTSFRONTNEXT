import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'
import type { ClientType } from '../client.type'

export type DocumentDTO = {
  client: ClientType,
  total_letters: string,
  paied?: boolean,
} & Omit<ProformaType, 'client' | 'adopted'>


export enum DocumentTypes {
  PROFORMA = 'PROFORMA',
  BORDERAU = 'BORDERAU',
  FACTURE = 'FACTURE'
}
