import { z } from "zod";

export type ArticleType = {
  id: string;
  libelle: string;
  prix_unitaire: number;
};

export const articleSchema = z.object({
  libelle: z.string().min(1, "le libelle est requis"),
  prix_unitaire: z.number(),
});

export type SaveArticleType = z.infer<typeof articleSchema>;
