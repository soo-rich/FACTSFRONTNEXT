import { toast } from 'react-toastify'

import instance from '@/service/axios-manager/instance'
import type { DocumentDTO } from '@/types/soosmart/dossier/DocumentDTO'

const url = 'document'

export class DocumentService {
  static REPORT_KEY = url

  static async genereateReport(numero: string) {
    return (await instance.get(`${url}/${numero}`, { responseType: 'arraybuffer' })).data
  }

  static async signDocument(numero: string, signedBy: string) {
    return (
      await instance.patch<boolean>(`${url}/signe/${numero}`, null, {
        params: {
          signedBy: signedBy
        }
      })
    ).data
  }

  static async getDocumentDate(numero: string) {
    return (await instance.get<DocumentDTO>(`${url}/data/${numero}`)).data
  }

  static async generatePdf(numero: string) {
    const response = instance.get(`${url}/generate/${numero}`, { responseType: 'arraybuffer' })

    //telecharger le document PDF

    response.then(res => {
      const file = new Blob([res.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      const link = document.createElement('a')

      link.href = fileURL
      link.download = res.data.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(fileURL)
    })

    toast.promise(response, {
      pending: 'Génération du PDF en cours...',
      success: 'PDF généré avec succès !',
      error: 'Erreur lors de la génération du PDF.'
    })
  }
}
