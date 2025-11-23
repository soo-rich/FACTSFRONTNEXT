// React Imports
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Type Import
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'

const data: CustomInputVerticalData[] = [
  {
    value: 'projet',
    title: 'Projet',
    isSelected: true,
    content: 'Votre proforma pour un projet',
    asset: 'tabler-briefcase'
  },
  {
    value: 'client',
    title: 'Client',
    content: 'Votre proforma pour le client',
    asset: 'tabler-user'
  }
]

const CustomVerticalRadioIcon = ({ handleChange: change, state }: { handleChange: (value: boolean) => void, state: boolean }) => {

  // States
  const [selected, setSelected] = useState<string>(state ? 'projet' : 'client')

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    if (change) {
      change(selected === 'projet')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])



  return (
    <Grid container spacing={4} sx={{
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {data.map((item, index) => {
        let asset

        if (item.asset && typeof item.asset === 'string') {
          asset = <i className={classnames(item.asset, 'text-3xl')} />
        }

        return (
          <CustomInputVertical
            type='radio'
            key={index}
            data={{ ...item, asset }}
            selected={selected}
            name='client-projet'
            handleChange={handleChange}
            gridProps={{ size: { xs: 12, sm: 4 } }}
          />
        )
      })}
    </Grid>
  )
}

export default CustomVerticalRadioIcon
