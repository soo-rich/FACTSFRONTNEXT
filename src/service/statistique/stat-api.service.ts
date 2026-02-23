import instance from '@/service/axios-manager/instance'
import type {
  ClientRanking,
  DashboardOverview,
  GrowthComparison,
  InvoiceStatusBreakdown,
  MonthlyDataPoint,
  ProformaStatusBreakdown,
  ProjetTypeBreakdown,
  RevenueByDimension,
  StatistiqueQueryParams,
  TopArticle
} from '@/types/soosmart/statistique/dashboard.type'

const url = `statistique`

export class StatAPIService {
  static STAT_KEY = 'statistique'

  static async getDashboard(): Promise<DashboardOverview> {
    return (await instance.get<DashboardOverview>(`${url}/dashboard`)).data
  }

  static async getProformaStatus(): Promise<ProformaStatusBreakdown> {
    return (await instance.get<ProformaStatusBreakdown>(`${url}/proforma/status`)).data
  }

  static async getInvoiceStatus(): Promise<InvoiceStatusBreakdown> {
    return (await instance.get<InvoiceStatusBreakdown>(`${url}/invoice/status`)).data
  }

  static async getMonthlyRevenue(params?: StatistiqueQueryParams): Promise<MonthlyDataPoint[]> {
    return (await instance.get<MonthlyDataPoint[]>(`${url}/revenue/monthly`, { params })).data
  }

  static async getMonthlyDocuments(params?: StatistiqueQueryParams): Promise<MonthlyDataPoint[]> {
    return (await instance.get<MonthlyDataPoint[]>(`${url}/documents/monthly`, { params })).data
  }

  static async getRevenueByClient(params?: StatistiqueQueryParams): Promise<RevenueByDimension[]> {
    return (await instance.get<RevenueByDimension[]>(`${url}/revenue/by-client`, { params })).data
  }

  static async getRevenueByProjet(params?: StatistiqueQueryParams): Promise<RevenueByDimension[]> {
    return (await instance.get<RevenueByDimension[]>(`${url}/revenue/by-projet`, { params })).data
  }

  static async getTopArticles(params?: StatistiqueQueryParams): Promise<TopArticle[]> {
    return (await instance.get<TopArticle[]>(`${url}/articles/top`, { params })).data
  }

  static async getProjetTypes(): Promise<ProjetTypeBreakdown[]> {
    return (await instance.get<ProjetTypeBreakdown[]>(`${url}/projets/types`)).data
  }

  static async getGrowthComparison(): Promise<GrowthComparison> {
    return (await instance.get<GrowthComparison>(`${url}/growth`)).data
  }

  static async getClientRanking(params?: StatistiqueQueryParams): Promise<ClientRanking[]> {
    return (await instance.get<ClientRanking[]>(`${url}/clients/ranking`, { params })).data
  }

  static async getYearlyRevenue(years?: number): Promise<MonthlyDataPoint[]> {
    return (await instance.get<MonthlyDataPoint[]>(`${url}/revenue/yearly`, { params: { years } })).data
  }
}
