'use client';
import { OpenDialogControl, OpenDialogonClick } from '@/components/dialog/OpenDialogOnClick';
import TableGeneric from '@/components/table/tablegenric';
import CustomTooltip from '@/components/tooltip/custom-tooltip'
import { InputWithIcon } from '@/components/ui/input';
import { UserService } from '@/service/user/user.service';
import { UtilisateurDto } from '@/types/utilisateur.type';
import { default as UtiliMetod, default as utilMethod } from '@/utils/utilMethod';
import UserForm from '@/views/users/user-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/table-core';
import { Check, PencilLine, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const columsHelper = createColumnHelper<UtilisateurDto>();

const UserList = () => {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<UtilisateurDto | null>(null);
  const [openDialogN, setOpenDialogN] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');

  const { data, isError, isLoading } = useQuery({
    queryKey: [UserService.USER_KEY, pageIndex, pageSize],
    queryFn: () => {
      return UserService.getAllorOnebyEmail({ params: { page: pageIndex, pagesize: pageSize } });
    },
  });

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await UserService.delete(id);
    },
    onSuccess: (data) => {
      toast.success('Supprimer avec succes');
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      }).then(r => r);
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const ChangeActif=useMutation({
    mutationFn: async(id:string)=>{
      return await UserService.activateorDesactivate(id)
    },
    onSuccess: (data) => {
      toast.success('Etat mis a jour avec succes');
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      }).then(r => r);
    },
    onError: () => {
      toast.error('Erreur lors du changement d\'etat');
    },
  })

  const columns = useMemo(() => [
    columsHelper.display({
      header: '#',
    }),
    columsHelper.accessor('nom', {
      header: 'Nom',
      cell: ({ row }) => row.original?.nom,
    }),
    columsHelper.accessor('prenom', {
      header: 'Prenom',
      cell: ({ row }) => row.original?.prenom,
    }),
    columsHelper.accessor('email', {
      header: 'Email',
      cell: ({ row }) => row.original?.email,
    }),
    columsHelper.accessor('telephone', {
      header: 'Telephone',
      cell: ({ row }) => row.original?.telephone,
    }),

    columsHelper.accessor('role', {
      header: 'Role',
      cell: ({ row }) => row.original?.role,
    }),
    columsHelper.accessor('dateCreation', {
      header: 'Cree le .',
      cell: ({ row }) => UtiliMetod.formatDate(row.original?.dateCreation),
    }),
    columsHelper.accessor('actif', {
      header: 'Activer',
      cell: ({ row }) =>  {
       return  row.original.actif
         ?(
           <CustomTooltip title={"Descativer"}>
             <X  onClick={()=>ChangeActif.mutate(row.original.id)}/>
           </CustomTooltip>

         )
         :(
           <CustomTooltip title={"Activer"}>

           <Check color={"#1865db "} onClick={()=>ChangeActif.mutate(row.original.id)} />
           </CustomTooltip>
         )
      }
    }),
    columsHelper.display({
      header: 'Actions',
      cell: ({ row }) => (
        <div className={'flex flex-col sm:flex-row gap-3'}>

          <PencilLine onClick={() => setEditUser(row.original)} />

          <Trash2 className={'text-red-500'} onClick={() => {
            utilMethod.SuppressionConfirmDialog({
              title: row.original.nom,
              confirmAction: () => {
                DeleteMutation.mutate(row.original.id);
              },
            });
          }} />
        </div>
      ),
    }),
  ], []);

  const filterData = useMemo(() => {
    if (!data || !data.content) return [];
    return data.content.filter(user => user?.nom.toLowerCase().includes(filter.toLowerCase()) || user?.prenom.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);


  return (<>
    <TableGeneric
      data={filterData}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      page={pageIndex}
      pageSize={pageSize}
      setPage={setPageIndex}
      setPageSize={setPageSize}
      visibleColumns={true}
      totalElements={data?.totalElements}
      totalPages={data?.totalPages}
      rightElement={
        <div className={'flex flex-col sm:flex-row gap-3 justify-between align-middle items-end'}>
          <InputWithIcon icon={Search} iconPosition={'left'} onChange={(e) => setFilter(e.target.value)}
            placeholder={'Recherch un Utilisteur'} />
          <OpenDialogonClick
            open={openDialogN}
            setOpen={setOpenDialogN}
            buttonprops={{
              buttonIcon: Plus,
              buttonLabel: 'Utilisateur',
            }}
            dialogprops={{
              title: 'Utilsateur',
              description: 'Ajouter un utilisateur',
              children: <UserForm onSucces={() => setOpenDialogN(false)} />,
            }}
          />
        </div>
      }
    />
    <OpenDialogControl open={!!editUser} setOpen={(open) => {
      if (!open) setEditUser(null)
    }} dialogprops={{
      title: `Mise a jour de ${editUser?.nom}`,
      description: 'Modifier un Utiilisateur',
      children: (<UserForm edit={true} user={editUser ?? undefined} onSucces={() => setEditUser(null)} />)
    }} />
  </>);
};


export default UserList;