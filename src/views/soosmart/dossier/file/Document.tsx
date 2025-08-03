'use client';

import {useParams} from "next/navigation";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import DocumentsActions from "@views/soosmart/dossier/file/DocumentsActions";
import {useQuery} from "@tanstack/react-query";
import {DocumentService} from "@/service/document/document.service";
import {useMemo, useState} from "react";
import LoadingWithoutModal from "@components/LoadingWithoutModal";
import ErrorView from "@components/ErrorView";

const DocumentViews = () => {
  const [signed, setSigned] = useState<string>('');

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

  return (
    <Grid container spacing={6}>
      <Grid size={{xs: 12, md: 9}}>
        {
          isLoading ? (
            <LoadingWithoutModal/>
          ) : isError ? (
              <ErrorView/>
            ) :
            (<>{JSON.stringify(data)}</>)

        }
        <Typography>{numero}</Typography>
      </Grid>
      <Grid size={{xs: 12, md: 3}}>
        <DocumentsActions id_facture={data?.id} UpdateSignature={setSigned}/>
      </Grid>
    </Grid>
  )

}

export default DocumentViews;
