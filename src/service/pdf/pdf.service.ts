import { toast } from 'react-toastify'

import instance from '@/service/axios-manager/instance'

export class PDFService {
  private static url = 'pdf'

  static async generatePdfByNumero(numero: string): Promise<Buffer> {
    return (await instance.get(`${this.url}/generate/${numero}`, { responseType: 'arraybuffer' })).data
  }

  static downloadPdfByNumero(numero: string) {
    const response = instance.get(`${this.url}/generate/${numero}`, { responseType: 'arraybuffer' })

    response
      .then(res => {
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
      .catch(error => {
        console.error('Erreur de téléchargement:', error)
        throw error
      })

    return toast.promise(response, {
      pending: 'Téléchargement en cours...',
      success: 'Fichier téléchargé avec succès',
      error: 'Erreur de téléchargement'
    })
  }
}
