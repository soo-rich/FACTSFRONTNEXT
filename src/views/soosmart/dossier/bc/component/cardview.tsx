'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import Image from 'next/image'

import { CircleX, Download, EyeIcon } from 'lucide-react'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

// Component Imports
import { useQuery } from '@tanstack/react-query'

import Dialog from '@mui/material/Dialog'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'


import { file } from 'zod'

import type { PurchaseOrderType } from '@/types/soosmart/dossier/purchaseOrder.type'
import UtiliMetod from '@/utils/utilsmethod'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import CustomIconButton from '@core/components/mui/IconButton'

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
    queryKey: [bc.file.filename + '-file'], queryFn: async () => {
      return (await UtiliMetod.getFileFormApi(bc.file.uri, bc.file.storageProvider))
    }
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
            <Button variant={'contained'} size={'small'}  className={'rounded-2xl'} startIcon={<Download />} onClick={() => {
              if (!data) return
              UtiliMetod.download(data, bc.file).then(r => console.log(r))
            }}>
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <></>
      </Dialog>

    </>


  )
}

export default CardView
