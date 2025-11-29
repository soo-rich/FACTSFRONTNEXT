'use client'
import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import Typography from '@mui/material/Typography'


import { toast } from 'react-toastify'

import Tooltip from '@mui/material/Tooltip'



import { styled } from '@mui/material/styles'

import classNames from 'classnames'

import { KeyRound } from 'lucide-react'

import TableGeneric from '@components/table/TableGeneric'


import type { UtilisateurDto } from '@/types/soosmart/utilisateur.type'
import { UserService } from '@/service/user/user.service'
import DefaultDialog from '@components/dialogs/unique-modal/DefaultDialog'


import { getInitials } from '@/utils/getInitials'
import CustomAvatar from '@/@core/components/mui/Avatar'


import UtiliMetod from '@/utils/utilsmethod'


import CustomIconButton from '@/@core/components/mui/IconButton'
import AddEditUser from '@views/soosmart/user/add-edit-user'

const Icon = styled('i')({})

type UserRoleType = {
  [key: string]: { icon: string; color: string }
}
const columnHelper = createColumnHelper<UtilisateurDto>()





const UserIndex = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userselect, setUserSelect] = useState<UtilisateurDto | undefined>(undefined)

  const userRoleObj: UserRoleType = {
    admin: { icon: 'tabler-crown', color: 'success' },
    user: { icon: 'tabler-user', color: 'info' },
  }


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

  const ResetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return await UserService.forgotUserPassword(email)
    },
    onSuccess: () => {
      toast.success('Réinitialisation du mot de passe effectuée. le Mail sera envoyé.')
    },
    onError: () => {
      toast.error('Erreur lors de la réinitialisation du mot de passe')
    }
  })

  const iconStyleActive = classNames(
    'tabler-square-rounded-check-filled',
    'text-2xl text-green-600',
    'cursor-pointer',
    'hover:text-green-800'
  );

  const iconStyleInactive = classNames(
    'tabler-square-rounded-x',
    'text-2xl',
    'cursor-pointer',
    'hover:text-red-800',
  );




  const columns = useMemo(
    () => [

      columnHelper.accessor('nom', {
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <CustomAvatar size={34}>{getInitials(row.original.username.toUpperCase())}</CustomAvatar>
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
          <div className='flex items-center gap-2'>
            <Icon
              className={userRoleObj[row.original.role?.toString().toLowerCase()]?.icon}
              sx={{ color: `var(--mui-palette-${userRoleObj[row.original?.role?.toLowerCase()]?.color}-main)` }}
            />
            <Typography className='capitalize' color='text.primary'>
              {row.original.role.toLocaleLowerCase()}
            </Typography>
          </div>
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
            <Tooltip placement={'top'} title={row.original.actif ? 'Désactiver utilisateur' : 'Activer utilisateur'}>
              <CustomIconButton
                onClick={() => {
                  UtiliMetod.confirmDialog({
                    title: row.original.nom,
                    subtitle: `Voulez-vous ${row.original.actif ? 'désactiver' : 'activer'} cet utilisateur ?`,
                    confirmAction: () =>
                      ActivateMutation.mutate(row.original.id)
                  })
                }}
              >
                <i className={classNames(!row.original.actif ? iconStyleActive : iconStyleInactive)} />
              </CustomIconButton>
            </Tooltip>
            <Tooltip placement={'top'} title={'reinitialiser le mot de passe'}>
              <CustomIconButton
                onClick={() => {
                  UtiliMetod.confirmDialog({
                    title: row.original.nom,
                    subtitle: `Voulez-vous réinitialiser le mot de passe de ${row.original.nom} ?`,
                    confirmAction: () =>
                      ResetPasswordMutation.mutate(row.original.email)
                  })
                }}
              >
                <KeyRound className="text-2xl cursor-pointer hover:text-blue-800" />
              </CustomIconButton>
            </Tooltip>
            <CustomIconButton
              onClick={() => UtiliMetod.confirmDialog({
                title: row.original.nom,
                subtitle: 'Voulez-vous supprimer cet utilisateur ?',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      onClose={() => {
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
