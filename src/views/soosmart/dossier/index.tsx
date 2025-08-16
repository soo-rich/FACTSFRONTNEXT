'use client'

import type { ReactElement, SyntheticEvent } from 'react'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import ProformaList from '@views/soosmart/dossier/proforma/proforma-list'
import BordereauList from '@views/soosmart/dossier/bordereau/bordereau-list'
import FactureList from '@views/soosmart/dossier/facture/facture-list'
import { parseAsString, useQueryState } from 'nuqs'

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

  const [value, setValue] = useQueryState('file', parseAsString.withDefault('proforma'))

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <CustomTabList pill="true" onChange={handleChange}>
        {dossierDate.map(item => (
          <Tab
            key={item.id}
            onClick={() => setValue(item.id)}
            value={item.id}
            label={item.label}
            icon={item.icon}
            iconPosition={item.position ?? 'end'}
          />
        ))}
      </CustomTabList>
      <TabPanel value="proforma">
        <ProformaList />
      </TabPanel>
      <TabPanel value="bordereau">
        <BordereauList />
      </TabPanel>
      <TabPanel value="facture">
        <FactureList />
      </TabPanel>
    </TabContext>
  )
}

export default DossierIndex
