import { SweetconfirmProps } from '@/types/sweetAlertProps';
import { format as formatter } from 'date-fns'
import Swal from 'sweetalert2';
import { fr } from 'date-fns/locale';
class UtiliMetod {

  static formatDevise = (value: number, format?: string) => {
    return new Intl.NumberFormat(format ?? 'fr-FR').format(value);
  };

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
  static SuppressionConfirmDialog = async ({  title, confirmAction, cancelAction }: SweetconfirmProps) => {
    await Swal.fire({
      title:  `Suppression ?`,
      text: `Vous aller supprimer cette information ${title} ?`,
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

}

export default UtiliMetod;
