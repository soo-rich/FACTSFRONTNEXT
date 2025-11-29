import * as v from 'valibot'

import { articleSchema } from '@/types/soosmart/article.type'

export type Article_Quantite = {
  id: string;
  article: string;
  description: string;
  quantite: number;
  prix_article: number;
};


export const schemaArticleQuantiteslist = v.object({
  article_id: v.string(),
  quantite: v.pipe(v.number(), v.minValue(0, 'la quantité ne peut être négative')),
  prix_article: v.pipe(v.number(), v.minValue(0, 'le prix ne peut être négatif'))
})

export const schemaArticleQuantiteListV2 = v.object({
  ...articleSchema.entries,
  quantite: v.number()
})

export type Article_QuantiteListV2 = v.InferInput<typeof schemaArticleQuantiteListV2>;

export type Article_QuantiteSave = v.InferInput<typeof schemaArticleQuantiteslist>;
