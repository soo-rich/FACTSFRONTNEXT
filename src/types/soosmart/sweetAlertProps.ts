import { type SweetAlertIcon } from 'sweetalert2'

export type SweetconfirmProps = {
  icon?: SweetAlertIcon
  title?: string
  subtitle?: string
  confirmAction: () => void
  cancelAction?: () => void
}