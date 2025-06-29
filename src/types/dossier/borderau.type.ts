import { Article_Quantite } from './Article_Quantite';

export type BorderauType = {
  id: string;
  reference: string;
  numero: string;
  articleQuantiteslist: Article_Quantite[];
  total_ht: number;
  total_ttc: number;
  total_tva: number;
  client: string;
  adopte: boolean;
  date: Date;
};
