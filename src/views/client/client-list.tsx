'use client'

import { Chip } from '@/components/chip/Chip';
import { OpenDialogControl, OpenDialogonClick } from "@/components/dialog/OpenDialogOnClick";
import TableGeneric from "@/components/table/tablegenric";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { ClientService } from "@/service/client/client.service";
import { ClientType } from "@/types/client.type";
import UtiliMetod from "@/utils/utilMethod";
import ClientForm from "@/views/client/client-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/table-core";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";


const columnsHealper = createColumnHelper<ClientType>()

const ClientList = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [clientUp, setClientUp] = useState<ClientType | null>(null)

    const queryClient = useQueryClient();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState('');


    const DeleteMutaion = useMutation({
        mutationFn: async (id: string) => {
            return await ClientService.deleteClient(id)
        },
        onSuccess: () => {

            toast.success("Supprimer avec succes", {
                duration: 3000
            })
            queryClient.invalidateQueries({
                queryKey: [ClientService.CLIENT_KEY, pageSize, pageIndex]
            })
        },
        onError: () => {
            toast.error("Erreur de suppression", {
                duration: 3000
            })
        }
    })

    const colunms = useMemo(() => [

        columnsHealper.accessor('nom', {
            header: 'Nom'
        }),
        columnsHealper.accessor('sigle', {
            header: 'Sigle'
        }),
        columnsHealper.accessor('lieu', {
            header: 'Lieu'
        }),
        columnsHealper.accessor('telephone', {
            header: 'Telephone'
        }),
        columnsHealper.accessor('potentiel', {
            header: 'Potentiel',
            cell: ({ row }) => <Chip size={'sm'} variant={row.original.potentiel ? 'success' : 'warning'} title={row.original.potentiel ? 'Oui' : 'Nom'}>{row.original.potentiel ? 'Oui' : 'Nom'}</Chip>
        }),
        columnsHealper.display({
            header: 'Actions',
            cell: ({ row }) => (
                <div className={'flex flex-row gap-2 justify-center'}>
                    <Button onClick={() => { setClientUp(row.original) }} >
                        <SquarePen />
                    </Button>
                    <Button onClick={() => UtiliMetod.SuppressionConfirmDialog({
                        title: `Suppression de ${row.original.nom}`,
                        confirmAction: () => DeleteMutaion.mutate(row.original.id)
                    })} variant={'destructive'} size={'icon'}>
                        <Trash2 />
                    </Button>
                </div>
            )
        })
    ], [])

    const { data, isLoading, isError } = useQuery(
        {
            queryKey: [ClientService.CLIENT_KEY, pageSize, pageIndex],
            queryFn: async () => {
                return await ClientService.getClients({ page: pageIndex, pagesize: pageSize })
            },
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            staleTime: 5 * 60 * 1000,
        }
    )

    const filterData = useMemo(() => {
        if (!data || !data.content) return []
        return data.content.filter(c => c.nom.toLowerCase().includes(filter.toLowerCase()) || c.lieu.toLowerCase() === filter.toLowerCase())
    }, [data, filter])

    return <><TableGeneric
        totalElements={data?.totalElements}
        totalPages={data?.totalPages}
        isError={isError}
        isLoading={isLoading}
        data={filterData}
        columns={colunms}
        setPage={setPageIndex}
        setPageSize={setPageSize}
        visibleColumns={true}
        pagination={{ visible: true }}
        rightElement={
            <div className={'flex flex-col sm:flex-row gap-3 justify-between align-middle items-end'}>
                <InputWithIcon icon={Search} iconPosition={'left'} onChange={(e) => setFilter(e.target.value)}
                    placeholder={"Recherch un Client"} />
                <OpenDialogonClick open={openDialog}
                    setOpen={setOpenDialog}
                    buttonprops={{
                        buttonIcon: Plus,
                        buttonLabel: 'Client',
                    }}
                    dialogprops={{
                        title: 'Client',
                        description: 'Ajoute un client',
                        children: <ClientForm onSucces={() => setOpenDialog(false)} />
                    }}
                />

            </div>
        }
    />

        <OpenDialogControl open={!!clientUp} setOpen={(open) => { if (!open) setClientUp(null) }} dialogprops={{
            title: 'Client',
            description: `Mise a jour de ${clientUp?.nom}`,
            children: <ClientForm edit={true} data={clientUp ?? undefined} onSucces={() => setClientUp(null)} />
        }} />
    </>
}

export default ClientList