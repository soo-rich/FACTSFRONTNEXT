'use client'

import type { SyntheticEvent, ReactElement } from 'react'
import { useState } from 'react'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// Component Imports

import CustomTabList from '@core/components/mui/TabList'
import ProformaList from '@views/soosmart/dossier/proforma/proforma-list'
import BordereauList from "@views/soosmart/dossier/bordereau/bordereau-list";

const dossierDate: { id: string; label: string; icon: ReactElement; position?: 'top' | 'bottom' | 'start' | 'end' }[] =
  [
    {
      id: 'proforma',
      label: 'Proforma',
      icon: <i className={'tabler-file'}></i>
    },
    {
      id: 'bordereau',
      label: 'Bordereau',
      icon: <i className={'tabler-file'}></i>
    },
    {
      id: 'facture',
      label: 'Facture',
      icon: <i className={'tabler-file'}></i>
    }
  ]

const DossierIndex = () => {
  // States
  const [value, setValue] = useState<string>('proforma')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <CustomTabList pill='true' onChange={handleChange}>
        {dossierDate.map(item => (
          <Tab
            key={item.id}
            value={item.id}
            label={item.label}
            icon={item.icon}
            iconPosition={item.position ?? 'end'}
          />
        ))}
      </CustomTabList>
      <TabPanel value='proforma'>
        <ProformaList />
      </TabPanel>
      <TabPanel value='bordereau'>
       <BordereauList/>
      </TabPanel>
      <TabPanel value='facture'>
        <Typography>
          Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
          carrot cake gummi bears.
        </Typography>
      </TabPanel>
    </TabContext>
  )
}

export default DossierIndex
