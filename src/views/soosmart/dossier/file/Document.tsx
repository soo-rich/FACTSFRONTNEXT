'use client'

import { useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'

import { useQuery } from '@tanstack/react-query'


import DocumentsActions from '@views/soosmart/dossier/file/DocumentsActions'
import { DocumentService } from '@/service/document/document.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import DefaultDesignFact from '@views/soosmart/dossier/file/DefaultDesignFact'
import { PDFService } from '@/service/pdf/pdf.service'
import BreadCrumbs from '@/components/pathbreadcrumbs/BreadCrumbs'


const DocumentViews = () => {

  const [signed, setSigned] = useState<string>('')
  const [role, setRole] = useState<string>('Directeur')


  const router = useRouter()

  const { numero } = useParams()
  const querykey = useMemo(() => [DocumentService.REPORT_KEY, numero], [numero])

  const { data, isLoading, isError } = useQuery({
    queryKey: querykey,
    enabled: !!numero,
    queryFn: async () => {
      return await DocumentService.getDocumentDate(numero as string)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })



  useEffect(() => {
    if (data) {
      setSigned(data.signedBy || '')
    }
  }, [data])

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <BreadCrumbs
          path={[
            {
              label: 'Dossier',
              onClick: () => router.back()
            },
            {
              label: 'Documents',
              onClick: () => router.back()
            },
            {
              label: data?.numero || 'Document'
            }
          ]}
          typographyProps={{
            variant: 'h4',
            className: 'text-gray-700',
            sx: { fontWeight: 500 }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 9, lg: 8 }}>
        {isLoading ? (
          <LoadingWithoutModal />
        ) : isError ? (
          <ErrorView />
        ) : (
          data && <DefaultDesignFact docs={data} signe={signed} role={role} />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 3, lg: 4 }} className={'no-print'}>
        <DocumentsActions
          id_facture={data?.numero}
          UpdateSignature={setSigned}
          UpdateRole={setRole}
          paied={data?.paied}
          printFonction={() => PDFService.downloadPdfByNumero(data?.numero || '')}
          signby={data?.signedBy}
          role={data?.role}
        />
      </Grid>
    </Grid>
  )

}

export default DocumentViews
