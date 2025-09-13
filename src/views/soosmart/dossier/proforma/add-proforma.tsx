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
import AddEditClient from '../../client/add-edit-client'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'
import AddEditProjet from '../../projet/add-edit-projet'
import AddEditArticle from '../../article/add-edit-article'
import type { ClientType } from '@/types/soosmart/client.type'
import type { ProjetType } from '@/types/soosmart/projet.type'
import type { ArticleType } from '@/types/soosmart/article.type'

type Props = {
  open: boolean
  handleClose: () => void
  onSucces?: () => void
}

const AddProforma = ({ open, handleClose, onSucces }: Props) => {
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
  const [openArticleModal, setOpenArticleModal] = useState<boolean>(false)
  const [openClientModal, setOpenClientModal] = useState<boolean>(false)
  const [openProjetModal, setOpenPorjetModel] = useState<boolean>(false)

  const {
    handleSubmit,
    control,
    setValue: setValueForm,
    reset,
    formState: { errors }
  } = useForm<ProformaSave>({
    resolver: valibotResolver(schemaProforma),
    defaultValues: {
      reference: '',
      projet_id: '',
      client_id: '',
      articleQuantiteslist: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })

  const { data: articleList } = useQuery({
    queryKey: [ArticleService.ARTICLE_KEY],
    queryFn: async () => {
      return await ArticleService.searchArticles()
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: client } = useQuery({
    queryKey: [ClientService.CLIENT_KEY, clientName],
    queryFn: async () => {
      return await ClientService.getClientsByNom(clientName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: projet } = useQuery({
    queryKey: [ProjetService.PROJT_KEY, projetName],
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

  const AddMutation = useMutation({
    mutationFn: async (data: ProformaSave) => {
      return await ProformaService.PostData(data)
    },
    onSuccess: () => {
      toast.success('Proforma cree')
      onSucces?.()
      reset({
        reference: '',
        projet_id: '',
        client_id: '',
        articleQuantiteslist: []
      })
      handleClose()
    },
    onError: error => {
      toast.error("Erreur d'ajout de la proforma")
      console.error('Error adding proforma:', error)
    }
  })

  const SubmitData = (data: ProformaSave) => {
    console.log(data)

    // AddMutation.mutate(data)
  }

  const handleReset = () => {
    handleClose()
  }

  const handleSuccesAddClient = (data?: ClientType | ClientType[]) => {
    if (!data) return

    if (Array.isArray(data)) {
      if (data.length > 0) {
        setValueForm('client_id', data[0].id)
      }
    } else {
      setValueForm('client_id', data.id)
    }

    setOpenClientModal(false)
  }

  const handlehandleSuccesAddProjet = (data?: ProjetType | ProjetType[]) => {
    if (!data) return

    if (Array.isArray(data)) {
      if (data.length > 0) {
        setValueForm('projet_id', data[0].id)
      }
    } else {
      setValueForm('projet_id', data.id)
    }

    setOpenPorjetModel(false)
  }

  const handleSuccesAddArticles = (data?: ArticleType | ArticleType[]) => {
    if (!data) return

    if (Array.isArray(data)) {
      const ids = data.map(item => item.id)

      setArticleSelect(prev => [...prev, ...ids])
      ids.forEach(id => {
        append({
          article_id: id,
          quantite: 0,
          prix_article: 0
        })
      })
    } else {
      setArticleSelect(prev => [...prev, data.id])
      append({
        article_id: data.id,
        quantite: 0,
        prix_article: 0
      })
    }

    setOpenArticleModal(false)
  }

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant={'temporary'}
        onClose={handleReset}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 550 } } }}
      >
        <div className='flex items-center justify-between plb-5 pli-6'>
          <Typography variant='h5'>Construire un Proforma</Typography>
          <IconButton size='small' onClick={handleReset}>
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        </div>
        <Divider />
        <div className='p-6'>
          <form noValidate onSubmit={handleSubmit(SubmitData)} className='flex flex-col items-start gap-6'>
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
            <Grid2
              container
              size={12}
              direction={'row'}
              spacing={3}
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
                <FormControlLabel value='projet' control={<Radio />} label='Projet' />
                <FormControlLabel value='client' control={<Radio />} label='Client' />
              </RadioGroup>
            </Grid2>

            {!clientorprojet && (
              <div className='w-full flex flex-row justify-between align-middle items-end gap-4'>
                <Button
                  disabled={clientorprojet}
                  onClick={() => setOpenPorjetModel(true)}
                  color={'inherit'}
                  variant={'contained'}
                  startIcon={<i className={'tabler-plus'}></i>}
                >
                  Projet
                </Button>
                <Controller
                  render={({ field }) => {
                    return (
                      <CustomAutocomplete
                        disabled={clientorprojet}
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
                      />
                    )
                  }}
                  name={'projet_id'}
                  control={control}
                />
              </div>
            )}
            {clientorprojet && (
              <div className='w-full flex flex-row justify-between align-middle items-end gap-4'>
                <Button
                  disabled={!clientorprojet}
                  onClick={() => setOpenClientModal(true)}
                  color={'inherit'}
                  variant={'contained'}
                  startIcon={<i className={'tabler-plus'}></i>}
                >
                  Client
                </Button>
                <Controller
                  render={({ field }) => {
                    return (
                      <CustomAutocomplete
                        disabled={!clientorprojet}
                        options={client || []}
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
                            />
                          )
                        }}
                      />
                    )
                  }}
                  name={'client_id'}
                  control={control}
                />
              </div>
            )}
            <Divider className='w-full' />

            <div className='w-full flex flex-col gap-4'>
              <Grid2
                size={12}
                container
                direction='row'
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                spacing={2}
                gap={6}
              >
                <Button
                  onClick={() => setOpenArticleModal(true)}
                  color={'inherit'}
                  variant={'contained'}
                  startIcon={<i className={'tabler-plus'}></i>}
                >
                  Articles
                </Button>
                <Typography variant={'h5'}>Article-Quantite</Typography>
              </Grid2>
              {fields.map((item, index) => (
                <Grid2 container key={item.id} spacing={2} alignItems='center'>
                  <Grid2 size={{ xs: 4, sm: 4 }}>
                    <Controller
                      render={({ field }) => (
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
                      )}
                      name={`articleQuantiteslist.${index}.article_id`}
                      control={control}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 3, sm: 3 }}>
                    <Controller
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label={'Quantité'}
                          fullWidth
                          onChange={event => {
                            const value = parseFloat(event.target.value)

                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                          error={!!errors.articleQuantiteslist?.[index]?.quantite}
                          {...(errors.articleQuantiteslist?.[index]?.quantite && {
                            error: true,
                            helperText: errors?.articleQuantiteslist?.[index]?.quantite?.message
                          })}
                        />
                      )}
                      name={`articleQuantiteslist.${index}.quantite`}
                      control={control}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 3, sm: 4 }}>
                    <Controller
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          type='number'
                          label={'Prix Article'}
                          fullWidth
                          onChange={event => {
                            const value = parseFloat(event.target.value)

                            field.onChange(isNaN(value) ? 0 : value)
                          }}
                          error={!!errors.articleQuantiteslist?.[index]?.prix_article}
                          {...(errors.articleQuantiteslist?.[index]?.prix_article && {
                            error: true,
                            helperText: errors?.articleQuantiteslist?.[index]?.prix_article?.message
                          })}
                        />
                      )}
                      name={`articleQuantiteslist.${index}.prix_article`}
                      control={control}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 1, sm: 1 }} container justifyContent='center' alignItems='center'>
                    <IconButton
                      color='error'
                      onClick={() => {
                        remove(index)

                        // Retire l'article de la liste des articles sélectionnés
                        setArticleSelect(prev => {
                          return prev.filter((_, i) => i !== index)
                        })
                      }}
                      disabled={AddMutation.isPending}
                    >
                      <i className='tabler-trash text-2xl' />
                    </IconButton>
                  </Grid2>
                </Grid2>
              ))}
              <Button
                variant='outlined'
                color='primary'
                onClick={() =>
                  append({
                    article_id: '',
                    quantite: 0,
                    prix_article: 0
                  })
                }
              >
                Ajouter un Article
              </Button>
            </div>

            <div className='w-full flex items-center gap-4'>
              <Button variant='contained' color='primary' type='submit' disabled={AddMutation.isPending}>
                {AddMutation.isPending ? 'Traitement...' : 'Ajouter'}
              </Button>
              <Button variant='outlined' color='error' onClick={handleReset} disabled={AddMutation.isPending}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
      <DefaultDialog
        open={openClientModal}
        setOpen={setOpenClientModal}
        onClose={() => {
          setOpenClientModal(false)
        }}
        title={'Ajouter un client'}
        children={<AddEditClient onSuccess={handleSuccesAddClient} onCancel={() => setOpenClientModal(false)} />}
      />
      <DefaultDialog
        open={openProjetModal}
        setOpen={setOpenPorjetModel}
        onClose={() => {
          setOpenPorjetModel(false)
        }}
        title={'Ajouter un projet'}
        children={<AddEditProjet onSuccess={handlehandleSuccesAddProjet} onCancel={() => setOpenPorjetModel(false)} />}
      />
      <DefaultDialog
        open={openArticleModal}
        setOpen={setOpenArticleModal}
        onClose={() => {
          setOpenArticleModal(false)
        }}
        title={'Ajouter des article'}
        children={<AddEditArticle onSuccess={handleSuccesAddArticles} onCancel={() => setOpenArticleModal(false)} />}
      />
    </>
  )
}

export default AddProforma
