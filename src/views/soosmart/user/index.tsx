'use client'
import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import Typography from '@mui/material/Typography'

import Chip from '@mui/material/Chip'

import { toast } from 'react-toastify'

import Tooltip from '@mui/material/Tooltip'

import TableGeneric from '@components/table/TableGeneric'


import type { UtilisateurDto } from '@/types/soosmart/utilisateur.type'
import { UserService } from '@/service/user/user.service'
import DefaultDialog from '@components/dialogs/unique-modal/DefaultDialog'


import { getInitials } from '@/utils/getInitials'
import CustomAvatar from '@/@core/components/mui/Avatar'


import type { ThemeColor } from '@core/types'
import UtiliMetod from '@/utils/utilsmethod'


import CustomIconButton from '@/@core/components/mui/IconButton'
import AddEditUser from '@views/soosmart/user/add-edit-user'


type UserStatusType = {
  [key: string]: ThemeColor
}
const columnHelper = createColumnHelper<UtilisateurDto>()

const userStatusObj: UserStatusType = {
  super_admin: 'success',
  admin: 'info',
  user: 'secondary'
}

const UserIndex = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userselect, setUserSelect] = useState<UtilisateurDto | undefined>(undefined)


  const { data, isLoading, isError } = useQuery({
    queryKey: [UserService.USER_KEY, pageIndex, pageSize],
    queryFn: async () => {
      // Remplacez par votre service pour récupérer les utilisateurs
      return await UserService.getAllorOnebyEmail({
        params: {
          page: pageIndex, pagesize:
          pageSize
        }
      })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await UserService.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY, pageIndex, pageSize]
      }).then(r => r)
      toast.success('Suppresion OK ')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de l\'article')
    }
  })

  const ActivateMutation = useMutation({
    mutationFn: async (id: string) => {
      return await UserService.activateorDesactivate(id)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY, pageIndex, pageSize]
      }).then(r => r)
      toast.success(`${data ? 'Activation OK' : 'Désactivation OK '}`)
    },
    onError: () => {
      toast.error('Erreur lors de l\'activation/désactivation de l\'utilisateur')
    }
  })


  const columns = useMemo(
    () => [
      columnHelper.accessor('actif', {
        header: 'Actif',
        cell: ({row}) => <Tooltip placement={'top'} title={row.original.actif ? 'Actif' : 'Non actif'}>{
          row.original.actif ? <i className={' bg-success text-2xl tabler-square-rounded-check-filled cursor-pointer'}  onClick={ () => ActivateMutation.mutate(row.original.id)}></i> :
            <i className={'bg-error text-2xl tabler-square-rounded-x cursor-pointer'} onClick={ () => ActivateMutation.mutate(row.original.id)} ></i>}</Tooltip>
      }),
      columnHelper.accessor('nom', {
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <CustomAvatar size={34}>{getInitials(row.original.username)}</CustomAvatar>
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.nom}{' '}{row.original.prenom}
              </Typography>
              <Typography variant="body2">{row.original.email}</Typography>
            </div>
          </div>
        ),
        enableHiding: true // Permet de cacher cette colonne
      }),
      columnHelper.accessor('telephone', {
        header: 'Telphone',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true // Permet de cacher cette colonne
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <Chip
            variant="tonal"
            label={row.original.role}
            size="small"
            color={userStatusObj[row.original.role.toLowerCase()]}
            className="capitalize"
          />
        ),
        enableHiding: true // Permet de cacher cette colonne
      }),
      columnHelper.accessor('dateCreation', {
        header: 'Creer le .',
        cell: ({ row }) => (
          <Typography variant="body2"
                      color={'info'}
                      className="capitalize"
          >{UtiliMetod.formatDate(row.original.dateCreation)}</Typography>
        ),
        enableHiding: true // Permet de cacher cette colonne
      }),

      columnHelper.display({
        id: 'actions', // Important: donner un ID à la colonne display
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <CustomIconButton
              onClick={() => {
                setUserSelect(row.original)
                setIsModalOpen(true)
              }}
              className="cursor-pointer text-yellow-600 hover:text-yellow-800"
            >
              <i className="tabler-edit" />
            </CustomIconButton>
            <CustomIconButton
              onClick={() => UtiliMetod.SuppressionConfirmDialog({
                data: row.original.nom,
                confirmAction: () => DeleteMutation.mutate(row.original.id)
              })}
              className="cursor-pointer text-red-600 hover:text-red-800"
            >
              <i className="tabler-trash" />
            </CustomIconButton>

          </div>
        ),
        enableHiding: true // Permet de cacher cette colonne
      })

    ],
    [ActivateMutation, DeleteMutation]
  )


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
      action: () => {
        setIsModalOpen(true)
        setUserSelect(undefined)
      }
    }}
  />

    <DefaultDialog
      open={isModalOpen}
      setOpen={setIsModalOpen}
      onClose={()=>{
        setUserSelect(undefined)
      }}
      title={userselect ? ` Mettre a jour ${userselect.username}` : 'Ajouter un Utilisateur'}
    >
      <AddEditUser data={userselect} onSuccess={() => {

        setIsModalOpen(false)
        setUserSelect(undefined)
      }} onCancel={() => {

        setIsModalOpen(false)
        setUserSelect(undefined)
      }} />
    </DefaultDialog>

  </>
}


export default UserIndex
