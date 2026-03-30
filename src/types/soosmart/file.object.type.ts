import type { BaseType } from '@/types/soosmart/api-default,type'

export type FileObject = {
  isdeleted: boolean
  originalName: string
  storageKey: string
  mimetype: string
  size: number
  uploadBy: string
  provider: 'minio' | 'local'
  bucket: string
} & BaseType
