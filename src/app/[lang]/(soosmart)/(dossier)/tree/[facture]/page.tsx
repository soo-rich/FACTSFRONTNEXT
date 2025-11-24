'use client'
import { useParams } from "next/navigation";

import FileTree from "@views/soosmart/dossier/tree/FileTree";

const FactureTree = () => {
  const { facture } = useParams()


  return <FileTree numero={facture as string} />
}

export default FactureTree
