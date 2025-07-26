'use client';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import {ClientType} from "@/types/soosmart/client.type";
import {ClientService} from "@/service/client/client.service";
import {toast} from "react-toastify";
import {createColumnHelper} from "@tanstack/react-table";
import TableGeneric from "@components/table/TableGeneric";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {Grid2} from "@mui/material";
import CustomIconButton from "@core/components/mui/IconButton";
import UtiliMetod from "@/utils/utilsmethod";
import OptionMenu from "@core/components/option-menu";
import DefaultDialog from "@/components/dialogs/unique-modal/DefaultDialog";
import AddEditClient from "@views/soosmart/client/add-edit-client";

const columnHelper = createColumnHelper<ClientType>();

const ClientIndex = () => {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');
  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSelect, setClientSelect] = useState<ClientType | undefined>(undefined);


  const {data, isLoading, isError} = useQuery({
    queryKey: [ClientService.CLIENT_KEY, pageIndex, pageSize],
    queryFn: async () => {
      return await ClientService.getClients({page: pageIndex, pagesize: pageSize})
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ClientService.deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ClientService.CLIENT_KEY],
      });
      toast.success('Client supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du client');
    }
  });

  const ChangePotentielMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ClientService.changePotentiel(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ClientService.CLIENT_KEY],
      });
      toast.success(`Changement de potentiel ${data ? 'activé' : 'désactivé'} avec succès`);
    },
    onError: () => {
      toast.error('Erreur lors du changement de potentiel du client');
    }
  })


  const columns = useMemo(() => [

    columnHelper.accessor('nom', {
      header: 'Nom',
      cell: ({row}) => (
        <Typography> {row.original.nom}</Typography>
      )
    }),
    columnHelper.accessor('lieu', {
      header: 'Lieu',
      cell: ({row}) => (
        <Typography> {row.original.lieu}</Typography>
      )
    }),
    columnHelper.accessor('sigle', {
      header: 'Sigle',
      cell: ({row}) => (
        <Typography> {row.original.sigle}</Typography>
      )
    }),
    columnHelper.accessor('telephone', {
      header: 'Téléphone',
      cell: ({row}) => (
        <Typography> {row.original.telephone}</Typography>
      )
    }),
    columnHelper.accessor('potentiel', {
      header: 'Potentiel',
      cell: ({row}) => (
        <Chip variant={row.original.potentiel ? 'tonal' : 'outlined'}
              color={row.original.potentiel ? 'success' : 'warning'} label={row.original.potentiel ? 'Oui' : 'Nom'}/>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({row}) => (
        <Grid2 container direction={'row'} spacing={2} justifyContent="center">
          <CustomIconButton
            onClick={() => {
              setClientSelect(row.original);
              setIsModalOpen(true);
            }}
            className='cursor-pointer text-yellow-600 hover:text-yellow-800'
          >
            <i className='tabler-edit'/>
          </CustomIconButton>
          <CustomIconButton
            onClick={() => UtiliMetod.SuppressionConfirmDialog({
              data: row.original.nom,
              confirmAction: () => DeleteMutation.mutate(row.original.id),
            })}
            className='cursor-pointer text-red-600 hover:text-red-800'
          >
            <i className='tabler-trash-filled'/>
          </CustomIconButton>
          <OptionMenu
            iconButtonProps={{size: 'medium'}}
            iconClassName='text-textSecondary'
            options={[
              {
                text: 'Details',
                icon: 'tabler-eye',
                menuItemProps: {className: 'flex items-center gap-2 text-textSecondary'}
              },
              {
                text: row.original.potentiel ? 'Nom' : 'Oui',
                icon: row.original.potentiel ? 'tabler-x' : 'tabler-check',
                menuItemProps: {
                  className: 'flex items-center gap-2 text-textSecondary',
                  onClick: () => ChangePotentielMutation.mutate(row.original.id)
                }
              }
            ]}
          />
        </Grid2>
      )
    })
  ], [])


  return (
    <>
      <TableGeneric
        tabledata={data?.content}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        page={pageIndex}
        SetPage={setPageIndex}
        pageSize={pageSize}
        SetPageSize={setPageSize}
        globalFilter={filter}
        setGlobalFilter={setFilter}
        totalElements={data?.totalElements}
        buttonadd={{
          action: () => setIsModalOpen(true)
        }}/>


      <DefaultDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={clientSelect ? ` Mettre a jour ${clientSelect?.nom}` : 'Ajouter un Client'}
      >
        <AddEditClient data={clientSelect} onSuccess={() => {
          setIsModalOpen(false);
          setClientSelect(undefined);
        }} onCancel={() => {
          setIsModalOpen(false);
          setClientSelect(undefined);
        }}/>
      </DefaultDialog>
    </>
  )
}


export default ClientIndex
