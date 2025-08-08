import type { Locale } from '@/configs/i18n'
import type { getDictionary } from '@/utils/getDictionary'
import type { ThemeColor } from '@core/types'

export type ComponentDictonaryParamsType = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export type ComponentLangParamsType = {
  params: Promise<{ lang: Locale }>
}

export type DashComponementType = {
  title?: string
  avatarIcon: string
  color?: ThemeColor
}
