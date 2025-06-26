import { z } from 'zod';
import { Article_Quantite, schemaArticleQuantiteslist } from '@/types/dossier/Article_Quantite';

export type ProformaType = {
  id: string;
  reference: string;
  numero: string;
  articleQuantiteslist: Article_Quantite[];
  total_ht: number;
  total_ttc: number;
  total_tva: number;
  client: string;
  date: Date;
  signby: string;
  adopted: boolean;
};

export const schemaProforma = z.object({
  projet_id: z.string().nullable(),
  client_id: z.string().nullable(),
  reference: z.string().min(3, 'entre au moin 3 carateres'),
  articleQuantiteslist: z.array(schemaArticleQuantiteslist).nonempty(),
});

export type ProformaSave = z.infer<typeof schemaProforma>;
