import {format as formatter} from 'date-fns'
import Swal from 'sweetalert2';
import {fr} from 'date-fns/locale';

import type {SweetconfirmProps} from "@/types/soosmart/sweetAlertProps";

class UtiliMetod {

  static formatDevise = (value: number, format?: string) => {
    return new Intl.NumberFormat(format ?? 'fr-FR').format(value);
  };

  static formatDate = (date: Date, format?: string) => {
    return formatter(date, format ?? 'yyyy-MM-dd', {locale: fr})
  }

  static confirmDialog = async ({icon, title, subtitle, confirmAction, cancelAction}: SweetconfirmProps) => {
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
  static SuppressionConfirmDialog = async ({data, confirmAction, cancelAction}: SweetconfirmProps & {
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
    const colors = ['#00CFE8', '#FFB800', '#FF4C51', '#00c98f', '#F88379', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC']

    return colors[Math.floor(Math.random() * colors.length)]
  }


}

export default UtiliMetod;
