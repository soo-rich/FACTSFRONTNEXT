'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useMutation, useQueries } from '@tanstack/react-query'

import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import InputAdornment from '@mui/material/InputAdornment'

import {
  createFilterOptions,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup
} from '@mui/material'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import CardHeader from '@mui/material/CardHeader'

import type { ProformaSaveV2 } from '@/types/soosmart/dossier/proforma.type'
import { schemaProformaV2, schemaProformaV2Edit } from '@/types/soosmart/dossier/proforma.type'

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
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const filterOptionsClient = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: ClientType) => option.nom || option.lieu
})

const filterOptionsProjet = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: ProjetType) => option.projet_type
})

// Type pour le formulaire d'article local
type ArticleFormValues = {
  libelle: string
  description: string
  quantite: number | ''
  prix_unitaire: number | ''
}

const defaultArticleValues: ArticleFormValues = {
  libelle: '',
  description: '',
  quantite: '',
  prix_unitaire: ''
}

const AddEditProforma = () => {
  const { create, lang: locale } = useParams()
  const router = useRouter()

  // select state
  const [isClient, setIsClient] = useState<'client' | 'projet'>('client')

  // Article form state (séparé du formulaire principal)
  const [articleForm, setArticleForm] = useState<ArticleFormValues>(defaultArticleValues)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [articleErrors, setArticleErrors] = useState<Partial<Record<keyof ArticleFormValues, string>>>({})

  // filter state
  const [clientFilter, setClientFilter] = useState('')
  const [projetFilter, setProjetFilter] = useState('')

  const isEdit = create !== 'create'

  // querykey state
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
        staleTime: 1000 * 60 * 5
      },
      {
        queryKey: querykeyclient,
        queryFn: async () => {
          return (
            await ClientService.getClients({
              search: clientFilter,
              page: 0,
              pagesize: 50
            })
          ).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5
      },
      {
        queryKey: querykeyprojet,
        queryFn: async () => {
          return (
            await ProjetService.getAllProjet({
              search: projetFilter,
              page: 0,
              pagesize: 50
            })
          ).content
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5
      }
    ]
  })

  const [{ data: proforma }, { data: clients }, { data: projets }] = response

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue
  } = useForm<ProformaSaveV2>({
    resolver: valibotResolver(isEdit ? schemaProformaV2Edit : schemaProformaV2),
    defaultValues: {
      reference: '',
      articleQuantiteslist: []
    }
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'articleQuantiteslist'
  })

  // --- Validation locale de l'article ---
  const validateArticleForm = (): boolean => {
    const errs: Partial<Record<keyof ArticleFormValues, string>> = {}

    if (!articleForm.libelle || articleForm.libelle.trim().length < 1) {
      errs.libelle = 'Le libellé est requis'
    }

    if (articleForm.quantite === '' || Number(articleForm.quantite) <= 0) {
      errs.quantite = 'La quantité doit être supérieure à 0'
    }

    if (articleForm.prix_unitaire === '' || Number(articleForm.prix_unitaire) < 0) {
      errs.prix_unitaire = 'Le prix unitaire est requis'
    }

    setArticleErrors(errs)

    return Object.keys(errs).length === 0
  }

  // --- Ajouter ou mettre à jour un article ---
  const handleAddOrUpdateArticle = () => {
    if (!validateArticleForm()) return

    const articleData = {
      libelle: articleForm.libelle,
      description: articleForm.description,
      quantite: Number(articleForm.quantite),
      prix_unitaire: Number(articleForm.prix_unitaire)
    }

    if (editingIndex !== null) {
      // Mode mise à jour
      update(editingIndex, articleData)

      // toast.success(`Article "${articleData.libelle}" mis à jour`)
      setEditingIndex(null)
    } else {
      // Mode ajout
      append(articleData)

      // toast.success(`Article "${articleData.libelle}" ajouté`)
    }

    // Reset le formulaire article
    setArticleForm(defaultArticleValues)
    setArticleErrors({})
  }

  // --- Cliquer sur un item pour le modifier ---
  const handleSelectArticle = (index: number) => {
    const item = fields[index]

    setEditingIndex(index)
    setArticleForm({
      libelle: item.libelle,
      description: item.description,
      quantite: item.quantite,
      prix_unitaire: item.prix_unitaire
    })
    setArticleErrors({})
  }

  // --- Annuler l'édition d'un article ---
  const handleCancelArticleEdit = () => {
    setEditingIndex(null)
    setArticleForm(defaultArticleValues)
    setArticleErrors({})
  }

  // --- Supprimer un article ---
  const handleRemoveArticle = (index: number) => {
    remove(index)

    // Si on supprime l'article en cours d'édition, on le reset
    if (editingIndex === index) {
      handleCancelArticleEdit()
    } else if (editingIndex !== null && index < editingIndex) {
      // Ajuster l'index si on supprime avant l'élément en cours d'édition
      setEditingIndex(editingIndex - 1)
    }
  }

  // --- Calculs ---
  const totalHT = useMemo(() => {
    return fields.reduce((acc, item) => acc + item.prix_unitaire * item.quantite, 0)
  }, [fields])

  // --- Mutations ---
  const AddMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      return await ProformaService.PostDataWithArticle(data)
    },
    onSuccess: () => {
      toast.success('Proforma créée avec succès')
      router.push(getLocalizedUrl('/proforma', locale as Locale))
    },
    onError: error => {
      toast.error('Erreur lors de l\'ajout de la proforma')
      console.error('Error adding proforma:', error)
    }
  })

  const EditMutation = useMutation({
    mutationFn: async (data: ProformaSaveV2) => {
      if (proforma == null) return

      return await ProformaService.Updatedata(proforma?.id, data)
    },
    onSuccess: data => {
      toast.success(`Proforma ${data?.numero} mise à jour avec succès`)
      router.push(getLocalizedUrl('/proforma', locale as Locale))
    },
    onError: error => {
      toast.error(`Erreur lors de la mise à jour de la proforma ${proforma?.numero}`)
      console.error('Error updating proforma:', error)
    }
  })

  const handleSubmitForm = (data: ProformaSaveV2) => {

    isEdit && proforma ? EditMutation.mutate(data) : AddMutation.mutate(data)
  }

  const handeReset = () => {
    reset({
      reference: '',
      client_id: null,
      projet_id: null,
      articleQuantiteslist: []
    })
    handleCancelArticleEdit()
    router.push(getLocalizedUrl('/proforma', locale as Locale))
  }

  useEffect(() => {
    if (isEdit && proforma) {
      setValue('reference', proforma.reference, { shouldDirty: true })

      if (proforma.client) {
        setValue('client_id', proforma.client.id, { shouldDirty: true })
        setIsClient('client')
      }

      if (proforma.projet) {
        setValue('projet_id', proforma.projet.id, { shouldDirty: true })
        setIsClient('projet')
      }

      setValue(
        'articleQuantiteslist',
        proforma.articleQuantites.map(aq => ({
          libelle: aq.article.libelle,
          description: aq.article.description,
          quantite: aq.quantite,
          prix_unitaire: Number(aq.prix_article)
        })),
        { shouldDirty: true }
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, proforma])

  useEffect(() => {
    console.log('Validation errors:', errors)
  }, [errors])

  const isPending = AddMutation.isPending || EditMutation.isPending

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
      <div className="flex flex-col gap-6">
        {/* ====== EN-TÊTE ====== */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <i className="tabler-file-invoice text-primary text-2xl" />
                <Typography variant="h5">{isEdit ? 'Modifier la Proforma' : 'Nouvelle Proforma'}</Typography>
              </div>
            }
            subheader="Remplissez les informations de la proforma puis ajoutez les articles"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {/* Référence */}
              <Grid size={{ xs: 12, md: 12 }}>
                <Controller
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label="Référence"
                      placeholder="Ex: PRO-2026-001"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="tabler-hash text-lg" />
                            </InputAdornment>
                          )
                        }
                      }}
                      error={!!errors.reference}
                      {...(errors.reference && {
                        error: true,
                        helperText: errors?.reference?.message
                      })}
                    />
                  )}
                  name="reference"
                  control={control}
                />
              </Grid>

              {/* Client / Projet */}
              {!isEdit && (
                <Grid size={{ xs: 12, md: 12 }}>
                  <RadioGroup
                    row
                    name="isClient"
                    value={isClient}
                    onChange={event => {
                      const value = (event.target as HTMLInputElement).value as 'client' | 'projet'

                      setIsClient(value)

                      if (value === 'client') {
                        setValue('projet_id', null)
                      } else {
                        setValue('client_id', null)
                      }
                    }}
                    className="mb-3"
                  >
                    <FormControlLabel
                      value="client"
                      control={<Radio />}
                      label={
                        <span className="flex items-center gap-1">
                          <i className="tabler-user text-base" /> Client
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="projet"
                      control={<Radio />}
                      label={
                        <span className="flex items-center gap-1">
                          <i className="tabler-briefcase text-base" /> Projet
                        </span>
                      }
                    />
                  </RadioGroup>

                  {isClient === 'client' ? (
                    <Controller
                      render={({ field }) => (
                        <CustomAutocomplete
                          options={clients || []}
                          fullWidth
                          filterOptions={filterOptionsClient}
                          onChange={(_event, newvalue) => {
                            field.onChange(newvalue?.id)
                          }}
                          getOptionLabel={option => option.nom || ''}
                          renderInput={params => (
                            <DebouncedInput
                              {...params}
                              label="Sélectionner un client"
                              onChange={e => {
                                setClientFilter(e || '')
                              }}
                            />
                          )}
                        />
                      )}
                      name="client_id"
                      control={control}
                    />
                  ) : (
                    <Controller
                      render={({ field }) => (
                        <CustomAutocomplete
                          options={projets || []}
                          fullWidth
                          filterOptions={filterOptionsProjet}
                          onChange={(_event, newvalue) => {
                            field.onChange(newvalue?.id)
                          }}
                          getOptionLabel={option => option.projet_type || ''}
                          renderInput={params => (
                            <DebouncedInput
                              {...params}
                              label="Sélectionner un projet"
                              onChange={e => {
                                setProjetFilter(e || '')
                              }}
                            />
                          )}
                        />
                      )}
                      name="projet_id"
                      control={control}
                    />
                  )}
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* ====== SECTION ARTICLES ====== */}
        <Grid container spacing={4}>
          {/* --- Formulaire Article --- */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <i className="tabler-package text-primary text-xl" />
                    <Typography variant="h6">
                      {editingIndex !== null ? `Modifier l'article #${editingIndex + 1}` : 'Ajouter un article'}
                    </Typography>
                    {editingIndex !== null && (
                      <Chip label="Mode édition" color="warning" size="small" variant="tonal" />
                    )}
                  </div>
                }
              />
              <Divider />
              <CardContent>
                <div className="flex flex-col gap-4">
                  <CustomTextField
                    label="Libellé *"
                    placeholder="Ex: Développement d'une application"
                    fullWidth
                    value={articleForm.libelle}
                    onChange={e => setArticleForm(prev => ({ ...prev, libelle: e.target.value }))}
                    error={!!articleErrors.libelle}
                    helperText={articleErrors.libelle}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className="tabler-tag text-lg" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <CustomTextField
                    label="Description"
                    placeholder="Description détaillée de l'article"
                    fullWidth
                    multiline
                    rows={2}
                    value={articleForm.description}
                    onChange={e => setArticleForm(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        label="Quantité *"
                        placeholder="0"
                        fullWidth
                        type="number"
                        value={articleForm.quantite}
                        onChange={e =>
                          setArticleForm(prev => ({
                            ...prev,
                            quantite: e.target.value === '' ? '' : Number(e.target.value)
                          }))
                        }
                        error={!!articleErrors.quantite}
                        helperText={articleErrors.quantite}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <i className="tabler-stack-2 text-lg" />
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        label="Prix Unitaire *"
                        placeholder="0"
                        fullWidth
                        type="number"
                        value={articleForm.prix_unitaire}
                        onChange={e =>
                          setArticleForm(prev => ({
                            ...prev,
                            prix_unitaire: e.target.value === '' ? 0 : Number(e.target.value)
                          }))
                        }
                        error={!!articleErrors.prix_unitaire}
                        helperText={articleErrors.prix_unitaire}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <i className="tabler-currency-franc text-lg" />
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Sous-total aperçu */}
                  {articleForm.quantite !== '' && articleForm.prix_unitaire !== '' && (
                    <div className="flex items-center justify-end gap-2 px-2">
                      <Typography variant="body2" color="text.secondary">
                        Sous-total :
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="primary">
                        {(Number(articleForm.quantite) * Number(articleForm.prix_unitaire)).toLocaleString('fr-FR')}{' '}
                        Fcfa
                      </Typography>
                    </div>
                  )}

                  <div className="flex gap-3 mt-1">
                    <Button
                      variant="contained"
                      color={editingIndex !== null ? 'warning' : 'primary'}
                      startIcon={<i className={editingIndex !== null ? 'tabler-check' : 'tabler-plus'} />}
                      onClick={handleAddOrUpdateArticle}
                    >
                      {editingIndex !== null ? 'Mettre à jour l\'article' : 'Ajouter'}
                    </Button>
                    {editingIndex !== null && (
                      <Button variant="tonal" color="secondary" onClick={handleCancelArticleEdit}>
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* --- Liste des articles --- */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card className="h-full">
              <CardHeader
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="tabler-list-details text-primary text-xl" />
                      <Typography variant="h6">Articles</Typography>
                    </div>
                    <Chip
                      label={`${fields.length} article${fields.length > 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="tonal"
                    />
                  </div>
                }
              />
              <Divider />
              <CardContent className="pt-2!">
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <i className="tabler-package-off text-5xl text-gray-300 mb-3" />
                    <Typography variant="body1" color="text.secondary">
                      Aucun article ajouté
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Utilisez le formulaire ci-contre pour ajouter des articles
                    </Typography>
                  </div>
                ) : (
                  <>
                    <List className="space-y-2 overflow-y-auto max-h-44">
                      {fields.map((item, index) => (
                        <ListItem
                          key={item.id}
                          disablePadding
                          className={`border rounded-lg transition-all ${
                            editingIndex === index
                              ? 'border-warning bg-warning/5 shadow-sm'
                              : 'border-gray-200 hover:border-primary/40'
                          }`}
                          secondaryAction={
                            <Tooltip title="Supprimer">
                              <IconButton edge="end" size="small" onClick={() => handleRemoveArticle(index)}>
                                <i className="tabler-trash text-red-500 text-lg" />
                              </IconButton>
                            </Tooltip>
                          }
                        >
                          <ListItemButton
                            selected={editingIndex === index}
                            onClick={() => handleSelectArticle(index)}
                            sx={{ borderRadius: '8px' }}
                          >
                            <ListItemAvatar>
                              <CustomAvatar color={editingIndex === index ? 'warning' : 'primary'} variant="rounded">
                                {getInitials(item.libelle)}
                              </CustomAvatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {item.libelle}
                                </Typography>
                              }
                              secondary={
                                <span className="flex flex-col">
                                  {item.description && (
                                    <Typography variant="caption" color="text.disabled" noWrap>
                                      {item.description}
                                    </Typography>
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {item.prix_unitaire.toLocaleString('fr-FR')} Fcfa x {item.quantite} ={' '}
                                    <strong>{(item.prix_unitaire * item.quantite).toLocaleString('fr-FR')} Fcfa</strong>
                                  </Typography>
                                </span>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>

                    {/* Total */}
                    <Divider className="my-3!" />
                    <div className="flex items-center justify-between px-3 py-2 bg-primary/5 rounded-lg">
                      <Typography variant="subtitle1" fontWeight={600}>
                        Total HT
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {totalHT.toLocaleString('fr-FR')} Fcfa
                      </Typography>
                    </div>
                  </>
                )}

                {/* Erreur de validation si pas d'article */}
                {errors.articleQuantiteslist && (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    className="mt-2 block text-error text-center align-middle"
                  >
                    <i className="tabler-alert-circle text-sm mr-1 my-auto" />
                    Ajoutez au moins un article à la proforma
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ====== BOUTONS D'ACTION ====== */}
        <Card>
          <CardContent>
            <div className="flex flex-row gap-3 justify-end">
              <LoadingButton
                loading={isPending}
                type="submit"
                variant="contained"
                startIcon={<i className={isEdit ? 'tabler-device-floppy' : 'tabler-send'} />}
              >
                {isEdit ? 'Enregistrer les modifications' : 'Créer la Proforma'}
              </LoadingButton>
              <Button
                disabled={isPending}
                type="reset"
                variant="tonal"
                color="secondary"
                startIcon={<i className="tabler-x" />}
                onClick={handeReset}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}

export default AddEditProforma
