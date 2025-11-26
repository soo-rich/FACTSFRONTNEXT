'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Type Imports
// Component Imports
// Util Imports
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import DebounceInput from '@components/CustomInput/DebounceInput'
import { DocumentTypes } from '@/types/soosmart/dossier/DocumentDTO'
import { DocumentService } from '@/service/document/document.service'
import { FactureService } from '@/service/dossier/facture.service'


type DocumentsActionsType = {
  id_facture?: string,
  paied?: boolean,
  signby?: string,
  role?: string,
  UpdateSignature?: (signature: string) => void
  UpdateRole?: (role: string) => void
  printFonction?: () => void
}

const DocumentsActions = ({ id_facture, UpdateSignature, UpdateRole, paied, printFonction, signby, role }: DocumentsActionsType) => {
  // States
  const [signature, setSignature] = useState<string>(signby || '')
  const [signaturerole, setSignatureRole] = useState<string>(role || '')
  const [isSigning, setIsSigning] = useState<boolean>(false)

  // Hooks
  const { numero } = useParams()
  const queryClient = useQueryClient()

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

  const SignatureMutation = useMutation({
    mutationFn: async ({ signature, signaturerole }: { signature: string, signaturerole: string }) => {
      return await DocumentService.signDocument(numero as string, signature, signaturerole)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [DocumentService.REPORT_KEY, numero]
      })

      if (data) {
        toast('Document signé avec succès', {
          type: 'success',
          autoClose: 3000,
          hideProgressBar: false
        })
      }

      console.log('Document signed successfully', data)
    },
    onError: () => {
      toast('Erreur lors de la signature du document', {
        type: 'error',
        autoClose: 3000,
        hideProgressBar: false
      })
      console.error('Error signing document')
    }
  })

  const PayMutation = useMutation({
    mutationFn: async () => {
      if (!id_facture) throw new Error('ID Facture is required')

      return await FactureService.paid(id_facture)
    },
    onSuccess: (data) => {
      if (!data) {
        toast('Paiement non Aboutie', {
          type: 'warning',
          autoClose: 3000,
          hideProgressBar: false
        })

        return
      }

      queryClient.invalidateQueries({
        queryKey: [DocumentService.REPORT_KEY, numero]
      })
      toast('Facture payée avec succès', {
        type: 'success',
        autoClose: 3000,
        hideProgressBar: false
      })
      console.log('Facture paid successfully', data)
    },
    onError: () => {
      toast('Erreur lors du paiement de la facture', {
        type: 'error',
        autoClose: 3000,
        hideProgressBar: false
      })
      console.error('Error paying facture')
    }
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      UpdateSignature && UpdateSignature(signature)
      UpdateRole && UpdateRole(signaturerole)
      SignatureMutation.mutate({ signature, signaturerole })
    }, 1000)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSigning])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className="flex flex-col gap-4">
            {
              documenttype === DocumentTypes.FACTURE && id_facture ? (<Button
                fullWidth
                disabled={paied}
                variant="contained"
                className="capitalize"
                startIcon={<i className="tabler-send" />}
                onClick={() => PayMutation.mutate()}
              >
                {documenttype ? `Payée ${documenttype}  ${numero}` : 'Document non Reconnu '}
              </Button>) : null
            }

            <Button
              fullWidth
              color="secondary"
              variant="tonal"
              className="capitalize"
              onClick={() => {
                if (printFonction) {
                  printFonction()
                }
              }}
            >
              Telecharger le {documenttype ? `${documenttype}  ${numero}` : 'Document non Reconnu '}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        {
          documenttype !== DocumentTypes.BORDERAU ? (<Grid container spacing={6}>
            <DebounceInput onBlur={() => setIsSigning(!isSigning)} fullWidth label={`Signer par ${signature} `} value={signature} onChange={(value) => {
              if (value && typeof value !== 'number' && value?.length > 0) {
                setSignature(value as string)

                if (UpdateSignature) {
                  UpdateSignature(value)
                }
              }
            }} debounce={2000} />
            <DebounceInput onBlur={() => setIsSigning(!isSigning)} fullWidth label={`Role`} value={signaturerole} onChange={(value) => {
              if (value && typeof value !== 'number' && value?.length > 0) {
                setSignatureRole(value as string)

                if (UpdateRole) {
                  UpdateRole(value)
                }

              }
            }} />
          </Grid>
          ) : null
        }
      </Grid>
    </Grid>
  )
}

export default DocumentsActions
