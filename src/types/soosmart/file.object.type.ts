import type { BaseType } from '@/types/soosmart/api-default,type'

export type FileObject = {
  isdeleted: boolean
  originalName: string
  filename: string
  path: string
  uploadBy: string
  mimetype: string
  size: number
  url: string
} & BaseType
