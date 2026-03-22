import * as v from 'valibot'

import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'
import type { FileObject } from '@/types/soosmart/file.object.type'
import type { BorderauType } from '@/types/soosmart/dossier/borderau.type'

export type PurchaseOrderType = {
  isdeleted: boolean
  label: string
  uniqueIdDossier: string
  uploadBy: string
  file: FileObject
  proforma?: ProformaType
  bordereau?: BorderauType
} & BaseType

export const schemaPurchaseOrder = v.object({
  file: v.instance(File),
  filename: v.string(),
  bordereau_id: v.optional(v.pipe(v.string(), v.uuid())),
  proforma_id: v.optional(v.pipe(v.string(), v.uuid()))
})

export type PurchaseOrderSave = v.InferInput<typeof schemaPurchaseOrder>
