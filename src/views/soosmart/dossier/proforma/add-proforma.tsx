'use client'

import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useMutation, useQuery } from '@tanstack/react-query'

import { FormControlLabel, Grid2, RadioGroup } from '@mui/material'

import Button from '@mui/material/Button'

import Radio from '@mui/material/Radio'

import { toast } from 'react-toastify'

import type { ProformaSave } from '@/types/soosmart/dossier/proforma.type'
import { schemaProforma } from '@/types/soosmart/dossier/proforma.type'


import { ProformaService } from '@/service/dossier/proforma.service'
import { ArticleService } from '@/service/article/article.service'


import CustomTextField from '@core/components/mui/TextField'


import { ClientService } from '@/service/client/client.service'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import { ProjetService } from '@/service/projet/projet.service'


type Props = {
  open: boolean
  handleClose: () => void,
  onSucces?: () => void
}

const AddProforma = (
  { open, handleClose, onSucces }: Props
) => {

  const [value, setValue] = useState<string>('projet')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
    const v = (event.target as HTMLInputElement).value

    if (v === 'projet') {
      setClientOrProjet(false)
    } else {
      setClientOrProjet(true)
    }
  }

  const [articleSelect, setArticleSelect] = useState<string[]>([])
  const [clientName, setClientName] = useState<string>('')
  const [projetName, setProjetName] = useState<string>('')
  const [clientorprojet, setClientOrProjet] = useState<boolean>(false)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ProformaSave>({
    resolver: valibotResolver(schemaProforma),
    defaultValues: {
      reference: '',
      projet_id: '',
      client_id: '',
      articleQuantiteslist: [
        {
          article_id: '',
          quantite: 0,
          prix_article: 0
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })

  const { data: articleList } = useQuery({
    queryKey: ['articlelist'],
    queryFn: async () => {
      return await ArticleService.searchArticles()
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: client } = useQuery({
    queryKey: ['clientlist', clientName],
    queryFn: async () => {
      return await ClientService.getClientsByNom(clientName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: projet } = useQuery({
    queryKey: ['projetlist', projetName],
    queryFn: async () => {
      return await ProjetService.searchProjet(projetName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const article = useMemo(() => {
    // retire les articles déjà sélectionnés
    return articleList?.filter(item => !articleSelect.includes(item.id)) || []
  }, [articleList, articleSelect])


  const AddMutation = useMutation(
    {
      mutationFn: async (data: ProformaSave) => {
        return await ProformaService.PostData(data)
      },
      onSuccess: () => {
        toast.success('Proforma cree')
        onSucces?.()
        reset(
          {
            reference: '',
            projet_id: '',
            client_id: '',
            articleQuantiteslist: [
              {
                article_id: '',
                quantite: 0,
                prix_article: 0
              }
            ]
          }
        )
        handleClose()

      },
      onError: (error) => {
        toast.error('Erreur d\'ajout de la proforma')
        console.error('Error adding proforma:', error)
      }
    }
  )

  const SubmitData = (data: ProformaSave) => {
    // console.log(data)
    AddMutation.mutate(data)
  }


  const handleReset = () => {
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant={'temporary'}
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 550 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">Construire un Proforma</Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div className="p-6">

        <form noValidate onSubmit={handleSubmit(SubmitData)} className="flex flex-col items-start gap-6">
          <Typography variant={'h5'}>Information de la Proforma</Typography>
          <Controller
            render={
              ({ field }) => (
                <CustomTextField
                  {...field}
                  label={'Reference'}
                  fullWidth
                  error={!!errors.reference}
                  {...(errors.reference && {
                    error: true,
                    helperText: errors?.reference?.message
                  })} />
              )
            } name={'reference'} control={control} />
          <Grid2 container size={12} direction={'row'} spacing={3} sx={{
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>


            <RadioGroup row aria-label="controlled" name="controlled" value={value} onChange={handleChange}>
              <FormControlLabel value="projet" control={<Radio />} label="Projet" />
              <FormControlLabel value="client" control={<Radio />} label="Client" />
            </RadioGroup>
          </Grid2>


          <div className="w-full flex flex-row justify-between align-middle items-center gap-4">
            <Controller render={
              ({ field }) => {

                // const projetselect = projet?.find(item => item.projet_type.toLowerCase().includes(projetName.toLowerCase())) ?? null

                return (<CustomAutocomplete
                  disabled={clientorprojet}

                  // value={projetselect}
                  options={projet || []}
                  fullWidth
                  onChange={(event, newvalue) => {
                    if (newvalue) {
                      field.onChange(newvalue.id)
                    } else {
                      field.onChange('')
                    }
                  }}
                  getOptionKey={option => option.id}
                  getOptionLabel={option => {
                    return option.projet_type
                  }}
                  renderInput={params => {
                    return (
                      <CustomTextField
                        {...params}
                        label={'Projet'}
                        fullWidth
                        onChange={event => {
                          const value = event.target.value

                          setProjetName(value)
                        }}
                        error={!!errors.projet_id}
                        {...(errors.projet_id && {
                          error: true,
                          helperText: errors?.projet_id?.message
                        })}
                      />
                    )
                  }}
                />)
              }
            } name={'projet_id'} control={control} />
          </div>
          <div className="w-full flex flex-row justify-between align-middle items-center gap-4">
            <Controller render={
              ({ field }) => {
                // Trouve le client sélectionné en fonction du nom
                // const clientselect = client?.find(item => item.nom.toLowerCase().includes(clientName.toLowerCase())) ?? null
                return (<CustomAutocomplete
                  disabled={!clientorprojet}
                  options={client || []}

                  // value={clientselect}
                  fullWidth
                  onChange={(event, newvalue) => {
                    if (newvalue) {
                      field.onChange(newvalue.id)
                    } else {
                      field.onChange('')
                    }
                  }}
                  getOptionKey={option => option.id}
                  getOptionLabel={option => {
                    return option.nom + ' - ' + option.sigle
                  }}
                  renderInput={params => {
                    return (
                      <CustomTextField
                        {...params}
                        label={'Client'}
                        fullWidth
                        onChange={event => {
                          const value = event.target.value

                          setClientName(value)
                        }}
                        error={!!errors.client_id}
                        {...(errors.client_id && {
                          error: true,
                          helperText: errors?.client_id?.message
                        })}
                      />)
                  }}
                />)
              }
            } name={'client_id'} control={control} />
          </div>
          <Divider className="w-full" />
          <Typography variant={'h5'}>Article-Quantite</Typography>

          <div className="w-full flex flex-col gap-4">
            {fields.map((item, index) => (
                <Grid2 container key={item.id} spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 4, sm: 4 }}>
                    <Controller
                      render={
                        ({ field }) => (
                          <CustomAutocomplete
                            options={article || []}
                            fullWidth
                            onChange={(event, newvalue) => {
                              if (newvalue) {
                                field.onChange(newvalue.id)
                                setArticleSelect(prev => {
                                  const newSelect = [...prev]

                                  newSelect[index] = newvalue.id

                                  return newSelect
                                })
                              } else {
                                field.onChange('')
                              }
                            }}
                            getOptionKey={option => option.id}
                            getOptionLabel={option => option.libelle}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                label={'Article'}
                                fullWidth
                                error={!!errors.articleQuantiteslist?.[index]?.article_id}
                                {...(errors.articleQuantiteslist?.[index]?.article_id && {
                                  error: true,
                                  helperText: errors?.articleQuantiteslist?.[index]?.article_id?.message
                                })}
                              />
                            )}
                          />
                        )
                      } name={`articleQuantiteslist.${index}.article_id`} control={control} />
                  </Grid2>
                  <Grid2 size={{ xs: 3, sm: 3 }}>
                    <Controller
                      render={
                        ({ field }) => (
                          <CustomTextField
                            {...field}
                            label={'Quantité'}
                            fullWidth
                            onChange={
                              (event) => {
                                const value = parseFloat(event.target.value)

                                field.onChange(isNaN(value) ? 0 : value)
                              }
                            }
                            error={!!errors.articleQuantiteslist?.[index]?.quantite}
                            {...(errors.articleQuantiteslist?.[index]?.quantite && {
                              error: true,
                              helperText: errors?.articleQuantiteslist?.[index]?.quantite?.message
                            })}
                          />
                        )
                      } name={`articleQuantiteslist.${index}.quantite`} control={control} />
                  </Grid2>
                  <Grid2 size={{ xs: 3, sm: 4 }}>
                    <Controller
                      render={
                        ({ field }) => (
                          <CustomTextField
                            {...field}
                            type="number"
                            label={'Prix Article'}
                            fullWidth
                            onChange={
                              (event) => {
                                const value = parseFloat(event.target.value)

                                field.onChange(isNaN(value) ? 0 : value)
                              }
                            }

                            error={!!errors.articleQuantiteslist?.[index]?.prix_article}
                            {...(errors.articleQuantiteslist?.[index]?.prix_article && {
                              error: true,
                              helperText: errors?.articleQuantiteslist?.[index]?.prix_article?.message
                            })}
                          />
                        )
                      } name={`articleQuantiteslist.${index}.prix_article`} control={control} />
                  </Grid2>
                  <Grid2 size={{ xs: 1, sm: 1 }} container justifyContent="center" alignItems="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        remove(index)

                        // Retire l'article de la liste des articles sélectionnés
                        setArticleSelect(prev => {

                          return prev.filter((_, i) => i !== index)
                        })
                      }}
                      disabled={AddMutation.isPending}
                    >
                      <i className="tabler-trash text-2xl" />
                    </IconButton>
                  </Grid2>
                </Grid2>
              )
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => append({
                article_id: '', quantite: 0, prix_article: 0
              })}
            >
              Ajouter un Article
            </Button>
          </div>


          <div className="w-full flex items-center gap-4">

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={AddMutation.isPending}
            >
              {AddMutation.isPending
                ? 'Traitement...'
                : 'Ajouter'
              }
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              disabled={AddMutation.isPending}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )


}


export default AddProforma
