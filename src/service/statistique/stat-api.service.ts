import instance from '@/service/axios-manager/instance'
import type { ChartStat, FactureTotal, StatistiqueType, TableStat } from '@/types/soosmart/statistique/statistique.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'

const url = `stat`

export class StatAPIService {
  static STAT_KEY = 'stat'

  static async getstat() {
    return (await instance.get<StatistiqueType>(url)).data
  }

  static async getTotalFacture() {
    return (await instance.get<FactureTotal>(`${url}/total-facture`)).data
  }

  static async getChartData() {
    return (await instance.get<ChartStat[]>(`${url}/chart-data`)).data
  }

  static async getListDocument(params?: ParamRequests) {
    return (await instance.get<CustomresponseType<TableStat>>(`${url}/list-document`, {
      params: {
        size: params?.pagesize,
        page: params?.page
      }
    })).data
  }
}
