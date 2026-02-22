import * as v from 'valibot'

import type { Article_Quantite } from './Article_Quantite'
import { schemaArticleQuantiteListV2, schemaArticleQuantiteslist } from './Article_Quantite'
import type { ClientType } from '@/types/soosmart/client.type'
import type { ProjetType } from '@/types/soosmart/projet.type'
import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ThemeColor } from '@core/types'

export enum StatusProforma {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export const listStatusProforma = Object.values(StatusProforma)

export const LabelStatusProforma: Record<StatusProforma, string> = {
  [StatusProforma.PENDING]: 'En attente',
  [StatusProforma.ACCEPTED]: 'Accepté',
  [StatusProforma.REJECTED]: 'Rejeté'
}

export const ColorStatusProforma: Record<StatusProforma, ThemeColor> = {
  [StatusProforma.PENDING]: 'warning',
  [StatusProforma.ACCEPTED]: 'success',
  [StatusProforma.REJECTED]: 'error'
}

export type ProformaQuery = {
  end?: Date | null
  start?: Date | null
  adopted?: boolean
  client_id?: string
  projet_id?: string
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
  status: StatusProforma
  client: ClientType | null
  projet: ProjetType | null
} & BaseType

export const schemaProforma = v.pipe(
  v.object({
    projet_id: v.optional(v.nullable(v.string())),
    client_id: v.optional(v.nullable(v.string())),
    reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
    articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteslist), v.minLength(1))
  }),
  v.check(input => !!input.client_id || !!input.projet_id, 'Veuillez sélectionner un client ou un projet')
)

export const schemaProformaV2 = v.pipe(
  v.object({
    projet_id: v.optional(v.nullable(v.string())),
    client_id: v.optional(v.nullable(v.string())),
    reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
    articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteListV2), v.minLength(1))
  }),
  v.check(input => !!input.client_id || !!input.projet_id, 'Veuillez sélectionner un client ou un projet')
)

/** Schema pour le mode édition — client/projet non requis */
export const schemaProformaV2Edit = v.object({
  projet_id: v.optional(v.nullable(v.string())),
  client_id: v.optional(v.nullable(v.string())),
  reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
  articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteListV2), v.minLength(1))
})

export type ProformaSave = v.InferInput<typeof schemaProforma>
export type ProformaSaveV2 = v.InferInput<typeof schemaProformaV2>
