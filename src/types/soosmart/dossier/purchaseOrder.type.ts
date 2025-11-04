import * as v from 'valibot'

export type PurchaseOrderType = {
  id: string
  numeroProforma: string
  numeroBordereau: string
  file: FileObject
}

export type FileObject = {
  filename: string
  uri: string
  contentType: string
  size: number
  uploadBy: string
  storageProvider: 'minio' | 'local'
  update_at: string
}

export const schemaPurchaseOrder = v.object({
  file: v.instance(File),
  filename: v.string(),
  numeroProforma: v.string(),
})

export type PurchaseOrderSave = v.InferInput<typeof schemaPurchaseOrder>
