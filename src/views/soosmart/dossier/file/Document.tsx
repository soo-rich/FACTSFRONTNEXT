'use client';

import {useParams} from "next/navigation";
import Grid from "@mui/material/Grid2";
import DocumentsActions from "@views/soosmart/dossier/file/DocumentsActions";
import {useQuery} from "@tanstack/react-query";
import {DocumentService} from "@/service/document/document.service";
import {useEffect, useMemo, useState} from "react";
import LoadingWithoutModal from "@components/LoadingWithoutModal";
import ErrorView from "@components/ErrorView";
import DefaultDesignFact from "@views/soosmart/dossier/file/DefaultDesignFact";

const DocumentViews = () => {

  const [signed, setSigned] = useState<string>('');
  const [role, setRole] = useState<string>('Directeur');

  const {numero} = useParams();
  const querykey = useMemo(() => [DocumentService.REPORT_KEY, numero], [DocumentService.REPORT_KEY, numero]);

  const {data, isLoading, isError} = useQuery({
    queryKey: querykey,
    enabled: !!numero,
    queryFn: async () => {
      return await DocumentService.getDocumentDate(numero as string);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  useEffect(() => {
    if (data) {
      setSigned(data.signby || '');
    }
  }, [data]);

  return (
    <Grid container spacing={6}>
      <Grid size={{xs: 12, md: 9}}>
        {
          isLoading ? (
            <LoadingWithoutModal/>
          ) : isError ? (
            <ErrorView/>
          ) : data ?
            (<DefaultDesignFact docs={data} signe={signed} role={role}/>) : null
        }
      </Grid>
      <Grid size={{xs: 12, md: 3}}>
        <DocumentsActions id_facture={data?.id} UpdateSignature={setSigned} UpdateRole={setRole} paied={data?.paied}/>
      </Grid>
    </Grid>
  )

}

export default DocumentViews;
