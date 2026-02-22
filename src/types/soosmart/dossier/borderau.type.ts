import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'

export type BorderauType =
  {
    isdeleted: boolean
    numero: string
    uniqueIdDossier: string
    proforma: Omit<ProformaType, 'articleQuantites'>
  } & BaseType

export type BorderauOneType =
  {
    isdeleted: boolean
    numero: string
    uniqueIdDossier: string
    proforma: ProformaType
  } & BaseType
