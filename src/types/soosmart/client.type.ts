import { z } from "zod";

export type ClientType = {
  id: string;
  lieu: string;
  nom: string;
  sigle: string;
  telephone: string;
  potentiel: boolean;
};

export const schemaClient = z.object({
  lieu: z.string().min(1, "le lieu est requis"),
  nom: z.string().min(1, "le nom est requis"),
  sigle: z.string(),
  telephone: z.string().min(2,"le numero ne peut est null"),
  potentiel: z.boolean(),
});

export type ClientSave = z.infer<typeof schemaClient>;
