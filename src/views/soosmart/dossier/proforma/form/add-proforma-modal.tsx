import React, { useEffect, useMemo } from 'react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Step, Typography } from '@mui/material'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import { ArrowRightIcon, BriefcaseBusiness, HashIcon, Send, ToyBrick, User2 } from 'lucide-react'

import { valibotResolver } from '@hookform/resolvers/valibot'

import Button from '@mui/material/Button'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'


import type { ProformaSaveV2, ProformaType } from '@/types/soosmart/dossier/proforma.type'
import { schemaProformaV2 } from '@/types/soosmart/dossier/proforma.type'
import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'
import ColorlibConnector from '@views/soosmart/dossier/proforma/form/components/ColorlibConnector'
import ColorlibStepIcon from '@views/soosmart/dossier/proforma/form/components/ColorlibStepIcon'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomVerticalRadioIcon from '@views/soosmart/dossier/proforma/form/components/ProjetorClient'

import { ProformaService } from '@/service/dossier/proforma.service'
import ProjetSelection from '@views/soosmart/dossier/proforma/form/components/ProjetSelection'
import ClientSelection from './components/ClientSelection'
import ArticleInfo from './components/ArticleInfo'
import CustomAvatar from '@/@core/components/mui/Avatar'

import { getInitials } from '@/utils/getInitials'
import Chip from '@/@core/components/mui/Chip'


const AddProformaModal = ({ onCancel, onSuccess, data: proforma }: AddEditFormType<ProformaType>) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [projet, setProjet] = React.useState(false)

  const [articleindex, setArticleIndex] = React.useState<number | null>(null)
  const steps = ['Réference', 'Projet / Client', projet ? 'Projet' : 'Client', 'Articles', 'Validation']


  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<ProformaSaveV2>({
    resolver: valibotResolver(schemaProformaV2),

    defaultValues: {
      articleQuantiteslist: proforma?.articleQuantiteslist.map(item => ({
        libelle: item.article,
        description: item.description,
        prix_unitaire: item.prix_article,
        quantite: item.quantite
      })) ?? [],
      client_id: null,
      projet_id: null,
      reference: ''
    }
  })


  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })


  const AddMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      return await ProformaService.PostDataWithArticle(data)
    },
    onSuccess: (data) => {
      toast.success(`Proforma ${data?.numero} crée avec succès `)
      onSuccess?.()
      handleReset()
    },
    onError: error => {
      toast.error('Erreur d\'ajout de la proforma')
      console.error('Error adding proforma:', error)
    }
  })

  const EditMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      if (proforma == null) return

      return await ProformaService.Updatedata(proforma?.id, data)
    },
    onSuccess: (data) => {
      toast.success(`Proforma ${data?.numero} mise à joure avec succès `)
      onSuccess?.()
      handleReset()
    },
    onError: error => {
      toast.error(`Erreur de la mise a jour de la proforma ${proforma?.numero}`)
      console.error('Error adding proforma:', error)
    }
  })


  const handleSubmitForm = (data: ProformaSaveV2) => {
    if (proforma) {
      EditMutation.mutate(data)
    } else {
      AddMutation.mutate(data)
    }


  }



  const handleListItemClick = (index: number) => {
    setArticleIndex(index)
  }

  const articleSelectToUpdate = useMemo(() => {

    if (articleindex !== null) {
      return fields.find((_, index) => index === articleindex) || null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleindex])




  const step: { [key: number]: JSX.Element } = {
    1: (<Controller render={({ field }) => (
      <CustomTextField
        {...field}
        label={'Reference'}
        fullWidth
        error={!!errors?.reference}
        {...(errors?.reference && {
          error: true,
          helperText: errors?.reference?.message
        })}
      />
    )} name={'reference'} control={control} />),
    2: (<CustomVerticalRadioIcon handleChange={setProjet} state={projet} />),
    3: projet
      ? <Controller render={({ field }) => (<ProjetSelection change={field.onChange} value={getValues('projet_id')} />)} name={'projet_id'} control={control} />
      : <Controller render={({ field }) => (<ClientSelection change={field.onChange} value={field.value} />)} name={'client_id'} control={control} />,
    4: (<div className={'border-2 border-gray-300 p-4 rounded-md p-1 flex  gap-4'}>
      <div className="w-3/5 border-r pr-4">
        <ArticleInfo
          onUpdate={data => { articleindex ? update(articleindex, data) : null }}
          onAppend={(data) => {
            append(data)
          }}
          onCancel={() => setArticleIndex(null)}
          initaldata={articleSelectToUpdate}
        />
      </div>

      <div className='w-2/5 overflow-y-auto max-h-[50dvh]'>
        <List className='space-y-2' >
          {fields.map((item, index) => (
            <ListItem
              className='border border-primary rounded-md'
              key={item.id}
              disablePadding
              secondaryAction={
                <IconButton edge='end' size='small' onClick={() => remove(index)}>
                  <i className='tabler-trash text-red-500' />
                </IconButton>
              }
            >
              <ListItemButton selected={articleindex === index} onClick={() => handleListItemClick(index)}>
                <ListItemAvatar>
                  <CustomAvatar alt='Caroline Black' >
                    {getInitials(item.libelle)}
                  </CustomAvatar>
                </ListItemAvatar>
                <ListItemText primary={item.libelle} secondary={`Prix: ${item.prix_unitaire} Fcfa x ${item.quantite}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>),
    5: (<div className="flex flex-col gap-4 border border-gray-300 p-4 rounded-md">

      <div className='grid grid-cols-2  gap-4 '>
        <div className='flex-1 border border-primary flex flex-row gap-4 p-1 rounded-md'>
          <CustomAvatar>
            <HashIcon size={24} />
          </CustomAvatar>
          <Typography variant='h6' className='flex items-center'>{getValues('reference')}</Typography>
        </div>
        <div className='flex-1 border border-primary flex flex-row gap-4 p-1 rounded-md'>
          <CustomAvatar>
            {
              projet ? (<BriefcaseBusiness />) : (<User2 />)
            }
          </CustomAvatar>
          <Typography variant='h6' className='flex items-center'>{`Choix porter sur ${projet ? 'un Projet' : ' un Client'}`}</Typography>

        </div>
      </div>

      <div className='flex-1 border border-primary flex flex-row gap-4 p-1 rounded-md'>
        <CustomAvatar>
          <ToyBrick size={24} />
        </CustomAvatar>
        <div className='flex flex-col flex-1'>
          {/* eviter de depasse la limite */}
          <div className='grid grid-cols-4 gap-4 border-2 p-2 mb-2'>
            {
              fields.slice(0, 12).map((item, index) => (
                <Chip key={item.id} label={item.libelle} onDelete={() => remove(index)} />
              ))
            }
          </div>

          <Typography className='text-2xl font-bold'>{`Total => ${fields.reduce((acc, item) => acc + item.prix_unitaire * item.quantite, 0)} Fcfa`}</Typography>

        </div>
      </div>
    </div>)
  }

  const handleReset = () => {
    reset()
    onCancel?.()
  }

  useEffect(() => {
    if (proforma) {
      // reset({
      //   reference: proforma.reference,
      //   articleQuantiteslist: proforma.articleQuantiteslist.map(item => ({
      //     libelle: item.article,
      //     description: item.description,
      //     prix_unitaire: item.prix_article,
      //     quantite: item.quantite
      //   }))
      // })
      setValue('reference', proforma.reference)

      setValue('articleQuantiteslist', proforma.articleQuantiteslist.map(item => ({
        libelle: item.article,
        description: item.description,
        prix_unitaire: item.prix_article,
        quantite: item.quantite
      })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proforma])

  const handleChangeStep = (action: 'next' | 'back') => {
    if (action === 'next') {

      if (activeStep === steps.length - 1) {
        return
      }

      if (proforma) {
        if ([1, 2].includes(activeStep + 1)) {
          setActiveStep(3)
        } else { setActiveStep(Math.min(4, activeStep + 1)) }
      } else { setActiveStep(Math.min(4, activeStep + 1)) }

    } else {
      if (activeStep === 0) {
        return
      }

      if (proforma) {
        if ([1, 2].includes(activeStep - 1)) {
          setActiveStep(0)
        } else { setActiveStep(Math.max(0, activeStep - 1)) }

      } else { setActiveStep(Math.max(0, activeStep - 1)) }
    }
  }



  return (
    <form noValidate className="w-full h-full p-8" onSubmit={handleSubmit(handleSubmitForm)}>
      <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className='w-full'>
          {step[activeStep + 1]}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            onClick={() => handleChangeStep('back')}
            disabled={activeStep === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Précédent
          </Button>
          {steps.length - 1 === activeStep ? (<Button


            type={'submit'}
            endIcon={steps.length - 1 === activeStep ? <Send size={24} /> : <ArrowRightIcon size={24} />}
            onClick={() => handleChangeStep('next')}

            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {steps.length - 1 === activeStep ? 'Soumettre' : 'Suivant'}
          </Button>) :
            (<Button

              type={'button'}
              endIcon={steps.length - 1 === activeStep ? <Send size={24} /> : <ArrowRightIcon size={24} />}
              onClick={() => handleChangeStep('next')}

              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {steps.length - 1 === activeStep ? 'Soumettre' : 'Suivant'}
            </Button>)}
        </div>

      </Stack>
    </form>
  )
}

export default AddProformaModal
