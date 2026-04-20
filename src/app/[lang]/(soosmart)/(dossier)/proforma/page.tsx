import Grid2 from '@mui/material/Grid'

import ProformaList from '@views/soosmart/dossier/proforma/proforma-list'
import { getDictionary } from '@/utils/getDictionary'
import type { Locale } from '@configs/i18n'
import { i18n } from '@configs/i18n'
import BreadCrumbs from '@components/pathbreadcrumbs/BreadCrumbs'

const ProformaPage = async (props: { params: Promise<{ lang: string }> }) => {
  const params = await props.params

  // Type guard to ensure lang is a valid Locale
  const lang: Locale = i18n.locales.includes(params.lang as Locale) ? (params.lang as Locale) : i18n.defaultLocale

  // Vars
  const dictionary = await getDictionary(lang)

  return (
    <Grid2 container direction={'column'} spacing={2} sx={{ mb: 2 }}>
      <BreadCrumbs
        path={[
          {
            label: dictionary['navigation'].case.proforma
          }
        ]}
        typographyProps={{
          variant: 'h4',
          className: 'text-gray-700',
          sx: { fontWeight: 500 }
        }}
      />
      <ProformaList />
    </Grid2>
  )
}

export default ProformaPage
