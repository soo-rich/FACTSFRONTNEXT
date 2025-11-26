import { toast } from 'react-toastify'

import instance from '@/service/axios-manager/instance'
import type { DocumentDTO } from '@/types/soosmart/dossier/DocumentDTO'

const url = 'document'

export class DocumentService {
  static REPORT_KEY = url

  static async genereateReport(numero: string) {
    return (await instance.get(`${url}/${numero}`, { responseType: 'arraybuffer' })).data
  }

  static async signDocument(numero: string, signedBy: string, role?: string) {
    return (
      await instance.patch<boolean>(`${url}/signe/${numero}`, null, {
        params: {
          signedBy: signedBy,
          signedByRole: role
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

      // Extraire le nom du fichier depuis le header content-disposition
      const contentDisposition = res.headers['Content-Disposition'] || res.headers['content-disposition']
      let fileName = `${numero}.pdf` // Nom par défaut

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/)

        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1]
        }
      }

      link.href = fileURL
      link.download = fileName
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
