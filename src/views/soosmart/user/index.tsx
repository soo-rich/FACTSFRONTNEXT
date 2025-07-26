'use client'
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import TableGeneric from "@components/table/TableGeneric";
import {createColumnHelper} from "@tanstack/react-table";
import {UtilisateurDto} from "@/types/soosmart/utilisateur.type";
import {UserService} from "@/service/user/user.service";
import DefaultDialog from "@components/dialogs/unique-modal/DefaultDialog";

const columnHelper = createColumnHelper<UtilisateurDto>();

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


  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('nom', {
        header: 'Nom',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('prenom', {
        header: 'Prénom',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      // Ajoutez d'autres colonnes selon vos besoins
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
      <></>
    </DefaultDialog>

  </>
}


export default UserIndex;
