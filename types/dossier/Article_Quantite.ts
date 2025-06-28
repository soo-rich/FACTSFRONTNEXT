import { z } from "zod";

export type Article_Quantite = {
  id: string;
  article: string;
  quantite: number;
  prix_article: number;
};

export const schemaArticleQuantiteslist = z.object({
  article_id: z.string(),
  quantite: z.number().negative("le prix ne peut etre neagatif"),
  prix_article: z.number().negative("le prix ne peut etre neagatif"),
});

export type Article_QuantiteSave = z.infer<typeof schemaArticleQuantiteslist>;
