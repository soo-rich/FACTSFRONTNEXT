import {Controller, useForm} from "react-hook-form";
import {articleSchema, ArticleType, SaveArticleType} from "@/types/soosmart/article.type";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArticleService} from "@/service/article/article.service";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {Grid2} from "@mui/material";
import CustomTextField from "@/@core/components/mui/TextField";
import Button from "@mui/material/Button";

type AddEditArticleType = {
  data?: ArticleType
}

const AddEditArticle = ({data: article}: AddEditArticleType) => {

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<SaveArticleType>(
    {
      resolver: zodResolver(articleSchema),
      defaultValues: {
        libelle: article?.libelle ?? '',
        prix_unitaire: article?.prix_unitaire ?? 0,
      },
      mode: 'onSubmit',
      reValidateMode: 'onBlur',
    }
  )

  const AddMutation = useMutation({
    mutationFn: async (data: SaveArticleType) => {
      return await ArticleService.addArticle(data);
    },
    onSuccess: () => {
      toast.success('Ajout OK');
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout de l\'article');
    },
  });

  const UpdateMutation = useMutation({
    mutationFn: async (data: SaveArticleType) => {
      if (!article?.id) {
        toast.warning('Aucun article à mettre à jour');
        return
      }
      return await ArticleService.updateArticle(article.id, data);
    },
    onSuccess: () => {
      toast.success('Mise à jour OK');
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de l\'article');
    },
  })

  const submitForm = (data: SaveArticleType) => {
    if (article) {
      UpdateMutation.mutate(data);
    } else {
      AddMutation.mutate(data);
    }
  }


  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <Grid2 direction={'column'} size={12} gap={6} sx={{
        justifyContent: 'center',
        alignItems: 'centet'
      }}>

        <Controller render={({field}) => (
          <CustomTextField
            fullWidth
            label={'Libellé'}
            placeholder={'Entrez le libellé de l\'article'}
            error={!!errors.libelle}
            helperText={errors.libelle ? errors.libelle.message : ''}
            {...field}
          />
        )} name={'libelle'} control={control}/>
        <Controller render={({field}) => (
          <CustomTextField
            fullWidth
            label={'Prix Unitaire'}
            placeholder={'Entrez le prix de l\'article'}
            error={!!errors.prix_unitaire}
            helperText={errors.prix_unitaire ? errors.prix_unitaire.message : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(Number(value))) {
                toast.error('Le prix doit être un nombre');
                return;
              }
              field.onChange(Number(value));
            }}

            {...field}
          />
        )} name={'prix_unitaire'} control={control}/>

        <Grid2 container
               direction="row"
               sx={{
                 justifyContent: "space-around",
                 alignItems: "center",
               }} size={12} gap={6}>
          <Button variant="contained" color="primary" type="submit">
            {
              article ? 'Mettre à jour' : 'Ajouter'
            }
          </Button>
          <Button variant="outlined" color="error" onClick={() => reset()}>
            Réinitialiser
          </Button>
        </Grid2>
      </Grid2>

    </form>
  )
}

export default AddEditArticle
