export type StatistiqueType = {
  facture: FactStat;
  proforma: FactStat;
  tableList: TableStat[];
  chart: ChartStat[];
};

export type FactStat = {
  total: number;
  total_today: number;
};
export type TableStat = {
  numero: number;
  date: Date;
  total: number;
};
export type ChartStat = {
  label: string;
  value: number;
};
