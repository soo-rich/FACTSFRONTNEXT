import { Button } from "@/components/ui/button"
import CircularProgress from "@/components/ui/circularprogess"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputWithIcon } from "@/components/ui/input"
import { ArticleService } from "@/service/article/article.service"
import { articleSchema, ArticleType } from "@/types/article.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Banknote, Tag } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type formdata = z.infer<typeof articleSchema>

const ArticleForm = ({ data: article, onSucces }: { data?: ArticleType, onSucces?: () => void }) => {
    const queryClient = useQueryClient()
    const form = useForm({
        resolver: zodResolver(articleSchema),
        mode: 'onChange',
        defaultValues: {
            libelle: article?.libelle ?? "",
            prix_unitaire: article?.prix_unitaire ?? 0
        }
    })

    const ArticleMutation = useMutation({
        mutationFn: async (data: formdata) => {
            return article?.id ? ArticleService.updateArticle(article.id, data) : ArticleService.addArticle(data)
        },
        onSuccess: (data) => {
            article ? toast.success(`mise a jour d'article ${data.libelle}`) : toast.success(`Ajout d'article ${data.libelle}`)
            queryClient.invalidateQueries({
                queryKey: [ArticleService.ARTICLE_KEY],
            }).then(r => r)
            form.reset({
                libelle: '',
                prix_unitaire: 0
            })
            onSucces?.()
        },
        onError: () => {
            toast.error("Ajout d'article nom aboutie",)
        }
    })


    const Submit = (data: formdata) => {
        ArticleMutation.mutate(data)
    }

    return (<Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(Submit)} className="grid grid-cols-1 gap-6">

            <div className="grid grid-cols-1">
                <FormField control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Article</FormLabel>
                        <FormControl><InputWithIcon icon={Tag} iconPosition="left" {...field} /></FormControl>
                        <FormMessage className={'text-red-600'} />
                    </FormItem>)}
                    name="libelle"
                />
            </div>

            <div className="grid grid-cols-1">
                <FormField control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prix</FormLabel>
                        <FormControl><InputWithIcon icon={Banknote} iconPosition="left" type="number" {...field} onChange={(e) => {
                            if (isNaN(Number(e.target.value))) {
                                return
                            }
                            field.onChange(Number(e.target.value))
                        }
                        } /></FormControl>
                        <FormMessage className={'text-red-600'} />
                    </FormItem>)}
                    name="prix_unitaire"
                />
            </div>

            <div className="flex flex-col">
                {
                    ArticleMutation.isPending ? (
                        <div className={'flex justify-center items-center'}>
                            <CircularProgress size={24}
                                strokeWidth={5}
                                className={'text-primary'}
                            />
                        </div>) : (
                        <Button className="w-full" type="submit">
                            Ajouter
                        </Button>)
                }
            </div>
        </form>
    </Form>)
}


export default ArticleForm