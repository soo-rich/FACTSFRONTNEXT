import { z } from 'zod';

export type ProjetType = {
  id: string;
  projet_type: string;
  description: string;
  offre: boolean;
  client: string;
  create_at: Date;
  update_at: Date;
};

export const schemaProjetSave = z.object({
  projet_type: z.string(),
  description: z.string(),
  offre: z.boolean(),
  client_id: z.string(),
});
export const schemaProjetUpdate = z.object({
  projet_type: z.string(),
  description: z.string(),
  offre: z.boolean(),
});

export type SaveProjet = z.infer<typeof schemaProjetSave>;

export type UpdateProjet = z.infer<typeof schemaProjetUpdate>;
