import type { InferInput } from 'valibot'
import { minLength, number, object, pipe, string } from 'valibot'

import type { BaseType } from '@/types/soosmart/api-default,type'

export type ArticleType = {
  libelle: string
  description: string
  prix_unitaire: number
  isdeleted: boolean
} & BaseType

export const articleSchema = object({
  libelle: pipe(string(), minLength(1, 'le libelle est requis')),
  description: string(),
  prix_unitaire: number()
})
export type SaveArticleType = InferInput<typeof articleSchema>
