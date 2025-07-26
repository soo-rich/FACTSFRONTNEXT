import {InferInput, object, minLength, string, number, pipe} from "valibot";

export type ArticleType = {
  id: string;
  libelle: string;
  prix_unitaire: number;
};

export const articleSchema = object({
  libelle: pipe(string(),minLength(1, "le libelle est requis")),
  prix_unitaire: number(),
});
export type SaveArticleType = InferInput<typeof articleSchema>;
