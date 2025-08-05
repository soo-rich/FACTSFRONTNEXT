import type { InferInput } from 'valibot'
import { boolean, minLength, object, pipe, string } from 'valibot'

export type ClientType = {
  id: string;
  lieu: string;
  nom: string;
  sigle: string;
  telephone: string;
  potentiel: boolean;
};

export const schemaClient = object({
  lieu: pipe(string(), minLength(1, 'le lieu est requis')),
  nom: pipe(string(), minLength(1, 'le nom est requis')),
  sigle: string(),
  telephone: pipe(string(), minLength(2, 'le numero ne peut est null')),
  potentiel: boolean()
})

export type ClientSave = InferInput<typeof schemaClient>;
