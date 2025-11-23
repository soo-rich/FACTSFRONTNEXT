'use client'


import type { SyntheticEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Checkbox, createFilterOptions, FormControlLabel, Grid2 } from '@mui/material'

import Button from '@mui/material/Button'


import { toast } from 'react-toastify'

import CardContent from '@mui/material/CardContent'

import Card from '@mui/material/Card'

import type { ProformaSaveV2, ProformaType } from '@/types/soosmart/dossier/proforma.type'
import { schemaProformaV2 } from '@/types/soosmart/dossier/proforma.type'

import { ProformaService } from '@/service/dossier/proforma.service'

import CustomTextField from '@core/components/mui/TextField'

import { ClientService } from '@/service/client/client.service'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import { ProjetService } from '@/service/projet/projet.service'
import type { ClientType } from '@/types/soosmart/client.type'
import type { ProjetType } from '@/types/soosmart/projet.type'
import DefaultDialog from '@components/dialogs/unique-modal/DefaultDialog'
import AddEditProjet from '@views/soosmart/projet/add-edit-projet'
import AddEditClient from '@views/soosmart/client/add-edit-client'

import AddArticle from '@views/soosmart/dossier/proforma/component/add-article'


type Props = {
  open: boolean
  handleClose: () => void
  onSucces?: () => void
  data?: ProformaType
}

const AddProforma = ({ open, handleClose, onSucces, data: p }: Props) => {
  const [isModalOpenClient, setIsModalOpenClient] = useState<boolean>(false)
  const [isModalOpenProjet, setIsModalOpenProjet] = useState<boolean>(false)
  const [isModalOpenArticle, setIsModalOpenArticle] = useState<boolean>(false)
  const [projetSelect, setProjetSelect] = useState<ProjetType | null>(null)
  const [clientSelect, setClientSelect] = useState<ClientType | null>(null)
  const [choixclient, setchoixclient] = useState<boolean>(false)
  const queryClient = useQueryClient()


  const querykeyclient = useMemo(() => [ClientService.CLIENT_KEY + '+all'], [])
  const querykeyprojet = useMemo(() => [ProjetService.PROJT_KEY + '+all'], [])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue: setValues,
    watch
  } = useForm<ProformaSaveV2>({
    resolver: valibotResolver(schemaProformaV2),
    defaultValues: {
      reference: p?.reference ?? '',

      articleQuantiteslist: p?.articleQuantiteslist.map(item => ({
        libelle: item.article,
        description: item.description,
        prix_unitaire: item.prix_article,
        quantite: item.quantite
      }))
    }
  })

  const articlenew = watch('articleQuantiteslist')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })


  const { data: client } = useQuery({
    queryKey: querykeyclient,
    queryFn: async () => {
      return await ClientService.getClientsAll()
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: projet } = useQuery({
    queryKey: querykeyprojet,
    queryFn: async () => {
      return await ProjetService.getAll()
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })


  const AddMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      return await ProformaService.PostDataWithArticle(data)
    },
    onSuccess: () => {
      toast.success('Proforma cree')
      onSucces?.()
      handleReset()
    },
    onError: error => {
      toast.error('Erreur d\'ajout de la proforma')
      console.error('Error adding proforma:', error)
    }
  })

  const EditMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      if (p)

        return await ProformaService.Updatedata(p?.id, data)
    },
    onSuccess: () => {
      toast.success('Proforma cree')
      onSucces?.()
      handleReset()
    },
    onError: error => {
      toast.error(`Erreur de la mise a jour de la proforma ${p?.numero}`)
      console.error('Error adding proforma:', error)
    }
  })

  const SubmitData = (data: ProformaSaveV2) => {


    data.articleQuantiteslist = [...data.articleQuantiteslist, ...articlenew]

    if (p) {
      EditMutation.mutate(data)
    } else {
      AddMutation.mutate(data)
    }

  }

  const handleAddClient = async (data: ClientType) => {
    await queryClient.invalidateQueries({
      queryKey: querykeyclient
    })
    setClientSelect(data)
    setIsModalOpenClient(false)
    setValues('client_id', data.id)
  }

  const handleSelectProjet = (event: SyntheticEvent, newValue: ProjetType | null) => {
    setProjetSelect(newValue)
  }


  const handleAddProjet = async (data: ProjetType) => {
    await queryClient.invalidateQueries({
      queryKey: querykeyprojet
    })
    setProjetSelect(data)
    setIsModalOpenProjet(false)
    setValues('projet_id', data.id)

  }

  const handleSelectClient = (event: SyntheticEvent, newValue: ClientType | null) => {
    setClientSelect(newValue)
  }


  const handleReset = () => {
    handleClose();
    reset({
      reference: '',
      projet_id: '',
      client_id: '',
      articleQuantiteslist: []
    });
  }

  useEffect(
    () => {
      if (choixclient) {
        setProjetSelect(null)
        clientSelect ? setValues('client_id', clientSelect.id) : null
      } else {
        setClientSelect(null)
        projetSelect ? setValues('projet_id', projetSelect.id) : null
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientSelect, projetSelect, choixclient]
  )

  const filterOptionsClient = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: ClientType) => option.nom || option.lieu
  })

  const filterOptionsProjet = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: ProjetType) => option.projet_type
  })


  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant={'temporary'}
        onClose={handleReset}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 550 } } }}
      >
        <div className="flex items-center justify-between plb-5 pli-6">
          <Typography variant="h5">Construire un Proforma {p&&`à partir de ${p.numero}`}</Typography>
          <IconButton size="small" onClick={handleReset}>
            <i className="tabler-x text-2xl text-textPrimary" />
          </IconButton>
        </div>
        <Divider />
        <div className="p-6">
          <form noValidate onSubmit={handleSubmit(SubmitData)} className="flex flex-col items-start gap-6">
            <Typography variant={'h5'}>Information de la Proforma</Typography>
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
            {!p && (<><Grid2
              container
              size={12}
              direction={'row'}
              spacing={3}
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >

              <FormControlLabel
                label="(Oui: client / Nom : projet )"
                control={<Checkbox checked={choixclient}
                                   onChange={(e) => setchoixclient(e.target.checked)}
                                   name="controlled" />}
              />
            </Grid2>
              <div
                className="w-full flex flex-row justify-between align-middle items-end place-content-center gap-4">
                {choixclient ? (
                    <CustomAutocomplete

                      options={client || []}
                      fullWidth

                      filterOptions={filterOptionsClient}
                      onChange={handleSelectClient}
                      getOptionLabel={option => option.nom || ''}

                      renderInput={params => <CustomTextField {...params} label="Choix du Client" />}
                    />
                  ) :
                  (
                    <CustomAutocomplete
                      options={projet || []}
                      fullWidth
                      filterOptions={filterOptionsProjet}
                      onChange={handleSelectProjet}
                      getOptionLabel={option => option.projet_type || ''}

                      renderInput={params => <CustomTextField {...params} label="Choix du Projet " />}
                    />
                  )}
                <Button variant={'contained'} color={'inherit'} endIcon={<i className="tabler-plus" />}
                        onClick={() => {
                          if (choixclient) {
                            setIsModalOpenClient(true)
                          } else {
                            setIsModalOpenProjet(true)
                          }
                        }}>
                  {choixclient ? 'Client' : 'Projet'}
                </Button>
              </div>
            </>)
            }

            <Divider className="w-full" />
            <Typography variant={'h5'}>Article-Quantite</Typography>

            <div className={'flex flex-row justify-between item-end align-baseline w-full'}>

              <Button
                variant="contained"
                color="primary"
                startIcon={<i className={'tabler-plus text-2xl'} />}
                onClick={() =>
                  setIsModalOpenArticle(true)
                }
              >
                Ajouter des Articles
              </Button>
            </div>
            <div className={'flex flex-col justify-center align-baseline w-full gap-6'}>
              {
                fields.map((item, index) => (

                  <Card key={index}>
                    <CardContent className={'relative flex flex-col justify-center align-baseline w-full gap-6'}>

                      <IconButton
                        className={'absolute -top-px -right-px'}
                        color="error"
                        onClick={() => {
                          remove(index)
                        }}
                        disabled={AddMutation.isPending}
                      >
                        <i className="tabler-trash text-2xl" />
                      </IconButton>

                      <Grid2 container spacing={2} sx={{
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                      }}>
                        <Grid2 size={12}>
                          <Controller
                            render={({ field }) => (
                              <CustomTextField {...field} label={'Article'}
                                               fullWidth error={!!errors.articleQuantiteslist?.[index]?.libelle}
                                               {...(errors.articleQuantiteslist?.[index]?.libelle && {
                                                 error: true,
                                                 helperText: errors?.articleQuantiteslist?.[index]?.libelle?.message
                                               })} />)}
                            name={`articleQuantiteslist.${index}.libelle`}
                            control={control}
                          />
                        </Grid2>
                        <Grid2 size={6}>
                          <Controller
                            render={({ field }) => (
                              <CustomTextField {...field}
                                               label={'Prix'}
                                               fullWidth
                                               onChange={(e) => {
                                                 const value = Number(e.target.value)

                                                 field.onChange(isNaN(value) ? null : value)
                                               }}
                                               error={!!errors.articleQuantiteslist?.[index]?.prix_unitaire}
                                               {...(errors.articleQuantiteslist?.[index]?.prix_unitaire && {
                                                 error: true,
                                                 helperText: errors?.articleQuantiteslist?.[index]?.prix_unitaire?.message
                                               })} />)}
                            name={`articleQuantiteslist.${index}.prix_unitaire`}
                            control={control}
                          />
                        </Grid2>
                        <Grid2 size={6}>
                          <Controller
                            render={({ field }) => (
                              <CustomTextField {...field} type={'number'} label={'Quantité'}
                                               fullWidth
                                               onChange={(e) => {
                                                 const value = Number(e.target.value)

                                                 field.onChange(isNaN(value) ? null : value)
                                               }}
                                               error={!!errors.articleQuantiteslist?.[index]?.quantite}
                                               {...(errors.articleQuantiteslist?.[index]?.quantite && {
                                                 error: true,
                                                 helperText: errors?.articleQuantiteslist?.[index]?.quantite?.message
                                               })}
                              />)}
                            name={`articleQuantiteslist.${index}.quantite`}
                            control={control}
                          />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </Card>

                ))
              }
            </div>

            <Divider className="w-full" />


            <div className="w-full flex items-center gap-4">
              <Button variant="contained" color="primary" type="submit" disabled={AddMutation.isPending}>
                {AddMutation.isPending ? 'Traitement...' : 'Ajouter'}
              </Button>
              <Button variant="outlined" color="error" onClick={handleReset}
                      disabled={AddMutation.isPending}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
      <DefaultDialog
        open={isModalOpenProjet}
        setOpen={setIsModalOpenProjet}
        onClose={() => setIsModalOpenProjet(false)}
        title={'Ajouter un Projet'}
      >
        <AddEditProjet onSuccess={(data) => {
          setIsModalOpenProjet(false)
          const array = Array.isArray(data)

          if (!array && data) {
            handleAddProjet(data)
          }
        }} />

      </DefaultDialog>

      <DefaultDialog
        open={isModalOpenClient}
        setOpen={setIsModalOpenClient}
        onClose={() => setIsModalOpenClient(false)}
        title={'Ajouter un Client'}
      >
        <AddEditClient onSuccess={(data) => {
          setIsModalOpenProjet(false)
          const array = Array.isArray(data)

          if (!array && data) {
            handleAddClient(data)
          }
        }} />

      </DefaultDialog>
      <DefaultDialog open={isModalOpenArticle} setOpen={setIsModalOpenArticle} dialogMaxWidth={'md'}>
        <AddArticle
          onSuccess={(data) => {
            append(data)

            // setArticleNew(prevState => [...prevState, ...data])
            setIsModalOpenArticle(false)
          }}
        />
      </DefaultDialog>

    </>

  )
}

export default AddProforma
