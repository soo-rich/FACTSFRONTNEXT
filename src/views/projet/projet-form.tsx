import { AutoCompleteSelect } from '@/components/combobox/AutoCompleteSelect'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputWithIcon } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ClientService } from '@/service/client/client.service'
import { ProjetService } from '@/service/projet/projet.service'
import { FormEditAddType } from '@/types/form-edit-add/form-edit-add.type'
import { ProjetType, SaveProjet, schemaProjetSave, schemaProjetUpdate, UpdateProjet } from '@/types/projet.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BriefcaseBusiness } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


const ProjetForm = ({ edit, data: projet, onSucces }: FormEditAddType<ProjetType>) => {
	const queryClient = useQueryClient()
	const [client_nom, setClientNom] = useState<string>("")
	const formsave = useForm<SaveProjet>({
		defaultValues: {
			projet_type: "",
			client_id: "",
			description: "",
			offre: false,
		},
		mode: 'onBlur',
		reValidateMode: 'onChange',
		resolver: zodResolver(schemaProjetSave),
	})

	const formupdate = useForm<UpdateProjet>({
		defaultValues: {
			projet_type: projet?.projet_type,
			description: projet?.description,
			offre: projet?.offre,
		},
		mode: 'onBlur',
		reValidateMode: 'onChange',
		resolver: zodResolver(schemaProjetUpdate),
	})

	const AddorEditMutation = useMutation({
		mutationFn: async (data: SaveProjet | UpdateProjet) => {
			return edit && projet?.id ? ProjetService.updateProjet(data as UpdateProjet, projet?.id) : ProjetService.saveProjet(data as SaveProjet)
		},
		onSuccess: (data) => {
			edit ? toast.success(`mise a jour du projet ${data?.projet_type}`) : toast.success(`Ajout du projet ${data?.projet_type}`)
			queryClient.invalidateQueries({
				queryKey: [ProjetService.PROJT_KEY],
			}).then(r => r)
			onSucces?.()
		},
		onError: () => {
			edit ? toast.error(`mise a jour du projet ${projet?.projet_type} nom aboutie`) : toast.error(`Ajout du projet nom aboutie`)
		},
	})

	const { data: client } = useQuery({
		queryKey: [ClientService.CLIENT_KEY, client_nom],
		queryFn: async () => {
			return await ClientService.getClientsByNom({ search: client_nom })
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})

	const mapData = useMemo(() => {
		if (!client) return []
		return client.map(
			(el) => {
				return {
					id: el.id,
					label: el.nom,
				}
			},
		)
	}, [client])

	return edit
		? (
			<Form {...formupdate}>
				<form noValidate onSubmit={formupdate.handleSubmit((data) => AddorEditMutation.mutate(data))}
				      className={'grid grid-cols-1 gap-4'}>
					<div className={'grid grid-cols-4 gap-4'}>
						<div className={'col-span-3'}>
							<FormField name={'projet_type'} control={formupdate.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Projet Type</FormLabel>
									<FormControl><InputWithIcon icon={BriefcaseBusiness} iconPosition={'left'} {...field} /></FormControl>
									<FormMessage className={'text-red-500'} />
								</FormItem>
							)} />
						</div>
						<div>
							<FormField name={'offre'} control={formupdate.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Offre</FormLabel>
									<FormControl><Checkbox onChange={field.onChange} /></FormControl>
									<FormMessage className={'text-red-500'} />
								</FormItem>
							)} />
						</div>
					</div>
					<div className={'grid grid-cols-1'}>
						<FormField name={'description'} control={formupdate.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl><Textarea placeholder={"entre votre description"} {...field} /></FormControl>
								<FormMessage className={'text-red-500'} />
							</FormItem>
						)} />

					</div>
					<div className={'grid grid-cols-2 gap-4'}>
						<Button variant={'ghost'} type={'button'} onClick={() => {
							formupdate.reset({
								projet_type: '',
								description: '',
								offre: false,
							})
						}}>Annuler</Button>
						<Button type={'submit'} variant={'default'}>Changer</Button>
					</div>
				</form>
			</Form>
		)
		: (
			<Form {...formsave}>
				<form noValidate onSubmit={formsave.handleSubmit((data) => AddorEditMutation.mutate(data))}
				      className={'grid grid-cols-1 gap-4'}>
					<div className={'grid grid-cols-4 gap-4 justify-center align-middle items-center'}>
						<div className={'col-span-3'}>
							<FormField name={'projet_type'} control={formsave.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Projet Type</FormLabel>
									<FormControl><InputWithIcon icon={BriefcaseBusiness} iconPosition={'left'} {...field} /></FormControl>
									<FormMessage className={'text-red-500'} />
								</FormItem>
							)} />
						</div>
						<div>
							<FormField name={'offre'} control={formsave.control} render={({ field }) => (
								<FormItem>
									<FormLabel>Offre</FormLabel>
									<FormControl><Checkbox onChange={field.onChange} /></FormControl>
									<FormMessage className={'text-red-500'} />
								</FormItem>
							)} />
						</div>
					</div>
					<div className={'grid grid-cols-1'}>
						<FormField name={'client_id'} control={formsave.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Client</FormLabel>
								<FormControl>
									<AutoCompleteSelect element={mapData}  onChange={setClientNom} onSelect={field.onChange} />
								</FormControl>
							</FormItem>
						)}
						/>
					</div>
					<div className={'grid grid-cols-1'}>
						<FormField name={'description'} control={formsave.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl><Textarea placeholder={"entre votre description"} {...field} /></FormControl>
								<FormMessage className={'text-red-500'} />
							</FormItem>
						)} />

					</div>
					<div className={'grid grid-cols-2 gap-4'}>
						<Button variant={'ghost'} onClick={() => {
							formsave.reset({
								projet_type: '',
								client_id: '',
								description: '',
								offre: false,
							})
						}}>Annuler</Button>
						<Button>Ajouter</Button>
					</div>
				</form>
			</Form>
		)
}

export default ProjetForm