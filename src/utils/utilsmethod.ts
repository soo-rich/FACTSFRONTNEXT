import { format as formatter } from 'date-fns'
import Swal from 'sweetalert2'
import { fr } from 'date-fns/locale'

// import axios from 'axios'

import { toast } from 'react-toastify'

import type { SweetconfirmProps } from '@/types/soosmart/sweetAlertProps'
import instance from '@/service/axios-manager/instance'
import type { FileObject } from '@/types/soosmart/dossier/purchaseOrder.type'

class UtiliMetod {
  static formatBytes(size: number): string {
    if (size === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(size) / Math.log(k))

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  static formatDevise = (value: number, format?: string) => {
    return new Intl.NumberFormat(format ?? 'fr-FR').format(value)
  }

  static formatDate = (date: Date, format?: string) => {
    return formatter(date, format ?? 'yyyy-MM-dd', { locale: fr })
  }

  static confirmDialog = async ({ icon, title, subtitle, confirmAction, cancelAction }: SweetconfirmProps) => {
    await Swal.fire({
      title: title ?? 'Vous êtes sûr(e) ?',
      text: subtitle,
      icon: icon ?? 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      confirmButtonColor: '#e20511',
      reverseButtons: true
    }).then(async result => {
      if (result.isConfirmed) {
        confirmAction()
      } else {
        if (cancelAction) cancelAction()
      }
    })
  }
  static SuppressionConfirmDialog = async ({
    data,
    confirmAction,
    cancelAction
  }: SweetconfirmProps & {
    data: string
  }) => {
    await Swal.fire({
      title: `Suppression ?`,
      text: `Vous aller supprimer cette information ${data} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      confirmButtonColor: '#e20511',
      reverseButtons: true
    }).then(async result => {
      if (result.isConfirmed) {
        confirmAction()
      } else {
        if (cancelAction) cancelAction()
      }
    })
  }

  static randomThemeColor(): 'info' | 'warning' | 'error' | 'success' | 'primary' {
    const colors = ['info', 'warning', 'error', 'success', 'primary']

    return colors[Math.floor(Math.random() * colors.length)] as 'info' | 'warning' | 'error' | 'success' | 'primary'
  }

  static randomColor() {
    const colors = [
      '#00CFE8',
      '#FFB800',
      '#FF4C51',
      '#00c98f',
      '#F88379',
      '#FF6F61',
      '#6B5B95',
      '#88B04B',
      '#F7CAC9',
      '#92A8D1',
      '#955251',
      '#B565A7',
      '#009B77',
      '#DD4124',
      '#45B8AC'
    ]

    return colors[Math.floor(Math.random() * colors.length)]
  }

  static getFileFormApi = async (url: string, provider?: 'minio' | 'local') => {
    return provider === 'minio'
      ? (await instance.get('file/presigned', { params: { url } })).data
      : { presigned: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + url }
  }

  static getImagefromLocal = async (url: string) => {
    return process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + url
  }

  static download = async (uri: string, file?: FileObject) => {
    const downloadPromise = fetch(uri, {
      method: 'GET'
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = file ? file.filename : 'file'
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return response
      })
      .catch(error => {
        console.error('Erreur de téléchargement:', error)
        throw error
      })

    return toast.promise(downloadPromise, {
      pending: 'Téléchargement en cours...',
      success: 'Fichier téléchargé avec succès',
      error: 'Erreur de téléchargement'
    })
  }
}

export default UtiliMetod
