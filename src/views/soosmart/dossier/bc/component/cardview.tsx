'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import { CircleX, Download, EyeIcon, FileIcon } from 'lucide-react'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import type { PurchaseOrderType } from '@/types/soosmart/dossier/purchaseOrder.type'
import UtiliMetod from '@/utils/utilsmethod'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import CustomIconButton from '@core/components/mui/IconButton'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'

const CardView = ({ bc, onRemove }: { bc: PurchaseOrderType; onRemove?: () => void }) => {
  const pdfisvg = '/images/svg/pdf.svg'
  const imagesvg = '/images/svg/photo-svgrepo-com.svg'
  const ms_wordsvg = '/images/svg/ms-word-svgrepo-com.svg'

  const [open, setOpen] = useState(false)
  const [presignedurl, setPresignedurl] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const getimageformMineType = () => {
    if (bc.file.mimetype === 'application/pdf') {
      return <iframe src={pdfisvg} className={'is-[150px]'} />
    } else if (
      bc.file.mimetype === 'image/jpeg' ||
      bc.file.mimetype === 'image/png' ||
      bc.file.mimetype === 'image/gif'
    ) {
      return <img src={imagesvg} alt={bc.file.filename} className={'is-[150px]'} />
    } else if (
      bc.file.mimetype === 'application/msword' ||
      bc.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return <img src={ms_wordsvg} alt={bc.file.filename} className={'is-[150px]'} />
    }
  }

  function getFileFormApi() {
    return UtiliMetod.getFileFormApi(bc.file.filename).then(value => {
      setPresignedurl(value)
    })
  }

  useEffect(() => {
    getFileFormApi()
  }, [])

  return (
    <>
      <Card className='border rounded bs-full'>
        <CardContent className='flex flex-col gap-4 shadow shadow-slate-200/50 p-1'>
          <div className={'flex flex-col justify-between  gap-1 bg-gray-200/50 rounded-t-md'}>
            <div className={'flex  justify-end items-end gap-2'}>
              <CustomIconButton onClick={() => onRemove && onRemove()}>
                <CircleX size={20} className='cursor-pointer hover:text-red-700' />
              </CustomIconButton>
            </div>
            <div className={'flex flex-col gap-3 justify-center items-center'}>
              {getimageformMineType()}

              <Typography className={' text-center text-blue-900 font-bold text-wrap'}> {bc.label}</Typography>
            </div>
          </div>
          <div className={'flex flex-row justify-between items-center gap-1 p-2'}>
            <Button
              variant={'tonal'}
              size={'small'}
              className={'rounded-2xl'}
              startIcon={<EyeIcon />}
              onClick={() => {
                setOpen(true)
              }}
            >
              Voir
            </Button>
            <Button
              variant={'contained'}
              size={'small'}
              className={'rounded-2xl'}
              startIcon={<Download />}
              onClick={() => {
                UtiliMetod.getFileFormApi(bc.file.filename)
                  .then(value => {
                    UtiliMetod.download(value, bc.file)
                  })
                  .then(() => {})
              }}
            >
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <DefaultDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} title={bc?.label}>
        {bc.file.mimetype === 'application/pdf' ? (
          <iframe src={presignedurl} width='100%' height='600px' title={bc.file.filename} />
        ) : bc.file.mimetype.startsWith('image/') ? (
          <>
            <img src={presignedurl} alt={bc.file.filename} style={{ maxWidth: '100%', maxHeight: '600px' }} />
          </>
        ) : (
          <div className='flex flex-col justify-center items-center p-4'>
            <a href={presignedurl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
              Ouvrir le fichier
            </a>
            <p className='mt-2 text-gray-600'>Aperçu non disponible pour ce type de fichier.</p>
          </div>
        )}
        <div className='grid grid-cols-1 justify-start mt-4'>
          <Typography variant='h6' className='text-xl font-bold underline'>
            Information
          </Typography>
          <div className='grid grid-cols-2 justify-start mt-4'>
            <div>
              <Typography variant='body1'>
                <span className='font-bold'>Nom du fichier :</span>{' '}
                <span className='text-primary'>{bc.file.originalName}</span>
              </Typography>
              <Typography variant='body1'>
                <span className='font-bold'>Type de contenu :</span> {bc.file.mimetype}
              </Typography>
              <Typography variant='body1'>
                <span className='font-bold'>Taille du fichier :</span> {UtiliMetod.formatBytes(bc.file.size)}
              </Typography>
            </div>
            <div>
              {' '}
              <Typography variant='body1'>
                <span className='font-bold'>Téléchargé par :</span>{' '}
                <span className='uppercase text-primary'>{bc?.file?.uploadBy}</span>
              </Typography>
              <Typography variant='body1'>
                <span className='font-bold'>Mis à jour le :</span> {new Date(bc.file.updatedat).toLocaleDateString()}
              </Typography>
            </div>
            <div className='col-span-2 mt-4 grid grid-cols-2 gap-2'>
              {bc?.proforma?.numero && (
                <Button
                  variant='outlined'
                  component={Link}
                  href={getLocalizedUrl(`/docs/${bc?.proforma?.numero}`, locale as Locale)}
                  startIcon={<FileIcon />}
                >
                  Proforma
                </Button>
              )}
              {bc?.bordereau?.numero && (
                <Button
                  variant='outlined'
                  color={'warning'}
                  component={Link}
                  href={getLocalizedUrl(`/docs/${bc?.bordereau?.numero}`, locale as Locale)}
                  startIcon={<FileIcon />}
                >
                  Bordereau
                </Button>
              )}

              <Button
                variant={'outlined'}
                color={'success'}
                size={'small'}
                startIcon={<Download />}
                onClick={() => {
                  UtiliMetod.download(presignedurl, bc.file).then(() => {})
                }}
              >
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </DefaultDialog>
    </>
  )
}

export default CardView
