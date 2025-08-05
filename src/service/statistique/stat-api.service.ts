import instance from '@/service/axios-manager/instance'
import type { StatistiqueType } from '@/types/soosmart/statistique/statistique.type'

const url = `stat`

export class StatAPIService {
  static STAT_KEY = 'stat'

  async getstat() {
    return (await instance.get<StatistiqueType>(url)).data
  }
}
