// React Imports
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import type { ButtonProps } from '@mui/material/Button'
import { Button } from '@mui/material'

// Third-party Imports
import type { Accept } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

// Third-party Imports
import { toast } from 'react-toastify'

import classnames from 'classnames'

import LinearProgress from '@mui/material/LinearProgress'

import CustomIconButton from '@core/components/mui/IconButton'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

type FileProp = {
  name: string
  type: string
  size: number
}
type FileCardUploadProp = {
  icon?: string | ReactNode
  label?: string | ReactNode
  showRequirement?: boolean
}

type FileUploaderSingleProps = {
  button?: boolean
  showPreview?: boolean
  maxFiles?: number
  maxSize?: number
  accept?: Accept
  debounce?: number
  setFile?: (file: File[]) => void
  buttonProps?: ButtonProps & { buttontext?: string }
  card?: FileCardUploadProp
  error?: boolean
  helperText?: string
}

const CustomFileUploaderRestrictions = (props: FileUploaderSingleProps) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  const {
    button,
    showPreview = true,
    setFile,
    debounce = 500,
    accept = {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize = 2000000,
    maxFiles = 1,
    buttonProps = {
      buttontext: 'Uploader',
      component: 'label',
      variant: 'tonal',
      size: 'small',
      children: 'Uploader',
      color: 'primary',
      role: undefined,
      tabIndex: -1,
      startIcon: <i className={'tabler-plus'} />
    },
    card
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
      toast.error(
        `Vous ne pouvez télécharger que ${maxFiles} fichiers et leur taille maximale est de ${maxSize / 1000000} Mo.`,
        {
          autoClose: 3000
        }
      )
    }
  })

 /* const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <span title={file.name} className={'icon-[mynaui--image-solid]'} />
    } else if (file.type.startsWith('application/pdf')) {
      return <span title={file.name} className={'icon-[bi--file-earmark-pdf-fill] text-red-600'} />
    } else {
      return <i className='tabler-file-description' />
    }
  }
*/
  const handleRemoveFile = (file: FileProp) => {
    const filtered = files.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className={'border-2 border-borderBase rounded-md p-4 mt-2 flex flex-wrap gap-2 flex-1'}>
        <span className={'icon-[mynaui--image]'} style={{ fontSize: '5rem' }} />
        <div className={'flex-1'}>
          <div className={'flex flex-row justify-between items-center'}>
            <Typography variant={'h6'}>{file.name}</Typography>
            <CustomIconButton
              onClick={() => {
                handleRemoveFile(file)
              }}
            >
              <span className={'icon-[oui--cross] text-primary'} />
            </CustomIconButton>
          </div>
          <Typography variant={'caption'} className={'text-secondary mb-2'}>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
          <LinearProgress className={'mt-1'} variant='determinate' value={100} />
        </div>
      </div>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const acceptextension = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(accept)
      .map(([, value]) => {
        return value.map((i: string) => {
          return `*${i}`
        })
      })
      .join(', ')
  }, [accept])

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        if (setFile) {
          setFile(files)
        }
      }, debounce)

      return () => clearTimeout(timeout)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, debounce]
  )

  return (
    <>
      {button ? (
        <Button {...buttonProps} {...(props.error && { color: 'error' })}>
          {buttonProps.children || buttonProps.buttontext || 'Uploader'}
          <VisuallyHiddenInput type='file' {...getInputProps()} multiple />
        </Button>
      ) : (
        files.length < maxFiles && (
          <div className='grid grid-cols-1 gap-2'>
            <div
              {...getRootProps({
                className: classnames(
                  'dropzone border-2 border-dashed py-8 rounded-lg bg-gray-50',
                  props.error ? 'border-red-600' : ''
                )
              })}
            >
              <input {...getInputProps()} />
              <div className='flex items-center flex-col'>
                <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                  <i className='tabler-upload' />
                </Avatar>
                {card?.label ? (
                  card?.label
                ) : (
                  <Typography variant='h4' className='mbe-2.5'>
                    Déposez vos fichiers ici ou cliquez pour les télécharger.
                  </Typography>
                )}
                {card?.showRequirement && (
                  <>
                    <Typography>Formats autorisés : {acceptextension}</Typography>
                    <Typography>
                      Maximum {maxFiles} fichiers et une taille maximale de{' '}
                      {(Math.round(maxSize / 100) / 10000).toFixed(1)} Mo
                    </Typography>
                  </>
                )}
              </div>
            </div>
            {props.error && <Typography className={'text-error'}>{props.helperText}</Typography>}
          </div>
        )
      )}
      {showPreview && files.length ? (
        <>
          <List>{fileList}</List>
          {files.length > 5 && (
            <div className='buttons w-full flez flex-row justify-between items-center gap-2'>
              <CustomIconButton color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                <span className={'tabler-trash text-red-400 hover:text-red-600'} />
              </CustomIconButton>
            </div>
          )}
        </>
      ) : null}
    </>
  )
}

export default CustomFileUploaderRestrictions
