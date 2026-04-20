//Styles
import 'react-international-phone/style.css'
import Typography from '@mui/material/Typography'
import { PhoneInput } from 'react-international-phone'
import type { TextFieldProps } from '@mui/material/TextField'

import classNames from 'classnames'

type Props = Pick<
  TextFieldProps,
  'label' | 'required' | 'onChange' | 'autoFocus' | 'onBlur' | 'name' | 'placeholder' | 'value'
> & {
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}

const CustomPhoneInput = (props: Props) => {
  const { label, value, required, error, helperText, onChange, onBlur, autoFocus, placeholder, name } = props

  return (
    <div className={'w-full flex flex-col gap-1 focus:text-primary'}>
      <Typography variant={'body2'} className={classNames(error && 'text-error', '')}>
        {label} {required && <span className={'text-error'}>*</span>}
      </Typography>
      <PhoneInput
        value={String(value)}
        className={classNames(error && ' border border-error ', 'w-full rounded-md')}
        inputClassName={'w-full'}
        defaultCountry={'tg'}
        onChange={(_phone, meta) => onChange?.(meta.inputValue)}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {helperText && (
        <Typography variant='caption' className={classNames(error ? 'text-error' : 'text-secondary', 'mt-0.5')}>
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default CustomPhoneInput
