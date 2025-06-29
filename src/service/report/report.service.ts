import instance from '@/service/axios-manager/instance';

const url = 'report';

export class ReportService {
  static REPORT_KEY = 'report';

  async genereateReport(numero: string) {
    return (await instance.get(`${url}/${numero}`, { responseType: 'arraybuffer' })).data;
  }
}
