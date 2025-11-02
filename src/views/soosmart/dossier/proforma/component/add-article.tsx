import { useState } from 'react'

import { Grid2, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import Button from '@mui/material/Button'

import { valibotResolver } from '@hookform/resolvers/valibot'

import Chip from '@mui/material/Chip'

import Divider from '@mui/material/Divider'

import CustomTextField from '@core/components/mui/TextField'
import EditorBasic from '@components/editor/EditorBasic'

import type { Article_QuantiteListV2 } from '@/types/soosmart/dossier/Article_Quantite'
import { schemaArticleQuantiteListV2 } from '@/types/soosmart/dossier/Article_Quantite'


const AddArticle = ({ onSuccess }: { onSuccess: (data: Article_QuantiteListV2[]) => void }) => {

  const [articlelist, setArticlelist] = useState<Article_QuantiteListV2[]>([])


  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<Article_QuantiteListV2>({
    resolver: valibotResolver(schemaArticleQuantiteListV2),
    defaultValues:
    {
      libelle: '',
      description: '',
      quantite: 0,
      prix_unitaire: 0
    }
  })

  const submitForm = (data: Article_QuantiteListV2) => {
    setArticlelist(prevState => {
      return [...prevState, data]
    })
    handleCancel()
  }

  const removeItem = (index: number) => {
    setArticlelist(prevState => {
      return prevState.filter((_, i) => i !== index)
    })
  }


  const handleCancel = () => {
    reset({
      libelle: '',
      description: '',
      quantite: 0,
      prix_unitaire: 0
    })
  }

  const handleFinish = () => {
    onSuccess(articlelist)
  }



  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <Grid2 container direction={'row'} spacing={3}>
        <Grid2 container direction={'column'} spacing={3} size={7.5}>
          <Grid2>
            <Controller
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  label={'Libellé'}
                  placeholder={'Entrez le libellé de l\'article'}
                  error={!!errors.libelle}
                  {...(errors.libelle && {
                    error: true,
                    helperText: errors?.libelle?.message
                  })}
                  {...field}
                />
              )}
              name={'libelle'}
              control={control}
            />
          </Grid2>

          <Grid2 container direction={'row'} size={12} sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}>
            <Grid2 size={6} >
              <Controller
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={'Prix Unitaire'}
                    placeholder={'Entrez le prix de l\'article'}
                    type="number"
                    onChange={e => {
                      const value = parseFloat(e.target.value)

                      if (isNaN(value)) {
                        return
                      }

                      field.onChange(isNaN(value) ? 0 : value) // Assure que le prix est un nombre
                    }}
                    error={!!errors.prix_unitaire}
                    {...(errors.prix_unitaire && {
                      error: true,
                      helperText: errors?.prix_unitaire?.message
                    })}
                  />
                )}
                name={'prix_unitaire'}
                control={control}
              />
            </Grid2>
            <Grid2 size={6} >
              <Controller
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={'Quantire'}
                    placeholder={'Entrez le prix de l\'article'}
                    type="number"
                    onChange={e => {
                      const value = parseFloat(e.target.value)

                      if (isNaN(value)) {
                        return
                      }

                      field.onChange(isNaN(value) ? 0 : value) // Assure que le prix est un nombre
                    }}
                    error={!!errors.prix_unitaire}
                    {...(errors.prix_unitaire && {
                      error: true,
                      helperText: errors?.prix_unitaire?.message
                    })}
                  />
                )}
                name={'quantite'}
                control={control}
              />
            </Grid2>
          </Grid2>


          <Grid2 container>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <EditorBasic value={field.value} onChange={field.onChange} />}
            />
          </Grid2>

          <Grid2>
            <div className="flex justify-center gap-4 mt-6">


              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                {'Ajouter'}
              </Button>


              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}

              >
                Annuler
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={handleFinish}
                disabled={articlelist.length < 1}
              >
                Terminer
              </Button>
            </div>
          </Grid2>
        </Grid2>

        <Divider orientation="vertical" flexItem />
        <Grid2 container direction={'column'} spacing={3} size={4.3} sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',

        }} >

          <Typography className="text-xl font-bold w-full">Liste des articles</Typography>
          <div className={'overflow-y-auto max-h-[30rem] flex w-full flex flex-col gap-2 spacing-3'}>
            {articlelist.map((item, index) => (
              <Grid2 key={index} size={12}>
                <Chip

                  className='w-full'
                  label={`${item.libelle} -  ${item.prix_unitaire} FCFA}`}
                  color="primary"
                  onDelete={() => removeItem(index)}
                  deleteIcon={<i className="tabler-trash-x text-red-600" />}
                />
              </Grid2>
            ))}
          </div>


        </Grid2>
      </Grid2>
    </form>
  )
}


export default AddArticle
