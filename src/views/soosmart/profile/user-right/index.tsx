'use client'

import type { SyntheticEvent } from 'react'

// React Imports
import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'

import Grid from '@mui/material/Grid2'

// Component Imports
import TabPanel from '@mui/lab/TabPanel'

import CustomTabList from '@core/components/mui/TabList'
import SecurityTab from '@views/soosmart/profile/user-right/security'


const UserRight = () => {
  // States
  const [activeTab, setActiveTab] = useState('security')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomTabList onChange={handleChange} variant="scrollable" pill="true">
              <Tab icon={<i className="tabler-lock" />} value="security" label="Security" iconPosition="start" />
            </CustomTabList>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TabPanel value={'security'}>
              <SecurityTab />
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  )
}

export default UserRight
