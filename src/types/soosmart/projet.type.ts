import * as v from 'valibot'

export type ProjetType = {
  id: string;
  projet_type: string;
  description: string;
  offre: boolean;
  client: string;
  createdat: Date;
  update_at: Date;
};

export const schemaProjetSave = v.object({
  projet_type: v.pipe(v.string(), v.minLength(5, 'le champ doit contenir au minimum 5 caratere')),
  description: v.string(),
  offre: v.boolean(),
  client_id: v.pipe(v.string(), v.minLength(5, 'le champ doit contenir au minimum 5 caratere'))
})

export const schemaProjetUpdate = v.object({
  projet_type: v.string(),
  description: v.string(),
  offre: v.boolean()
})

export type SaveProjet = v.InferInput<typeof schemaProjetSave>;

export type UpdateProjet = v.InferInput<typeof schemaProjetUpdate>;
