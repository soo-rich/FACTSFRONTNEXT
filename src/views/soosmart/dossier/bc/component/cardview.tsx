'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'


import { ArrowBigLeftDash, ArrowBigRightDash, CircleX, Download, EyeIcon } from 'lucide-react'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

// Component Imports
import { useQuery } from '@tanstack/react-query'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'




import type { PurchaseOrderType } from '@/types/soosmart/dossier/purchaseOrder.type'
import UtiliMetod from '@/utils/utilsmethod'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import CustomIconButton from '@core/components/mui/IconButton'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'

const CardView = ({ bc, onRemove }: { bc: PurchaseOrderType, onRemove?: () => void }) => {
  const pdfisvg = '/images/svg/pdf.svg'
  const imagesvg = '/images/svg/photo-svgrepo-com.svg'
  const ms_wordsvg = '/images/svg/ms-word-svgrepo-com.svg'

  const [open, setOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  const getimageformMineType = () => {
    if (bc.file.contentType === 'application/pdf') {
      return <img src={pdfisvg} alt={bc.file.filename} className={'is-[150px]'} />

    } else if (bc.file.contentType === 'image/jpeg' || bc.file.contentType === 'image/png' || bc.file.contentType === 'image/gif') {
      return <img src={imagesvg} alt={bc.file.filename} className={'is-[150px]'} />
    } else if (bc.file.contentType === 'application/msword' || bc.file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <img src={ms_wordsvg} alt={bc.file.filename} className={'is-[150px]'} />
    } /*else if (bc.file.contentType==='application/vnd.ms-excel' || bc.file.contentType==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {}*/
  }

  const { data } = useQuery({
    queryKey: [bc.file.filename + '-file'],
    queryFn: async () => {
      return (await UtiliMetod.getFileFormApi(bc.file.uri, bc.file.storageProvider))
    },

  })


  return (
    <>
      <Card className="border rounded bs-full">
        <CardContent className="flex flex-col gap-4 shadow shadow-slate-200/50 p-1">
          <div className={'flex flex-col justify-between  gap-1 bg-gray-200/50 rounded-t-md'}>
            <div className={'flex  justify-end items-end gap-2'}>
              <CustomIconButton onClick={() => onRemove && onRemove()}>
                <CircleX size={20} className="cursor-pointer hover:text-red-700" />
              </CustomIconButton>

            </div>
            <div className={'flex flex-col gap-3 justify-center items-center'}>
              {getimageformMineType()}

              <Typography className={' text-center text-blue-900 font-bold text-wrap'}> {bc.file.filename}</Typography>

            </div>
          </div>
          <div className={'flex flex-row justify-between items-center gap-1 p-2'}>
            <Button variant={'tonal'} size={'small'} className={'rounded-2xl'} startIcon={<EyeIcon />} onClick={() => {
              setOpen(true)
            }}>
              Voir
            </Button>
            <Button variant={'contained'} size={'small'} className={'rounded-2xl'} startIcon={<Download />} onClick={() => {
              if (data)
                UtiliMetod.download(data?.presigned, bc.file)
            }}>
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <DefaultDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} title={bc.file.filename}>

        {
          bc.file.contentType === 'application/pdf' ? (
            <iframe
              src={data?.presigned}
              width="100%"
              height="600px"
              title={bc.file.filename}
            />
          ) :
            bc.file.contentType.startsWith('image/') ?
              (<>
                <img
                  src={data?.presigned}
                  alt={bc.file.filename}
                  style={{ maxWidth: '100%', maxHeight: '600px' }}
                />
              </>)
              : (
                <div className="flex flex-col justify-center items-center p-4">
                  <a href={data?.presigned} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Ouvrir le fichier
                  </a>
                  <p className="mt-2 text-gray-600">Aperçu non disponible pour ce type de fichier.</p>
                </div>
              )
        }
        <div className="grid grid-cols-1 justify-start mt-4">
          <Typography variant='h6' className='text-xl font-bold underline'>Information</Typography>
          <div className="grid grid-cols-2 justify-start mt-4">
            <div><Typography variant='body1'><span className='font-bold'>Nom du fichier :</span> <span className='text-primary'>{bc.file.filename}</span></Typography>
              <Typography variant='body1'><span className='font-bold'>Type de contenu :</span> {bc.file.contentType}</Typography>
              <Typography variant='body1'><span className='font-bold'>Taille du fichier :</span> {UtiliMetod.formatBytes(bc.file.size)}</Typography>
            </div>
            <div>  <Typography variant='body1'><span className='font-bold'>Téléchargé par :</span> <span className='uppercase text-primary'>{bc.file.uploadBy}</span></Typography>
              <Typography variant='body1'><span className='font-bold'>Mis à jour le :</span> {new Date(bc.file.update_at).toLocaleDateString()}</Typography>
              <Typography variant='body1'><span className='font-bold '>Fournisseur de stockage :</span> <span className='uppercase'>{bc.file.storageProvider}</span></Typography>
            </div>
            <div className="col-span-2 mt-4 grid grid-cols-2 gap-2">
              <Button variant='outlined' component={Link} href={getLocalizedUrl(`/docs/${bc.numeroProforma}`, locale as Locale)} startIcon={<ArrowBigLeftDash />}>Proforma</Button>
              <Button variant='outlined' component={Link} href={getLocalizedUrl(`/docs/${bc.numeroBordereau}`, locale as Locale)} startIcon={<ArrowBigRightDash />}>Bordereau</Button>

              <Button variant={'contained'} fullWidth size={'small'} className={'rounded-2xl col-span-2'} startIcon={<Download />} onClick={() => {
                if (data)
                  UtiliMetod.download(data?.presigned, bc.file)
              }}>
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
