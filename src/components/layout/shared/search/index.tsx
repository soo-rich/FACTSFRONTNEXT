'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
// Type Imports
import { useQueryClient } from '@tanstack/react-query'

// Component Imports
// Hook Imports
import Tooltip from '@mui/material/Tooltip'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
// Style Imports

// Data Imports
import AddProforma from '@/views/soosmart/dossier/proforma/add-proforma'
import { ProformaService } from '@/service/dossier/proforma.service'
import { StatAPIService } from '@/service/statistique/stat-api.service'


const ShurtCutProforma = () => {
  // States
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()


  // Hooks
  const { isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()


  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])


  return (
    <>
      {isBreakpointReached || settings.layout === 'horizontal' ? (
        <Tooltip title="Proforma Ctrl + K" placement="bottom" arrow>
          <IconButton className="text-textPrimary" onClick={() => setOpen(true)}>
            <i className="tabler-plus text-2xl" />
          </IconButton>
        </Tooltip>
      ) : (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(true)}>
          <IconButton className="text-textPrimary" onClick={() => setOpen(true)}>
            <i className="tabler-file-description text-2xl" />
          </IconButton>
          <div className="whitespace-nowrap select-none text-textDisabled">Proforma Crtl + K</div>
        </div>
      )}
      <AddProforma open={open} handleClose={() => setOpen(false)} onSucces={() => {
        Promise.all(
          [
            queryClient.invalidateQueries({
              queryKey: [ProformaService.PROFORMA_KEY]
            }),
            queryClient.invalidateQueries({
              queryKey: [StatAPIService.STAT_KEY]
            })
          ]
        ).then(r => r)

      }} />
    </>
  )
}

export default ShurtCutProforma
