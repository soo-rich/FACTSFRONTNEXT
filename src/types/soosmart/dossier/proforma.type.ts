import * as v from 'valibot'

import type { Article_Quantite } from './Article_Quantite'
import { schemaArticleQuantiteListV2, schemaArticleQuantiteslist } from './Article_Quantite'


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

export const schemaProforma = v.object({
  projet_id: v.nullable(v.string()),
  client_id: v.nullable(v.string()),
  reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
  articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteslist), v.minLength(1))
})

export const schemaProformaV2 = v.object({
  projet_id: v.nullable(v.string()),
  client_id: v.nullable(v.string()),
  reference: v.pipe(v.string(), v.minLength(3, 'entre au moin 3 carateres')),
  articleQuantiteslist: v.pipe(v.array(schemaArticleQuantiteListV2), v.minLength(1))
})

export type ProformaSave = v.InferInput<typeof schemaProforma>;
export type ProformaSaveV2 = v.InferInput<typeof schemaProformaV2>;
