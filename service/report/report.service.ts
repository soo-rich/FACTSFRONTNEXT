import AxiosInstance from '@/service/axios-manager/axios-instance';

const url = 'report';
export class ReportService {
  static REPORT_KEY = 'report';

  async genereateReport(numero: string) {
    return (await AxiosInstance.get(`${url}/${numero}`, { responseType: 'arraybuffer' })).data;
  }
}
