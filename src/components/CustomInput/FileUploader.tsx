// React Imports
import { useEffect, useMemo, useState } from 'react' // MUI Imports

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography' // Third-party Imports
import type { Accept } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

// MUI Imports
import List from '@mui/material/List'

import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'


// Third-party Imports
import { toast } from 'react-toastify'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Trash2 } from 'lucide-react'

import type { PurchaseOrderSave } from '@/types/soosmart/dossier/purchaseOrder.type'
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'


type FileProp = {
  name: string
  type: string
  size: number
}

type FileUploaderSingleProps = {
  maxFiles?: number
  maxSize?: number
  accept?: Accept
  debounce?: number
  setFile?: (file: File) => void
  controls?: Control<PurchaseOrderSave>
}


export const FileUploaderRestrictions = (props: FileUploaderSingleProps) => {
  const pdfisvg = '/images/svg/pdf.svg';
  const imagesvg = '/images/svg/photo-svgrepo-com.svg'

  // States
  const [files, setFiles] = useState<File[]>([])

  const [filename, setFilename] = useState('')

  const {
    controls: con,

    setFile, debounce = 500, accept = {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }, maxSize = 2000000, maxFiles = 1
  } = props

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFiles,
    maxSize: maxSize,
    accept: accept,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('Vous ne pouvez télécharger que 2 fichiers et leur taille maximale est de 2 Mo.', {
        autoClose: 3000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={imagesvg} />
    } else if (file.type.startsWith('application/pdf')) {
      return <img width={38} height={38} alt={file.name} src={pdfisvg} />
    } else {
      return <i className="tabler-file-description" />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const filtered = files.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }



  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className="file-details w-full">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div className={'w-full'}>
          <div className={'flex flex-row justify-between items-center gap-2 w-full'}>
            <Typography className="file-name">{filename?`${filename}.${file.name.split('.').reverse()[0]}`:file.name}</Typography>
            <Controller
              render={({ field }) => (<CustomTextField autoFocus={true} {...field} onBlur={(e) => setFilename(e.target.value)} />)}
              name={'filename'} control={con} />
          </div>

          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className="tabler-x text-xl" />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const acceptextension = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(accept).map(([key, value]) => {
      return value.map((i: string) => {
        return `*${i}`
      })
    }).join(', ')
  }, [accept])

  useEffect(() => {

      const timeout = setTimeout(() => {
        if (setFile) {
          setFile(files[0])
        }
      }, debounce)

      return () => clearTimeout(timeout)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, debounce])


  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="flex items-center flex-col">
          <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
            <i className="tabler-upload" />
          </Avatar>
          <Typography variant="h4" className="mbe-2.5">
            Déposez vos fichiers ici ou cliquez pour les télécharger.
          </Typography>
          <Typography>Formats autorisés : {acceptextension}</Typography>
          <Typography>Maximum {maxFiles} fichiers et une taille maximale
            de {(Math.round(maxSize / 100) / 10000).toFixed(1)} Mo</Typography>
        </div>
      </div>
      {files.length ? (
        <>
          <List>{fileList}</List>
          {files.length>5&&(<div className="buttons w-full flez flex-row justify-between items-center gap-2">
            <CustomIconButton color="error" variant="outlined" onClick={handleRemoveAllFiles}>
              <Trash2 />
            </CustomIconButton>

          </div>)}
        </>
      ) : null}
    </>
  )
}


export default FileUploaderRestrictions
