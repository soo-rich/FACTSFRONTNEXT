import type { Control, FieldErrors } from 'react-hook-form'

import type { ProformaSave } from '@/types/soosmart/dossier/proforma.type'

export type AddGlobalProformaType = {
  control: Control<ProformaSave>,
  errors: FieldErrors<ProformaSave>,
}
