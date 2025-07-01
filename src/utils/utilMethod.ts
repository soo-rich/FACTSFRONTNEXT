import { SweetconfirmProps } from '@/types/sweetAlertProps';
import Swal from 'sweetalert2'
class UtiliMetod {
  static formatDevise = (value: number, format?: string) => {
    return new Intl.NumberFormat(format ?? 'fr-FR').format(value);
  };

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

}

export default UtiliMetod;