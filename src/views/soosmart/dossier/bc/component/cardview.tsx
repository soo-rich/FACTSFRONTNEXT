'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import { CircleX, Download, EyeIcon, FileIcon } from 'lucide-react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

import { toast } from 'react-toastify'

import { useQuery } from '@tanstack/react-query'

import type { PurchaseOrderType } from '@/types/soosmart/dossier/purchaseOrder.type'
import UtilsMetod from '@/utils/utilsmethod'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import CustomIconButton from '@core/components/mui/IconButton'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'

const CardView = ({ bc, onRemove }: { bc: PurchaseOrderType; onRemove?: () => void }) => {
  const pdfisvg = '/images/svg/pdf.svg'
  const imagesvg = '/images/svg/photo-svgrepo-com.svg'
  const ms_wordsvg = '/images/svg/ms-word-svgrepo-com.svg'

  const [open, setOpen] = useState(false)

  const { data: presignedurl, isLoading } = useQuery({
    queryKey: ['purchaseOrder', 'presignedUrl', bc.file.storageKey, bc.file.provider],
    queryFn: async () => {
      return (await UtilsMetod.getFileFormApi(bc.file.storageKey, bc.file.provider)) as string
    },
    enabled: open && !!bc.file.storageKey && !!bc.file.provider,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { lang: locale } = useParams()

  const getMimeLabel = (mime: string) => {
    if (mime === 'application/pdf') return 'PDF'
    if (mime.startsWith('image/')) return 'Image'
    if (mime.includes('word')) return 'Word'

    return 'Fichier'
  }

  const getFileTypeIcon = () => {
    if (bc.file.mimetype === 'application/pdf') {
      return <img src={pdfisvg} alt='PDF' className='size-[80px]' />
    }

    if (['image/jpeg', 'image/png', 'image/gif'].includes(bc.file.mimetype)) {
      return <img src={imagesvg} alt='Image' className='size-[80px]' />
    }

    if (
      ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
        bc.file.mimetype
      )
    ) {
      return <img src={ms_wordsvg} alt='Word' className='size-[80px]' />
    }

    return <FileIcon size={80} className='text-gray-400' />
  }

  const MetaRow = ({ label, value, uppercase }: { label: string; value: string; uppercase?: boolean }) => (
    <div>
      <Typography variant='caption' className='text-gray-500 font-medium block'>
        {label}
      </Typography>
      <Typography variant='body2' className={uppercase ? 'uppercase text-primary' : 'text-primary'}>
        {value}
      </Typography>
    </div>
  )

  return (
    <>
      <Card className='border rounded-xl overflow-hidden relative'>
        {/* Remove overlay */}
        <div className='absolute top-2 right-2 z-10'>
          <CustomIconButton size='small' onClick={() => onRemove?.()}>
            <CircleX size={16} className='text-gray-400 hover:text-red-600' />
          </CustomIconButton>
        </div>

        {/* Preview zone — fixed height */}
        <div className='flex flex-col items-center justify-center gap-2 bg-gray-100 h-40 px-4'>
          {getFileTypeIcon()}
          <Chip label={getMimeLabel(bc.file.mimetype)} size='small' variant='outlined' className='text-xs' />
        </div>

        <Divider />

        <CardContent className='p-3 flex flex-col gap-2'>
          <Typography className='text-center text-blue-900 font-semibold text-sm line-clamp-2'>{bc.label}</Typography>
          <Typography variant='caption' className='text-center text-gray-400 block'>
            {UtilsMetod.formatBytes(bc.file.size)}
          </Typography>
          <div className='flex gap-2 mt-1'>
            <Button
              variant='tonal'
              size='small'
              fullWidth
              startIcon={<EyeIcon size={14} />}
              onClick={() => setOpen(true)}
            >
              Voir
            </Button>
            <Button
              variant='contained'
              size='small'
              fullWidth
              startIcon={<Download size={14} />}
              onClick={() => {
                UtilsMetod.getFileFormApi(bc.file.storageKey, bc.file.provider)
                  .then(value => {
                    if (value) UtilsMetod.download(value, bc.file)
                  })
                  .catch(() => toast.error('Erreur lors de la récupération du fichier'))
              }}
            >
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <DefaultDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} title={bc?.label}>
        {/* Preview */}
        {isLoading ? (
          <div className='flex justify-center items-center h-40'>
            <CircularProgress size={32} />
          </div>
        ) : presignedurl ? (
          bc.file.mimetype === 'application/pdf' ? (
            <iframe src={presignedurl} width='100%' height='500px' title={bc.file.originalName} />
          ) : bc.file.mimetype.startsWith('image/') ? (
            <img src={presignedurl} alt={bc.file.originalName} className='max-w-full max-h-[500px] mx-auto block' />
          ) : (
            <div className='flex flex-col items-center gap-2 p-4'>
              <a href={presignedurl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
                Ouvrir le fichier
              </a>
              <Typography variant='caption' className='text-gray-500'>
                Aperçu non disponible pour ce type de fichier.
              </Typography>
            </div>
          )
        ) : (
          <div className='flex justify-center items-center h-40'>
            <Typography variant='body2' className='text-gray-400'>
              Impossible de charger l&apos;aperçu.
            </Typography>
          </div>
        )}

        <Divider className='my-3' />

        {/* Metadata */}
        <Typography variant='subtitle2' className='font-bold mb-2'>
          Informations
        </Typography>
        <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
          <MetaRow label='Nom du fichier' value={bc.file.originalName} />
          <MetaRow label='Type' value={getMimeLabel(bc.file.mimetype)} />
          <MetaRow label='Taille' value={UtilsMetod.formatBytes(bc.file.size)} />
          <MetaRow label='Téléchargé par' value={bc.file.uploadBy ?? ''} uppercase />
          <MetaRow label='Mis à jour le' value={new Date(bc.file.updatedat).toLocaleDateString()} />
        </div>

        {/* Actions */}
        <div className='grid grid-cols-2 gap-2 mt-4'>
          {bc?.proforma?.numero && (
            <Button
              variant='outlined'
              component={Link}
              href={getLocalizedUrl(`/docs/${bc.proforma.numero}`, locale as Locale)}
              startIcon={<FileIcon size={14} />}
              size='small'
            >
              Proforma
            </Button>
          )}
          {bc?.bordereau?.numero && (
            <Button
              variant='outlined'
              color='warning'
              component={Link}
              href={getLocalizedUrl(`/docs/${bc.bordereau.numero}`, locale as Locale)}
              startIcon={<FileIcon size={14} />}
              size='small'
            >
              Bordereau
            </Button>
          )}
          <Button
            variant='outlined'
            color='success'
            size='small'
            startIcon={<Download size={14} />}
            disabled={isLoading || !presignedurl}
            onClick={() => {
              if (presignedurl) UtilsMetod.download(presignedurl, bc.file)
            }}
          >
            Télécharger
          </Button>
        </div>
      </DefaultDialog>
    </>
  )
}

export default CardView
