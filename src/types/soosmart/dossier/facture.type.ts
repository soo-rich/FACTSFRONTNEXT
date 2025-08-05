import type { Article_Quantite } from './Article_Quantite'

export type FactureType = {
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
};
