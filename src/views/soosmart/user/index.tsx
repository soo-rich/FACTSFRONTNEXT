'use client'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import TableGeneric from "@components/table/TableGeneric";
import {createColumnHelper} from "@tanstack/react-table";
import {UtilisateurDto} from "@/types/soosmart/utilisateur.type";
import {UserService} from "@/service/user/user.service";
import DefaultDialog from "@components/dialogs/unique-modal/DefaultDialog";
import Typography from "@mui/material/Typography";
import {getInitials} from "@/utils/getInitials";
import CustomAvatar from "@/@core/components/mui/Avatar";
import Chip from "@mui/material/Chip";
import type {ThemeColor} from "@core/types";
import UtiliMetod from "@/utils/utilsmethod";
import {toast} from "react-toastify";
import CustomIconButton from "@/@core/components/mui/IconButton";
import AddEditUser from "@views/soosmart/user/add-edit-user";
import OptionMenu from "@core/components/option-menu";
import Checkbox from "@mui/material/Checkbox";

type UserStatusType = {
  [key: string]: ThemeColor
}
const columnHelper = createColumnHelper<UtilisateurDto>();
const userStatusObj: UserStatusType = {
  super_admin: 'success',
  admin: 'info',
  user: 'secondary'
}
const UserIndex = () => {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');
  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userselect, setUserSelect] = useState<UtilisateurDto | undefined>(undefined)


  const {data, isLoading, isError} = useQuery({
    queryKey: [UserService.USER_KEY, pageIndex, pageSize],
    queryFn: async () => {
      // Remplacez par votre service pour récupérer les utilisateurs
      return await UserService.getAllorOnebyEmail({
        params: {
          page: pageIndex, pagesize:
          pageSize
        }
      });
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await UserService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY, pageIndex, pageSize],
      }).then(r => r);
      toast.success('Suppresion OK ');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de l\'article');
    },
  });

  const ActivateMutation = useMutation({
    mutationFn: async (id: string) => {
      return await UserService.activateorDesactivate(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY, pageIndex, pageSize],
      }).then(r => r);
      toast.success(`${data ? 'Activation OK' : 'Désactivation OK '}`);
    },
    onError: () => {
      toast.error('Erreur lors de l\'activation/désactivation de l\'utilisateur');
    }
  })


  const columns = useMemo(
    () => [
      columnHelper.accessor('nom', {
        header: 'User',
        cell: ({row}) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar size={34}>{getInitials(row.original.username)}</CustomAvatar>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nom}{' '}{row.original.prenom}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('telephone', {
        header: 'Telphone',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({row}) => (
          <Chip
            variant='tonal'
            label={row.original.role}
            size='small'
            color={userStatusObj[row.original.role.toLowerCase()]}
            className='capitalize'
          />
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('dateCreation', {
        header: 'Creer le .',
        cell: ({row}) => (
          <Typography variant='body2'
                      color={'info'}
                      className='capitalize'
          >{UtiliMetod.formatDate(row.original.dateCreation)}</Typography>
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('actif', {
        header: 'Active',
        cell: ({row}) => (
          <Checkbox checked={row.original.actif}/>
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.display({
        id: 'actions', // Important: donner un ID à la colonne display
        header: 'Actions',
        cell: ({row}) => (
          <div className='flex gap-2'>
            <CustomIconButton
              onClick={() => {
                setUserSelect(row.original);
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
                  text: row.original.actif ? 'Désactiver' : 'Activer',
                  icon: row.original.actif ? 'tabler-lock-open' : 'tabler-lock',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => ActivateMutation.mutate(row.original.id)
                  }
                }
              ]}
            />
          </div>
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),

    ],
    []
  );


  return <><TableGeneric
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
    }}
  />

    <DefaultDialog
      open={isModalOpen}
      setOpen={setIsModalOpen}
      title={userselect ? ` Mettre a jour ${userselect.username}` : 'Ajouter un Utilisateur'}
    >
      <AddEditUser data={userselect} onSuccess={() => {

        setIsModalOpen(false);
        setUserSelect(undefined);
      }} onCancel={() => {

        setIsModalOpen(false);
        setUserSelect(undefined);
      }}/>
    </DefaultDialog>

  </>
}


export default UserIndex;
