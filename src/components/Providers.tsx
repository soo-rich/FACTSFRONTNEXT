// Type Imports
import { NuqsAdapter } from 'nuqs/adapters/next'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import QueryProvider from '@components/queryprovider/QueryProvider'
import TourProvider from '@components/product-tour/TourProvider'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = async (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()
  const systemMode = await getSystemMode()

  return (
    <NuqsAdapter>
      <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {/*<ReduxProvider>*/}
              <QueryProvider>
                <TourProvider>{children}</TourProvider>
              </QueryProvider>
              {/*</ReduxProvider>*/}
              <AppReactToastify direction={direction} hideProgressBar={false} position='top-right' />
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </NextAuthProvider>
    </NuqsAdapter>
  )
}

export default Providers
