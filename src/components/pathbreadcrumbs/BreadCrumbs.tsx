'use client'
import { useParams } from 'next/navigation'

import { Breadcrumbs, type BreadcrumbsProps, Link, Typography, type SxProps, type Theme } from '@mui/material'

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
    sx?: SxProps<Theme>
  }
  typographyProps?: {
    variant?: 'body1' | 'body2' | 'caption' | 'h6' | 'h5' | 'h4' | 'h2' | 'h3'
    className?: string
    sx?: SxProps<Theme>
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
      {path.map((p, i) => {
        const isLast = i === path.length - 1

        const content = (
          <>
            {p.icon && <span className='mie-2'>{p.icon}</span>}
            {p.label}
          </>
        )

        if (!p.href) {
          return (
            <Typography
              key={i}
              color={p.color ?? 'secondary'}
              variant={typographyProps?.variant}
              className={typographyProps?.className}
              sx={{ cursor: p.onClick ? 'pointer' : undefined, ...typographyProps?.sx }}
              onClick={p.onClick}
              aria-current={isLast ? 'page' : undefined}
            >
              {content}
            </Typography>
          )
        }

        return (
          <Link
            key={i}
            color={p.color ?? 'secondary'}
            component='a'
            variant={typographyProps?.variant}
            href={getLocalizedUrl(p.href, locale as Locale)}
            underline={linkProps?.underline ?? 'none'}
            className={linkProps?.className}
            sx={linkProps?.sx}
            onClick={p.onClick}
            aria-current={isLast ? 'page' : undefined}
          >
            {content}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadCrumbs
