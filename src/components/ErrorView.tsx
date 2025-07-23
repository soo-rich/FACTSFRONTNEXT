'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@mui/material'
import Typography from '@mui/material/Typography'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

type Props = {
  title?: string
  subtitle?: string
  illustration?: boolean
  backButton?: boolean
  buttonText?: string
  link?: string
}

const ErrorView = ({ title, subtitle, illustration = false, backButton = false, buttonText, link }: Props) => {
  const router = useRouter()
  const hasHistory = useRef(false)
  const [localizedLink, setLocalizedLink] = useState(link)
  const { lang: locale } = useParams()

  const handleClickBack = () => {
    hasHistory.current ? router.back : router.push('/')
  }

  useEffect(() => {
    hasHistory.current = window.history.length > 1
  }, [])

  // Correction: Utiliser un état local pour le lien localisé, et éviter de modifier les props directement

  useEffect(() => {
    if (link) {
      setLocalizedLink(getLocalizedUrl(link, locale as Locale))
    }
  }, [link, locale])

  return (
    <div className='flex items-center p-24 flex-col text-center'>
      <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
        <Typography variant='h4'>{title ?? "Une erreur s'est produite 😓"}</Typography>
        <Typography>{subtitle ?? 'Veuillez réessayer plustard !'}</Typography>
      </div>
      {backButton &&
        (localizedLink ? (
          <Button href={localizedLink} component={Link} variant='contained'>
            {buttonText ? buttonText : 'Back '}
          </Button>
        ) : (
          <Button onClick={handleClickBack} variant='contained'>
            {buttonText ? buttonText : 'Back To Home'}
          </Button>
        ))}
      {illustration && (
        <img
          alt='under-maintenance-illustration'
          src='/images/illustrations/characters-with-objects/2.png'
          className='object-cover max-is-full bs-auto max-bs-[400px] sm:bs-[400px] md:bs-[450px] lg:max-bs-[500px] mbs-10 md:mbs-14 lg:mbs-20'
        />
      )}
    </div>
  )
}

export default ErrorView
