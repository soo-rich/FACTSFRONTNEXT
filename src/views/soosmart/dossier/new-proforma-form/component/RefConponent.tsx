'use client'

import {useState} from "react";

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const RefConponent = ({onchange}: {
  onchange:
    (value: string) => void
}) => {

  const [value, setValue] = useState<string>('')


  const handleChange = (newValue: string) => {
    setValue(newValue)
    onchange(newValue)
  }

  const verificationRef = () => {
    return value !== '' && value.length >= 3
  }

  return <CustomTextField
    label={'Référence'}
    placeholder={'Référence'}
    fullWidth
    required
    error={verificationRef()}
    {...(verificationRef() && {
      error: true,
      helperText: "Entrez au moins 3 caractères",
    })}

    onChange={(e) => handleChange(e.target.value)}

  />
}

export default RefConponent
