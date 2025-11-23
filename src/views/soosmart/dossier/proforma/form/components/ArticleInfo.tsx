import { useEffect } from "react"

import { valibotResolver } from "@hookform/resolvers/valibot"

import { Grid2, Button } from "@mui/material"

import { Controller, useForm } from "react-hook-form"

import CustomTextField from "@/@core/components/mui/TextField"
import EditorBasic from "@/components/editor/EditorBasic"
import type { Article_QuantiteListV2 } from "@/types/soosmart/dossier/Article_Quantite";
import { schemaArticleQuantiteListV2 } from "@/types/soosmart/dossier/Article_Quantite"

type ArticleInfoProps = {
  initaldata?: Article_QuantiteListV2 | null
  onAppend: (data: Article_QuantiteListV2) => void
  onUpdate: (data: Article_QuantiteListV2) => void,
  onCancel?: () => void
}

const ArticleInfo = ({ initaldata, onAppend, onUpdate, onCancel }: ArticleInfoProps) => {

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<Article_QuantiteListV2>({
    resolver: valibotResolver(schemaArticleQuantiteListV2),
    defaultValues:
    {
      libelle: initaldata?.libelle || '',
      description: initaldata?.description || '',
      quantite: initaldata?.quantite || 0,
      prix_unitaire: initaldata?.prix_unitaire || 0
    }
  })

  const submitForm = (data: Article_QuantiteListV2) => {
    initaldata
      ? onUpdate(data)
      : onAppend(data)
    handleCancel()
  }

  const handleCancel = () => {
    onCancel && onCancel()
    reset({
      libelle: '',
      description: '',
      quantite: 0,
      prix_unitaire: 0
    })
  }

  useEffect(() => {
    reset({
      libelle: initaldata?.libelle || '',
      description: initaldata?.description || '',
      quantite: initaldata?.quantite || 0,
      prix_unitaire: initaldata?.prix_unitaire || 0
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initaldata])

  return (<div className="space-y-4">
    <div className="flex justify-center items-center gap-4">
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
                    const value = Number(e.target.value)

                    if (!isNaN(value)) {
                      field.onChange(value)
                    }


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
                    const value = Number(e.target.value)

                    if (!isNaN(value)) {
                      field.onChange(value) // Assure que le prix est un nombre
                    }

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
              variant="outlined"
              color="error"
              onClick={handleCancel}

            >
              Annuler
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={handleSubmit(submitForm)}
            >
              {initaldata ? "Change" : 'Ajouter'}
            </Button>



          </div>
        </Grid2>
      </Grid2>

    </div>
  </div>
  )
}


export default ArticleInfo
