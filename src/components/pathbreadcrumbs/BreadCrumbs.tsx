'use client'
import { useParams } from 'next/navigation'

import { Breadcrumbs, type BreadcrumbsProps, Link, Typography } from '@mui/material'

import type { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'

export type PagePathType = {
  label: string
  href?: string
  color?: string
  icon?: React.ReactNode
  onClick?: () => void
}

type Props = {
  path: PagePathType[]
  separator?: React.ReactNode
  maxItems?: number
  className?: string
  sx?: BreadcrumbsProps['sx']
  linkProps?: {
    underline?: 'none' | 'hover' | 'always'
    className?: string
    sx?: BreadcrumbsProps['sx']
  }
  typographyProps?: {
    variant?: 'body1' | 'body2' | 'caption' | 'h6' | 'h5' | 'h4' | 'h2' | 'h3'
    className?: string
    sx?: React.CSSProperties
  }
}

const BreadCrumbs = ({
  path,
  separator = <span className={'icon-[heroicons--slash-16-solid]'} style={{ fontSize: 26 }}></span>,
  maxItems,
  className,
  sx,
  linkProps,
  typographyProps
}: Props) => {
  const { lang: locale } = useParams()

  return (
    <Breadcrumbs separator={separator} maxItems={maxItems} className={className} sx={sx} aria-label='breadcrumb'>
      {path.map(p => {
        const commonProps = {
          color: p.color ?? 'secondary',
          className: p.href ? linkProps?.className : typographyProps?.className,
          sx: p.href ? linkProps?.sx : typographyProps?.sx,
          onClick: p.onClick
        }

        // Si href n'est pas défini, retourner un Typography
        if (!p.href) {
          return (
            <Typography key={p.href ?? p.label} {...commonProps} variant={typographyProps?.variant}>
              {p.icon && <span className='mie-2'>{p.icon}</span>}
              {p.label}
            </Typography>
          )
        }

        return (
          <Link
            key={p.href ?? p.label}
            {...commonProps}
            component='a'
            variant={typographyProps?.variant}
            href={getLocalizedUrl(p.href, locale as Locale)}
            className={'no-underline'}
          >
            {p.icon && <span className='mie-2'>{p.icon}</span>}
            {p.label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadCrumbs
