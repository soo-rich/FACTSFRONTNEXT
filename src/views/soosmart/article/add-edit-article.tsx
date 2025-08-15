import { Controller, useForm } from 'react-hook-form'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Grid2 } from '@mui/material'

import Button from '@mui/material/Button'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { ArticleService } from '@/service/article/article.service'
import type { ArticleType, SaveArticleType } from '@/types/soosmart/article.type'
import { articleSchema } from '@/types/soosmart/article.type'
import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'
import CustomTextField from '@/@core/components/mui/TextField'
import EditorBasic from '@components/editor/EditorBasic'

const AddEditArticle = ({ data: article, onSuccess, onCancel }: AddEditFormType<ArticleType>) => {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SaveArticleType>(
    {
      resolver: valibotResolver(articleSchema),
      defaultValues: {
        libelle: article?.libelle ?? '',
        description: article?.description ?? '',
        prix_unitaire: article?.prix_unitaire ?? 0
      }
    }
  )

  const AddMutation = useMutation({
    mutationFn: async (data: SaveArticleType) => {
      return await ArticleService.addArticle(data)
    },
    onSuccess: () => {
      toast.success('Ajout OK')
      reset()

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [ArticleService.ARTICLE_KEY]
      })


      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout de l\'article')
    }
  })

  const UpdateMutation = useMutation({
    mutationFn: async (data: SaveArticleType) => {
      if (!article?.id) {
        toast.warning('Aucun article à mettre à jour')

        return
      }


      return await ArticleService.updateArticle(article.id, data)
    },
    onSuccess: () => {
      toast.success('Mise à jour OK')
      reset()

      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: [ArticleService.ARTICLE_KEY]
      })


      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de l\'article')
    }
  })

  const submitForm = (data: SaveArticleType) => {
    if (article) {
      UpdateMutation.mutate(data)
    } else {
      AddMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    reset(
      {
        libelle: '',
        prix_unitaire: 0
      }
    )

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <Grid2 container direction={'column'} spacing={3}>
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

        <Grid2>
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
        <Grid2 container>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <EditorBasic value={field.value} onChange={field.onChange} />
            )}
          />
        </Grid2>

        <Grid2>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={AddMutation.isPending || UpdateMutation.isPending}
            >
              {AddMutation.isPending || UpdateMutation.isPending
                ? 'Traitement...'
                : article ? 'Mettre à jour' : 'Ajouter'
              }
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              disabled={AddMutation.isPending || UpdateMutation.isPending}
            >
              Annuler
            </Button>
          </div>
        </Grid2>
      </Grid2>
    </form>
  )
}

export default AddEditArticle
