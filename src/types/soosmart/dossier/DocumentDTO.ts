import type { ClientType } from '@/types/soosmart/client.type'

export type DocumentDTO = {
  createdat: Date
  numero: string
  uniqueIdDossier: string
  reference: string
  total_ht: number
  total_ttc: number
  total_tva: number
  total_letters: string
  role: string
  signedBy: string
  articleQuantites: ArticleQuantite[]
  client: ClientType
  paied: boolean
}

export interface ArticleQuantite {
  article: string
  description: string
  isdeleted: boolean
  quantite: number
  prix_article: number
}

export interface Client {
  nom: string
  sigle: string
  lieu: string
  telephone: string
}


export enum DocumentTypes {
  PROFORMA = 'PROFORMA',
  BORDERAU = 'BORDERAU',
  FACTURE = 'FACTURE'
}


export type OneQueryDocs = {
  id?: string
  numero?: string
}
