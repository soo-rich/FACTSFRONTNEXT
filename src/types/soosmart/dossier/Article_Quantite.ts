import * as v from 'valibot';

export type Article_Quantite = {
  id: string;
  article: string;
  quantite: number;
  prix_article: number;
};



export const schemaArticleQuantiteslist = v.object({
  article_id: v.string(),
  quantite: v.pipe(v.number(), v.minValue(0, "la quantité ne peut être négative")),
  prix_article: v.pipe(v.number(), v.minValue(0, "le prix ne peut être négatif")),
});

export type Article_QuantiteSave = v.InferInput<typeof schemaArticleQuantiteslist>;
