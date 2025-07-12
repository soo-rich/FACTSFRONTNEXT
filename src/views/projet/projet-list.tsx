'use client'

import { OpenDialogControl, OpenDialogonClick } from '@/components/dialog/OpenDialogOnClick';
import TableGeneric from '@/components/table/tablegenric';
import CustomTooltip from '@/components/tooltip/custom-tooltip';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input';
import { ProjetService } from '@/service/projet/projet.service';
import { ProjetType } from '@/types/projet.type';
import utilMethod from '@/utils/utilMethod';
import ProjetForm from '@/views/projet/projet-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/table-core';
import { Check, Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';


const colunmsHelper = createColumnHelper<ProjetType>();

const ProjetList = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [projetUp, setProjetUp] = useState<ProjetType | null>(null)

	const queryClient = useQueryClient();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [filter, setFilter] = useState('');

	const DeleteMutation = useMutation({
		mutationFn: async (id: string) => {
			return await ProjetService.deleteProjet(id)
		},
		onSuccess: () => {
			toast.success('Suppresion OK ', {
				duration: 3000,
			});
			queryClient.invalidateQueries({
				queryKey: [ProjetService.PROJT_KEY, pageIndex, pageSize],
			})
		},
		onError: () => {
			toast.error('Erreur lors de la suppression du projet', {
				duration: 1000,
			});
		},
	})
	const ChangeOffreMuttaion = useMutation({
		mutationFn: async (id: string) => {
			return await ProjetService.changeOffre(id)
		},
		onSuccess: (data) => {
			toast.success(data ? "C'est devenu un Offre" : "C'est n'es plus un Offre", {
				duration: 3000,
			});
			queryClient.invalidateQueries({
				queryKey: [ProjetService.PROJT_KEY, pageIndex, pageSize],
			})
		},
		onError: () => {
			toast.error('Erreur lors de la Changement du projet', {
				duration: 5000,
			});
		},
	})

	const { data, isError, isLoading } = useQuery({
		queryKey: [ProjetService.PROJT_KEY, pageIndex, pageSize],
		queryFn: () => {
			return ProjetService.getAllProjet({ page: pageIndex, pagesize: pageSize })
		},
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	})

	const columns = useMemo(() => [
		colunmsHelper.display({
			header: '#',

		}),
		colunmsHelper.accessor('projet_type', {
			header: 'Projet Type',
			cell: ({ row }) => row.original.projet_type,
		}),
		colunmsHelper.accessor('description', {
			header: 'Description',
			cell: ({ row }) => row.original.description,
		}),
		colunmsHelper.accessor('client', {
			header: 'Client',
			cell: ({ row }) => row.original.client,
		}),
		colunmsHelper.accessor('offre', {
			header: 'Offre',
			cell: ({ row }) => (
				<>
					{
						row.original.offre ? (<CustomTooltip title={"activer"}><X className={'text-blue-900'} onClick={() => {
							ChangeOffreMuttaion.mutate(row.original.id)
						}} /></CustomTooltip>) : (<CustomTooltip title={"Oui"}><Check className={'text-green-700'} onClick={() => {
							ChangeOffreMuttaion.mutate(row.original.id)
						}} /></CustomTooltip>)
					}
				</>
			),
		}),
		colunmsHelper.accessor('update_at', {
			header: 'Mis a jour le ',
			cell: ({ row }) => utilMethod.formatDate(row.original.update_at),
		}),
		colunmsHelper.display({
			header: 'Action',
			cell: ({ row }) => (
				<div className="flex flex-row gap-2 justify-center">
					<Button size={'icon'} onClick={() => setProjetUp(row.original)} >
						<SquarePen />
					</Button>
					<Button variant={'destructive'} size={'icon'} onClick={() => utilMethod.SuppressionConfirmDialog({
						title: row.original.projet_type,
						subtitle: `Vous aller suppriimer ${row.original.projet_type}`,
						confirmAction: () => {
							DeleteMutation.mutate(row.original.id)
						},
					})} ><Trash2 /></Button>
				</div>
			),
		}),
	], [])

	const filterData = useMemo(() => {
		if (!data || !data.content) return [];
		return data.content.filter(projet => projet.projet_type.toLowerCase().includes(filter.toLowerCase()))
	}, [data, filter])

	return (<>
		<TableGeneric
			isLoading={isLoading}
			isError={isError}
			data={filterData}
			columns={columns}
			page={pageIndex}
			pageSize={pageSize}
			setPage={setPageIndex}
			setPageSize={setPageSize}
			totalPages={data?.totalPages}
			totalElements={data?.totalElements}
			visibleColumns={true}
			pagination={{
				visible: true,
			}}
			rightElement={
				<div className={'flex flex-col sm:flex-row gap-3 justify-between align-middle items-end'}>
					<InputWithIcon icon={Search} iconPosition={'left'} onChange={(e) => setFilter(e.target.value)}
						placeholder={"Recherch un Projet"} />
					<OpenDialogonClick
						open={openDialog}
						setOpen={setOpenDialog}
						buttonprops={{
							buttonIcon: Plus,
							buttonLabel: 'Projet',
						}}
						dialogprops={{
							title: 'Ajouter Un Projet',
							description: 'Ajouter un projet',
							children: (<ProjetForm onSucces={() => setOpenDialog(false)} />),
						}}
					/>
				</div>

			}
		/>
		<OpenDialogControl open={!!projetUp} setOpen={(open) => {
			if (!open) setProjetUp(null)
		}} dialogprops={{
			title: `Mise a jour de ${projetUp?.projet_type}`,
			description: 'Modifier un Projet',
			children: (<ProjetForm edit={true} data={projetUp ?? undefined} onSucces={() => setProjetUp(null)} />),
		}} />
	</>)
}

export default ProjetList