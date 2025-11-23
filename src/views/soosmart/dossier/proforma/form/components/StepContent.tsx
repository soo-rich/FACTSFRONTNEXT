import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { ProformaSaveV2 } from '@/types/soosmart/dossier/proforma.type'
import CustomTextField from '@core/components/mui/TextField'
import CustomVerticalRadioIcon from '@views/soosmart/dossier/proforma/form/components/ProjetorClient'
import ProjetSelection from '@views/soosmart/dossier/proforma/form/components/ProjetSelection'

const StepContent = ({ active, control, onchange, errors, projet }: {
  active: number,
  projet: boolean
  control?: Control<ProformaSaveV2, any>,
  onchange?: (value: boolean) => void,
  errors?: FieldErrors<ProformaSaveV2>,
}) => {

  const step: { [key: number]: JSX.Element } = {
    1: (<Controller render={({ field }) => (
      <CustomTextField
        {...field}
        label={'Reference'}
        fullWidth
        error={!!errors?.reference}
        {...(errors?.reference && {
          error: true,
          helperText: errors?.reference?.message
        })}
      />
    )} name={'reference'} control={control} />),
    2: (<CustomVerticalRadioIcon handleChange={onchange} />),
    3: projet ? <Controller render={({ field }) => (<ProjetSelection change={field.onChange} value={field.value} />)} name={'projet_id'} control={control} /> : null
  }

  return <>{step[active]}</>
}


export default StepContent
