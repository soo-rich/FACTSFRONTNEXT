'use client'

// Component Imports
import { Controller } from 'react-hook-form'

import Typography from '@mui/material/Typography'

import CustomTextField from '@core/components/mui/TextField'
import type { AddGlobalProformaType } from '@views/soosmart/dossier/new-proforma-form/type/AddGlobalProformaType'
import SectionTitle from '@views/soosmart/dossier/new-proforma-form/component/SectionTitle'


const RefConponent = ({ control, errors }: AddGlobalProformaType) => {


  return <div className={'flex flex-col gap-4 '}>
    <SectionTitle title={'Réference'} sub={'Entre la reference de la proforma'}
                  icon={<i className={'tabler-file-text text-3xl text-white m-1'} />} />
    <Controller rules={{ required: true }} render={({ field }) => (<CustomTextField
      {...field}
      label={'Référence'}
      placeholder={'Référence'}
      fullWidth
      required
      error={!!errors.reference}
      {...(errors.reference && {
        error: true,
        helperText: errors?.reference?.message
      })}
    />)} name={'reference'} control={control} />
  </div>
}

export default RefConponent
