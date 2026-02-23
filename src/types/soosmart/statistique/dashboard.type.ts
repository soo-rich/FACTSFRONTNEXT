/** Dashboard overview returned by GET /statistique/dashboard */
export type DashboardOverview = {
  totalClients: number
  totalPotentialClients: number
  totalArticles: number
  totalProjets: number
  totalProformas: number
  totalBordereaux: number
  totalInvoices: number
  totalPurchaseOrders: number
  totalUsers: number
  totalRevenueHT: number
  totalRevenueTTC: number
  totalTVA: number
  averageProformaHT: number
  paidInvoicesAmount: number
  unpaidInvoicesAmount: number
}

/** Proforma status breakdown returned by GET /statistique/proforma/status */
export type ProformaStatusBreakdown = {
  pending: number
  accepted: number
  rejected: number
  adoptionRate: number
}

/** Invoice status breakdown returned by GET /statistique/invoice/status */
export type InvoiceStatusBreakdown = {
  pending: number
  paid: number
  partiallyPaid: number
  canceled: number
  paymentRate: number
}

/** Monthly data point for time-series charts */
export type MonthlyDataPoint = {
  year: number
  month: number
  label: string
  count: number
  totalHT: number
  totalTTC: number
}

/** Revenue grouped by a dimension (client, project) */
export type RevenueByDimension = {
  id: string
  label: string
  totalHT: number
  totalTTC: number
  totalTVA: number
  count: number
}

/** Top article by quantity and revenue */
export type TopArticle = {
  id: string
  libelle: string
  totalQuantite: number
  totalRevenue: number
  averagePrice: number
}

/** Project type breakdown */
export type ProjetTypeBreakdown = {
  projetType: string
  count: number
  offreCount: number
}

/** Growth comparison month-over-month */
export type GrowthComparison = {
  currentPeriodRevenue: number
  previousPeriodRevenue: number
  growthRate: number
  currentPeriodCount: number
  previousPeriodCount: number
}

/** Client ranking by revenue */
export type ClientRanking = {
  id: string
  nom: string
  sigle: string
  lieu: string
  totalHT: number
  totalTTC: number
  proformaCount: number
}

/** Query params for filtered statistics endpoints */
export type StatistiqueQueryParams = {
  startDate?: string
  endDate?: string
  limit?: number
}
