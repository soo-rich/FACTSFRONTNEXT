import * as v from 'valibot'

import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'
import type { FileObject } from '@/types/soosmart/file.object.type'
import type { BorderauType } from '@/types/soosmart/dossier/borderau.type'

// La liste des bons de commande ne renvoie que l'entête de la proforma / du bordereau
export type PurchaseOrderProforma = Omit<ProformaType, 'articleQuantites' | 'client' | 'projet' | 'bordereau'> & {
  bon_commande?: boolean
}

export type PurchaseOrderBordereau = Omit<BorderauType, 'proforma' | 'invoice'> & {
  bon_commande?: boolean
}

export type PurchaseOrderType = {
  isdeleted: boolean
  label: string
  uniqueIdDossier: string
  uploadBy?: string | null

  // `file` est nullable : un bon de commande peut exister sans pièce jointe
  file?: FileObject | null
  proforma?: PurchaseOrderProforma | null
  bordereau?: PurchaseOrderBordereau | null
} & BaseType

export const schemaPurchaseOrder = v.object({
  file: v.instance(File),
  filename: v.string(),
  bordereau_id: v.optional(v.pipe(v.string(), v.uuid())),
  proforma_id: v.optional(v.pipe(v.string(), v.uuid()))
})

export type PurchaseOrderSave = v.InferInput<typeof schemaPurchaseOrder>
