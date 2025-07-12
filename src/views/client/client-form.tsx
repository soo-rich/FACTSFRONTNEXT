import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input, InputWithIcon } from '@/components/ui/input'
import { ClientService } from "@/service/client/client.service"
import { ClientSave, ClientType, schemaClient } from "@/types/client.type"
import { FormEditAddType } from "@/types/form-edit-add/form-edit-add.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FlagIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/material.css'


const ClientForm = ({ edit, data: client, onSucces: succes }: FormEditAddType<ClientType>) => {
	const queryclient = useQueryClient()
	const formSave = useForm<ClientSave>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: zodResolver(schemaClient),
		defaultValues: {
			nom: client?.nom ?? '',
			sigle: client?.sigle ?? '',
			lieu: client?.lieu ?? '',
			telephone: client?.telephone ?? '',
			potentiel: client?.potentiel ?? false,
		},
	})

	useEffect(() => {
		console.log(client)
	}, [client]);

	const AddMutatio = useMutation({
		mutationFn: async (data: ClientSave) => {
			return edit && client?.id ? await ClientService.updateClient(client?.id, { ...data }) : await ClientService.saveClient(data)
		},
		onSuccess: () => {
			toast.success(edit ? 'Modification du client ' : "Ajout du client")
			queryclient.invalidateQueries({
				queryKey: [ClientService.CLIENT_KEY],
			})
			succes?.()
		}, onError: () => {
			toast.error(edit ? 'mise a jour echouer' : "Echec Ajout du client")
		}
	})

	return <Form {...formSave}>
		<form noValidate onSubmit={formSave.handleSubmit((data) => AddMutatio.mutate(data))}
			className={"grid grid-cols-1 gap-4"}>
			<div className={"grid grid-cols-1 gap-4"}>
				<div className={'grid grid-cols-4 gap-4 justify-center align-middle items-center'}>
					<div className={'col-span-3'}>
						<FormField name={'nom'} control={formSave.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Nom</FormLabel>
								<FormControl><Input {...field} onChange={field.onChange} /></FormControl>
								<FormMessage className={'text-red-500'} />
							</FormItem>
						)} />
					</div>
					<div className={'col-span-1'}>
						<FormField name={'potentiel'} control={formSave.control} render={({ field }) => (
							<FormItem>
								<FormLabel>Potentiel</FormLabel>
								<FormControl><Checkbox defaultChecked={field.value} onChange={() => field.onChange(!field.value)} /></FormControl>
								<FormMessage className={'text-red-500'} />
							</FormItem>
						)} />
					</div>

				</div>
				<div className={"grid grid-cols-1"}>
					<FormField name={'sigle'} control={formSave.control} render={({ field }) => (
						<FormItem>
							<FormLabel>Sigle</FormLabel>
							<FormControl><Input {...field} onChange={field.onChange} /></FormControl>
							<FormMessage className={'text-red-500'} />
						</FormItem>
					)} />
				</div>
				<div className={"grid grid-cols-1"}>
					<FormField name={'lieu'} control={formSave.control} render={({ field }) => (
						<FormItem>
							<FormLabel>Lieu</FormLabel>
							<FormControl><Input {...field} onChange={field.onChange} /></FormControl>
							<FormMessage className={'text-red-500'} />
						</FormItem>
					)} />
				</div>
				<div className={"grid grid-cols-1"}>
					<FormField name={'telephone'} control={formSave.control} render={({ field }) => (
						<FormItem>
							<FormLabel>Telephone</FormLabel>
							<FormControl>
								<InputWithIcon {...field} icon={FlagIcon} onChange={(e) => {
									const n = Number(e.target.value)
									if (isNaN(n)) {
										return
									}
									field.onChange(String(n))
								}}
								/>
							</FormControl>
							<FormMessage className={'text-red-500'} />
						</FormItem>
					)} />
				</div>

			</div>
			<div
				className={'grid grid-cols-2 gap-4 justify-center align-middle items-center'}
			>
				<Button type={'button'} variant={'ghost'} onClick={() => {
					formSave.reset({
						nom: '',
						sigle: '',
						lieu: '',
						telephone: '',
						potentiel: false,
					})
				}}>Annuler</Button>
				<Button type={'submit'}>
					{edit ? 'Modifier' : 'Ajouter'}
				</Button>

			</div>


		</form>
	</Form>
}

export default ClientForm