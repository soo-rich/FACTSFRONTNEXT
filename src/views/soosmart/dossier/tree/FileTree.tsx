'use client'

import {useParams} from "next/navigation";

const FileTree = () =>{
  const {facture} = useParams()

  return <>{facture}</>
}

export default FileTree
