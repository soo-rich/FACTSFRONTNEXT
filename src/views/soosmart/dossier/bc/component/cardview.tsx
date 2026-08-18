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

  // `file` peut être null : un bon de commande n'a pas toujours de pièce jointe
  const file = bc?.file ?? null
  const hasFile = Boolean(file?.storageKey)

  const { data: presignedurl, isLoading } = useQuery({
    queryKey: ['purchaseOrder', 'presignedUrl', file?.storageKey, file?.provider],
    queryFn: async () => {
      return (await UtilsMetod.getFileFormApi(file?.storageKey, file?.provider)) as string
    },
    enabled: open && hasFile,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { lang: locale } = useParams()

  const getMimeLabel = (mime?: string | null) => {
    if (!mime) return 'Aucun fichier'
    if (mime === 'application/pdf') return 'PDF'
    if (mime.startsWith('image/')) return 'Image'
    if (mime.includes('word')) return 'Word'

    return 'Fichier'
  }

  const getFileTypeIcon = () => {
    const mimetype = file?.mimetype

    if (mimetype === 'application/pdf') {
      return <img src={pdfisvg} alt='PDF' className='size-[80px]' />
    }

    if (mimetype && ['image/jpeg', 'image/png', 'image/gif'].includes(mimetype)) {
      return <img src={imagesvg} alt='Image' className='size-[80px]' />
    }

    if (
      mimetype &&
      ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
        mimetype
      )
    ) {
      return <img src={ms_wordsvg} alt='Word' className='size-[80px]' />
    }

    return <FileIcon size={80} className='text-gray-400' />
  }

  const formatDate = (date?: Date | string | null) => (date ? UtilsMetod.formatDate(date, 'dd/MM/yyyy') : '--')

  const handleDownload = () => {
    UtilsMetod.getFileFormApi(file?.storageKey, file?.provider)
      .then(value => {
        if (value) UtilsMetod.download(value, file)
        else toast.error('Aucun fichier associé à ce bon de commande')
      })
      .catch(() => toast.error('Erreur lors de la récupération du fichier'))
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
          <Chip
            label={getMimeLabel(file?.mimetype)}
            size='small'
            variant='outlined'
            color={hasFile ? 'default' : 'warning'}
            className='text-xs'
          />
        </div>

        <Divider />

        <CardContent className='p-3 flex flex-col gap-2'>
          <Typography className='text-center text-blue-900 font-semibold text-sm line-clamp-2'>{bc.label}</Typography>
          <Typography variant='caption' className='text-center text-gray-400 block'>
            {hasFile ? UtilsMetod.formatBytes(file?.size) : `Ajouté le ${formatDate(bc?.createdat)}`}
          </Typography>
          {(bc?.proforma?.numero || bc?.bordereau?.numero) && (
            <div className='flex flex-wrap justify-center gap-1'>
              {bc?.proforma?.numero && (
                <Chip label={bc.proforma.numero} size='small' variant='tonal' color='primary' className='text-xs' />
              )}
              {bc?.bordereau?.numero && (
                <Chip label={bc.bordereau.numero} size='small' variant='tonal' color='warning' className='text-xs' />
              )}
            </div>
          )}
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
              disabled={!hasFile}
              startIcon={<Download size={14} />}
              onClick={handleDownload}
            >
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <DefaultDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} title={bc?.label}>
        {/* Preview */}
        {!hasFile ? (
          <div className='flex flex-col justify-center items-center gap-2 h-40'>
            <FileIcon size={40} className='text-gray-300' />
            <Typography variant='body2' className='text-gray-400'>
              Aucun fichier n&apos;est associé à ce bon de commande.
            </Typography>
          </div>
        ) : isLoading ? (
          <div className='flex justify-center items-center h-40'>
            <CircularProgress size={32} />
          </div>
        ) : presignedurl ? (
          file?.mimetype === 'application/pdf' ? (
            <iframe src={presignedurl} width='100%' height='500px' title={file?.originalName} />
          ) : file?.mimetype?.startsWith('image/') ? (
            <img src={presignedurl} alt={file?.originalName} className='max-w-full max-h-[500px] mx-auto block' />
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
          <MetaRow label='Libellé' value={bc?.label ?? '--'} />
          <MetaRow label='Créé le' value={formatDate(bc?.createdat)} />
          {hasFile ? (
            <>
              <MetaRow label='Nom du fichier' value={file?.originalName ?? '--'} />
              <MetaRow label='Type' value={getMimeLabel(file?.mimetype)} />
              <MetaRow label='Taille' value={UtilsMetod.formatBytes(file?.size)} />
              <MetaRow label='Téléchargé par' value={file?.uploadBy ?? '--'} uppercase />
              <MetaRow label='Mis à jour le' value={formatDate(file?.updatedat)} />
            </>
          ) : (
            <MetaRow label='Fichier' value='Aucun fichier joint' />
          )}
          {bc?.proforma?.numero && <MetaRow label='Proforma' value={bc.proforma.numero} />}
          {bc?.proforma?.reference && <MetaRow label='Référence' value={bc.proforma.reference} />}
          {bc?.bordereau?.numero && <MetaRow label='Bordereau' value={bc.bordereau.numero} />}
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
            disabled={!hasFile || isLoading || !presignedurl}
            onClick={() => {
              if (presignedurl) UtilsMetod.download(presignedurl, file)
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
