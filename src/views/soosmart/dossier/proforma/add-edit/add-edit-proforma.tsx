'use client'

import { useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useMutation, useQueries } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'

import FormControlLabel from '@mui/material/FormControlLabel'

import { createFilterOptions, Radio, RadioGroup } from '@mui/material'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import type { ProformaSaveV2 } from '@/types/soosmart/dossier/proforma.type'
import { schemaProformaV2 } from '@/types/soosmart/dossier/proforma.type'


import { ProformaService } from '@/service/dossier/proforma.service'
import Form from '@components/Form'
import { ClientService } from '@/service/client/client.service'
import { ProjetService } from '@/service/projet/projet.service'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import type { ClientType } from '@/types/soosmart/client.type'
import type { ProjetType } from '@/types/soosmart/projet.type'
import DebouncedInput from '@components/CustomInput/DebounceInput'
import LoadingButton from '@components/button/LoadingButton'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

const filterOptionsClient = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: ClientType) => option.nom || option.lieu
})

const filterOptionsProjet = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: ProjetType) => option.projet_type
})


const AddEditProforma = () => {
  // hook state
  const { create, lang: locale } = useParams()
  const router = useRouter()

  // select state
  const [isClient, setIsClient] = useState<'client' | 'projet'>('client')


  //filter state
  const [clientFilter, setClientFilter] = useState('')
  const [projetFilter, setProjetFilter] = useState('')

  const isEdit = create !== 'create'

  //querykey state
  const queryKeyProforma = useMemo(() => [ProformaService.PROFORMA_KEY, create], [create])
  const querykeyclient = useMemo(() => [ClientService.CLIENT_KEY + clientFilter], [clientFilter])
  const querykeyprojet = useMemo(() => [ProjetService.PROJT_KEY + projetFilter], [projetFilter])


  const response = useQueries({
    queries: [
      {
        enabled: isEdit,
        queryKey: queryKeyProforma,
        queryFn: async () => {
          return await ProformaService.getById(create! as string)
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5 // 5 minutes
      }, {

        queryKey: querykeyclient,
        queryFn: async () => {
          return (await ClientService.getClients({
            search: clientFilter,
            page: 0,
            pagesize: 50
          })).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5 // 5 minutes
      }, {

        queryKey: querykeyprojet,
        queryFn: async () => {
          return (await ProjetService.getAllProjet({
            search: projetFilter,
            page: 0,
            pagesize: 50
          })).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5 // 5 minutes
      }

    ]
  })

  const [{ data: proformas }, { data: clients }, { data: projets }] = response

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProformaSaveV2>({
    resolver: valibotResolver(schemaProformaV2),
    defaultValues: {
      reference: '',

      articleQuantiteslist: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })

  const articlenew = watch('articleQuantiteslist')


  const AddMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      return await ProformaService.PostDataWithArticle(data)
    },
    onSuccess: () => {
      toast.success('Proforma cree')

    },
    onError: error => {
      toast.error('Erreur d\'ajout de la proforma')
      console.error('Error adding proforma:', error)
    }
  })

  const handleSubmitForm = (data: ProformaSaveV2) => {
    AddMutation.mutate(data)
  }

  const handeReset = () => {
    reset({
      reference: '',
      client_id: null,
      projet_id: null,
      articleQuantiteslist: []
    })
    router.push(getLocalizedUrl('/proforma', locale as Locale))
  }

  useEffect(() => {
    if (isEdit && proformas) {
      setValue('reference', proformas.reference)

      if (proformas.client) {
        setValue('client_id', proformas.client.id)

        setIsClient('client')
      }

      if (proformas.projet) {
        setValue('projet_id', proformas.projet.id)
        setIsClient('projet')
      }

      setValue('articleQuantiteslist', proformas.articleQuantites.map(aq => ({
        libelle: aq.article.libelle,
        description: aq.article.description,
        quantite: aq.quantite,
        prix_unitaire: aq.prix_article
      })))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])


  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)} className='w-full'>
      <Typography variant={'h5'}>Information de la Proforma</Typography>
      <div className={'grid grid-cols-1 gap-4'}>
        <Controller
          render={({ field }) => (
            <CustomTextField
              {...field}
              label={'Reference'}
              fullWidth
              error={!!errors.reference}
              {...(errors.reference && {
                error: true,
                helperText: errors?.reference?.message
              })}
            />
          )}
          name={'reference'}
          control={control}
        />

        {!isEdit && (
          <RadioGroup
            row
            name='isClient'
            value={isClient}
            onChange={event => {
              setIsClient((event.target as HTMLInputElement).value as 'client' | 'projet')
            }}
            className={'grid grid-cols-2 gap-4'}
          >
            <div className={'flex flex-col gap-4'}>
              <FormControlLabel value='client' control={<Radio />} label='Client' />

              <Controller
                render={({ field }) => (
                  <CustomAutocomplete
                    disabled={isClient === 'projet'}
                    options={clients || []}
                    fullWidth
                    filterOptions={filterOptionsClient}
                    onChange={(event, newvalue) => {
                      field.onChange(newvalue?.id)
                    }}
                    getOptionLabel={option => option.nom || ''}
                    renderInput={params => (
                      <DebouncedInput
                        {...params}
                        disabled={isClient === 'projet'}
                        onChange={e => {
                          setClientFilter(e || '')
                        }}
                      />
                    )}
                  />
                )}
                name={'client_id'}
                control={control}
              />
            </div>
            <div className={'flex flex-col gap-4'}>
              <FormControlLabel value='projet' control={<Radio />} label='Projet' />

              <Controller
                render={({ field }) => (
                  <CustomAutocomplete
                    disabled={isClient === 'client'}
                    options={projets || []}
                    fullWidth
                    filterOptions={filterOptionsProjet}
                    onChange={(event, newvalue) => {
                      field.onChange(newvalue?.id)
                    }}
                    getOptionLabel={option => option.projet_type || ''}
                    renderInput={params => (
                      <DebouncedInput
                        {...params}
                        disabled={isClient === 'client'}
                        onChange={e => {
                          setProjetFilter(e || '')
                        }}
                      />
                    )}
                  />
                )}
                name={'projet_id'}
                control={control}
              />
            </div>
          </RadioGroup>
        )}

        <div className={'grid grid-cols-3 gap-4'}>
          <div className={'col-span-2'}>
            <Typography variant={'h5'}>Article-Quantite</Typography>
          </div>
          <div className={'grid grid-cols-1 gap-2 max-h-44 overflow-hidden'}></div>
        </div>
      </div>
      <div className={'flex flex-row gap-4 justify-end mt-4'}>
        <LoadingButton loading={AddMutation.isPending} type={'submit'}>
          Ajouter
        </LoadingButton>
        <Button
          disabled={AddMutation.isPending}
          type={'reset'}
          variant={'outlined'}
          color={'secondary'}
          onClick={handeReset}
        >
          Annuler
        </Button>
      </div>
    </Form>
  )

}

export default AddEditProforma



