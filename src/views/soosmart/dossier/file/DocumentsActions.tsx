'use client'

// React Imports
import {useMemo, useState} from 'react'

// Next Imports
import Link from 'next/link'
import {useParams} from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Type Imports
import type {Locale} from '@configs/i18n'

// Component Imports
// Util Imports
import {getLocalizedUrl} from '@/utils/i18n'
import DebounceInput from "@components/CustomInput/DebounceInput";
import {DocumentTypes} from "@/types/soosmart/dossier/DocumentDTO";

type DocumentsActionsType = {
  id_facture?: string,
  UpdateSignature?: (signature: string) => void
}

const DocumentsActions = ({id_facture, UpdateSignature}: DocumentsActionsType) => {
  // States
  const [signature, setSignature] = useState<string>('')

  // Hooks
  const {lang: locale, numero} = useParams()

  const documenttype = useMemo(() => {
    const nu = (numero as string).substring(0, 2).toUpperCase()
    if (!nu) return null
    switch (nu) {
      case 'FA':
        return DocumentTypes.FACTURE
      case 'FP':
        return DocumentTypes.PROFORMA
      case 'BL':
        return DocumentTypes.BORDERAU
      default:
        return null
    }
  }, [numero])

  return (
    <Grid container spacing={6}>
      <Grid size={{xs: 12}}>
        <Card>
          <CardContent className='flex flex-col gap-4'>
            {
              documenttype === DocumentTypes.FACTURE && id_facture ? (<Button
                fullWidth
                disabled={!documenttype}
                variant='contained'
                className='capitalize'
                startIcon={<i className='tabler-send'/>}
                onClick={() => {
                }}
              >
                {documenttype ? `Payée ${documenttype}  ${numero}` : 'Document non Reconnu '}
              </Button>) : null
            }

            <Button
              fullWidth
              component={Link}
              color='secondary'
              variant='tonal'
              className='capitalize'
              href={getLocalizedUrl('/apps/invoice/preview/4987', locale as Locale)}
            >
              Preview
            </Button>
            <Button fullWidth color='secondary' variant='tonal' className='capitalize'>
              Save
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{xs: 12}}>

        <DebounceInput fullWidth label={`Signer par ${signature} `} value={signature} onChange={(value) => {
          setSignature(value as string)
          if (value && typeof value !== "number" && value?.length > 0) {
            if (UpdateSignature) {
              UpdateSignature(value)
            }
          }
        }} debounce={2000}/>

      </Grid>
    </Grid>
  )
}

export default DocumentsActions
