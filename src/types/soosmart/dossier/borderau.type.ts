import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'
import type { FactureListType } from '@/types/soosmart/dossier/facture.type'

export type BorderauType = {
  isdeleted: boolean
  numero: string
  uniqueIdDossier: string
  proforma: Omit<ProformaType, 'articleQuantites'>
  __invoice__: FactureListType
} & BaseType

export type BorderauOneType =
  {
    isdeleted: boolean
    numero: string
    uniqueIdDossier: string
    proforma: ProformaType
  } & BaseType
