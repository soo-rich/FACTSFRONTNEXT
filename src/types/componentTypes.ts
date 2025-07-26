import type { Locale } from '@/configs/i18n'
import type { getDictionary } from '@/utils/getDictionary'

export type ComponentDictonaryParamsType = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export type ComponentLangParamsType = {
  params: Promise<{ lang: Locale }>
}
