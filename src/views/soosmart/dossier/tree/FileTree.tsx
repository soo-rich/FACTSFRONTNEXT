'use client'

import { useMemo } from "react";


import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { Button, Link, Typography } from "@mui/material";

import { ArrowLeft } from "lucide-react";

import { FactureService } from "@/service/dossier/facture.service";
import LoadingWithoutModal from "@/components/LoadingWithoutModal";
import ErrorView from "@/components/ErrorView";
import TreeScene from "./components/TreeScene";
import { getLocalizedUrl } from "@/utils/i18n";
import type { Locale } from "@/configs/i18n";


const FileTree = ({ numero }: { numero: string }) => {
  // hooks
  const { lang: locale } = useParams()

  const querykey = useMemo(() => [FactureService.FACTURE_KEY, numero, 'tree'], [numero])

  const { data, isError, isLoading } = useQuery({
    queryKey: querykey,
    queryFn: async () => (await FactureService.getThree(numero)),
    enabled: !!numero
  })

  return isLoading
    ? (<LoadingWithoutModal />)
    : isError
      ? (<ErrorView />)
      : data && (<div className="grid grid-cols-1 gap-2">
        <div className="flex justify-start">
          <Typography variant="caption">Arborescence de la facture {numero}</Typography>
          <Button component={Link} href={getLocalizedUrl('/facture', locale as Locale)} variant="outlined" className="ml-4" startIcon={<ArrowLeft />}>
            Factures
          </Button>
        </div>
        <div className="h-[60dvh] border border-gray-300 rounded-md">
          <TreeScene tree={data} />
        </div>

      </div>)
}

export default FileTree
