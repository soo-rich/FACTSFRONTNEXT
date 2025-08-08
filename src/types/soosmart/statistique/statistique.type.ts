export type StatistiqueType = {
  facture: FactStat;
  proforma: FactStat;
  bordeau: FactStat;
};

export type FactStat = {
  total: number;
  total_today: number;
  adopted_true: number
  adopted_false: number
};

export type FactureTotal = {
  Paid: number;
  Unpaid: number;
}
export type TableStat = {
  numero: number;
  date: Date;
  total: number;
};
export type ChartStat = {
  label: string
  value: number

};
