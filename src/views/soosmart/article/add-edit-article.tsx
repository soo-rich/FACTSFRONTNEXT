import { Controller, useForm } from 'react-hook-form'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Grid2 } from '@mui/material'

import Button from '@mui/material/Button'

import { valibotResolver } from '@hookform/resolvers/valibot'




// MUI Imports
import Divider from '@mui/material/Divider'

// Third-party imports
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

import { ArticleService } from '@/service/article/article.service'
import { articleSchema } from '@/types/soosmart/article.type'
import type { ArticleType, SaveArticleType } from '@/types/soosmart/article.type'
import type { AddEditFormType } from '@/types/soosmart/add-edit-modal.type'
import CustomTextField from '@/@core/components/mui/TextField'


// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className='tabler-bold' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className='tabler-underline' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className='tabler-italic' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className='tabler-strikethrough' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className='tabler-align-left' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className='tabler-align-center' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className='tabler-align-right' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className='tabler-align-justified' />
      </CustomIconButton>
    </div>
  )
}

const EditorBasic = ({ value, onChange }: { value?: string, onChange?: (val: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Écris la description ici...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  return (
    <div className='border rounded-md'>
      <EditorToolbar editor={editor} />
      <Divider />
      <EditorContent editor={editor} className='bs-[200px] overflow-y-auto flex' />
    </div>
  )
}

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
        <Grid2>
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
