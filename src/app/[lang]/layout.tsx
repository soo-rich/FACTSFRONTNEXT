// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'
// Config Imports
import { i18n } from '@configs/i18n'

// Component Imports
// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata = {
  title: 'SOOSMART FACTS',
  description:
    'Application de creation de facture de SOOSMART, une application de gestion de factures et de statistiques pour les entreprises.'
}

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const params = await props.params

  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[params.lang]

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id="__next" lang={params.lang} dir={direction} suppressHydrationWarning>
      <body className="flex is-full min-bs-full flex-auto flex-col">
      <InitColorSchemeScript attribute="data" defaultMode={systemMode} />
      <NuqsAdapter> {children}</NuqsAdapter>
      </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
