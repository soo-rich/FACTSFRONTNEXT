import AxiosInstance from '@/service/axios-manager/axios-instance';
import { StatistiqueType } from '@/types/statistique/statistique.type';

const url = `stat`;
export class StatAPIService {
  static STAT_KEY = 'stat';
  async getstat() {
    return (await AxiosInstance.get<StatistiqueType>(url)).data;
  }
}
