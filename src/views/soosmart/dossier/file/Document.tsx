'use client'

import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import { useQuery } from '@tanstack/react-query'


import DocumentsActions from '@views/soosmart/dossier/file/DocumentsActions'
import { DocumentService } from '@/service/document/document.service'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import ErrorView from '@components/ErrorView'
import DefaultDesignFact from '@views/soosmart/dossier/file/DefaultDesignFact'


const DocumentViews = () => {

  const [signed, setSigned] = useState<string>('')
  const [role, setRole] = useState<string>('Directeur')


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
      setSigned(data.signby || '')
    }
  }, [data])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 9, lg: 8 }}>
        {
          isLoading ? (
            <LoadingWithoutModal />
          ) : isError ? (
            <ErrorView />
          ) : data &&
          (
            <DefaultDesignFact docs={data} signe={signed} role={role} />
          )
        }
      </Grid>
      <Grid size={{ xs: 12, md: 3, lg: 4 }} className={'no-print'}>
        <DocumentsActions id_facture={data?.id} UpdateSignature={setSigned} UpdateRole={setRole} paied={data?.paied}
          printFonction={() => DocumentService.generatePdf(data?.numero || '')} signby={data?.signby} role={data?.role} />
      </Grid>
    </Grid>
  )

}

export default DocumentViews
