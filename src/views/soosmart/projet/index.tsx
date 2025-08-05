'use client'
import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import Typography from '@mui/material/Typography'

import { toast } from 'react-toastify'

import Chip from '@mui/material/Chip'

import TableGeneric from '@components/table/TableGeneric'

import { ProjetService } from '@/service/projet/projet.service'


import type { ProjetType } from '@/types/soosmart/projet.type'


import UtiliMetod from '@/utils/utilsmethod'


import CustomIconButton from '@core/components/mui/IconButton'
import OptionMenu from '@core/components/option-menu'
import DefaultDialog from '@components/dialogs/unique-modal/DefaultDialog'
import AddEditProjet from '@views/soosmart/projet/add-edit-projet'


const ProjetIndex = () => {

  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [projetSelect, setProjetSelect] = useState<ProjetType | undefined>(undefined)

  const columnHelper = createColumnHelper<ProjetType>()

  const { data, isLoading, isError } = useQuery({
    queryKey: [ProjetService.PROJT_KEY, pageIndex, pageSize],
    queryFn: async () => {
      // Remplacez par votre service pour récupérer les utilisateurs
      return await ProjetService.getAllProjet({
        page: pageIndex, pagesize:
        pageSize
      })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const ActivateMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ProjetService.changeOffre(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ProjetService.PROJT_KEY]
      })
      toast.success('Projet mis à jour avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du projet')
    }
  })

  const columns = useMemo(() => [
    columnHelper.accessor('projet_type', {
      header: 'Type de projet',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('client', {
      header: 'Client',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('createdat', {
      header: 'Créé le',
      cell: ({ row }) => (<Typography>{UtiliMetod.formatDate(row.original.createdat)}</Typography>)
    }),
    columnHelper.accessor('offre', {
      header: 'Offre',
      cell: ({ row }) => (
        <Chip color={row.original.offre ? 'primary' : 'secondary'} label={row.original.offre ? 'Oui' : 'Nom'} />)
    }),
    columnHelper.accessor('update_at', {
      header: 'Mis à jour le',
      cell: ({ row }) => (<Typography>{UtiliMetod.formatDate(row.original.update_at)}</Typography>)
    }),
    columnHelper.display({
      id: 'actions', // Important: donner un ID à la colonne display
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <CustomIconButton
            onClick={() => {
              setProjetSelect(row.original)
              setIsModalOpen(true)
            }}
            className="cursor-pointer text-yellow-600 hover:text-yellow-800"
          >
            <i className="tabler-edit" />
          </CustomIconButton>
          <CustomIconButton
            onClick={() => UtiliMetod.SuppressionConfirmDialog({
              data: row.original.projet_type,
              confirmAction: () => DeleteMutation.mutate(row.original.id)
            })}
            className="cursor-pointer text-red-600 hover:text-red-800"
          >
            <i className="tabler-trash" />
          </CustomIconButton>
          <OptionMenu
            iconButtonProps={{ size: 'medium' }}
            iconClassName="text-textSecondary"
            options={[
              {
                text: 'Details',
                icon: 'tabler-eye',
                menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
              },
              {
                text: row.original.offre ? 'Désactiver' : 'Activer',
                icon: row.original.offre ? 'tabler-lock-open' : 'tabler-lock',
                menuItemProps: {
                  className: 'flex items-center gap-2 text-textSecondary',
                  onClick: () => ActivateMutation.mutate(row.original.id)
                }
              }
            ]}
          />
        </div>
      ),
      enableHiding: true // Permet de cacher cette colonne
    })
  ], [])


  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ProjetService.deleteProjet(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ProjetService.PROJT_KEY]
      })
      toast.success('Projet supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du projet')
    }
  })


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
        }}
      />
      <DefaultDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={projetSelect ? ` Mettre a jour ${projetSelect?.projet_type}` : 'Ajouter un Projet'}
      >
        <AddEditProjet data={projetSelect} onSuccess={() => {
          setIsModalOpen(false)
          setProjetSelect(undefined)
        }} onCancel={() => {
          setIsModalOpen(false)
          setProjetSelect(undefined)
        }} />

      </DefaultDialog>

    </>
  )
}

export default ProjetIndex
