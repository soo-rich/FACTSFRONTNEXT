'use client'

// Next Imports
// import { useParams } from 'next/navigation'

// MUI Imports
import { useState } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import Button from '@mui/material/Button'

import { useQueryClient } from '@tanstack/react-query'

import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu } from '@menu/vertical-menu'

import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
import menuData from '@/data/navigation/verticalMenuData'
import AddProforma from '@views/soosmart/dossier/proforma/add-proforma'
import { ProformaService } from '@/service/dossier/proforma.service'


import { StatAPIService } from '@/service/statistique/stat-api.service'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

// États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <>
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
          : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
      >
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >

          <Button variant={'contained'} startIcon={<i className="tabler-plus" />} className={'w-full'}
                  onClick={() => setIsModalOpen(true)}>
            {dictionary['navigation'].addproforma}
          </Button>

        </Menu>
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >

          <GenerateVerticalMenu menuData={menuData(dictionary)} />
        </Menu>
      </ScrollWrapper>
      <AddProforma open={isModalOpen} handleClose={() => setIsModalOpen(false)} onSucces={() => {
        Promise.all(
          [
            queryClient.invalidateQueries({
              queryKey: [ProformaService.PROFORMA_KEY]
            }),
            queryClient.invalidateQueries({
              queryKey: [StatAPIService.STAT_KEY]
            })
          ]
        )
        queryClient
          .invalidateQueries({
            queryKey: [ProformaService.PROFORMA_KEY]
          })
          .then(r => r)
      }} />
    </>
  )
}

export default VerticalMenu
