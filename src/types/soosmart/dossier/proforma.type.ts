import * as v from 'valibot'

import type { Article_Quantite } from './Article_Quantite'
import { schemaArticleQuantiteListV2, schemaArticleQuantiteslist } from './Article_Quantite'
import type { ClientType } from '@/types/soosmart/client.type'
import type { ProjetType } from '@/types/soosmart/projet.type'
import type { BaseType } from '@/types/soosmart/api-default,type'


export type ProformaQuery = {
  end?: Date|null
  start?: Date|null
  adopted?: boolean
}

export type ProformaType = {
  isdeleted: boolean
  numero: string
  uniqueIdDossier: string
  reference: string
  total_ht: number
  total_ttc: number
  total_tva: number
  adopted: boolean
  role: string
  signedBy: string
  articleQuantites: Article_Quantite[]
  oldVersion: boolean
  client: ClientType|null
  projet:ProjetType|null
}&BaseType

export const schemaProforma = v.object({
  projet_id: v.nullable(v.string()),
  client_id: v.nullable(v.string()),
  reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
  articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteslist), v.minLength(1))
})

export const schemaProformaV2 = v.object({
  projet_id: v.nullable(v.string()),
  client_id: v.nullable(v.string()),
  reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
  articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteListV2), v.minLength(1))
})

export type ProformaSave = v.InferInput<typeof schemaProforma>
export type ProformaSaveV2 = v.InferInput<typeof schemaProformaV2>
