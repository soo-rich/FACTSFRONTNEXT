'use client'
import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { createColumnHelper } from '@tanstack/react-table'

import Typography from '@mui/material/Typography'

import { Grid as Grid2 } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import TableGeneric from '@components/table/TableGeneric'
import type { ClientType } from '@/types/soosmart/client.type'
import { ClientService } from '@/service/client/client.service'
import UtiliMetod from '@/utils/utilsmethod'

import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'
import AddEditClient from '@views/soosmart/client/add-edit-client'
import OptionMenu from '@core/components/option-menu'

const columnHelper = createColumnHelper<ClientType>()

const ClientIndex = () => {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clientSelect, setClientSelect] = useState<ClientType | undefined>(undefined)

  const querykey = useMemo(() => [ClientService.CLIENT_KEY, pageIndex, pageSize, filter], [pageIndex, pageSize, filter])

  const { data, isLoading, isError } = useQuery({
    queryKey: querykey,
    queryFn: async () => {
      return await ClientService.getClients({ page: pageIndex, pagesize: pageSize, search: filter })
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ClientService.deleteClient(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: querykey
      })
      toast.success('Client supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du client')
    }
  })

  const ChangePotentielMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ClientService.changePotentiel(id)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: querykey
      })
      toast.success(`Cette Entité ${data ? 'est maintenant un potentiel' : 'n\'est plus un potentiel'} client`)
    },
    onError: () => {
      toast.error('Erreur lors du changement de potentiel du client')
    }
  })

  const columns = useMemo(
    () => [
      columnHelper.accessor('potentiel', {
        header: 'Potentiel',
        cell: ({ row }) => (
          <Tooltip placement={'top'} title={row.original.potentiel ? 'Oui' : 'Non'}>
            {row.original.potentiel ? (
              <i
                className={' bg-success text-2xl tabler-square-rounded-check-filled '}
              ></i>
            ) : (
              <i
                className={'bg-error text-2xl tabler-square-rounded-x '}

              ></i>
            )}
          </Tooltip>
        )
      }),
      columnHelper.accessor('nom', {
        header: 'Nom',
        cell: ({ row }) => <Typography> {row.original.nom}</Typography>
      }),
      columnHelper.accessor('lieu', {
        header: 'Lieu',
        cell: ({ row }) => <Typography> {row.original.lieu}</Typography>
      }),
      columnHelper.accessor('sigle', {
        header: 'Sigle',
        cell: ({ row }) => <Typography> {row.original.sigle}</Typography>
      }),
      columnHelper.accessor('telephone', {
        header: 'Téléphone',
        cell: ({ row }) => <Typography> {row.original.telephone}</Typography>
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Grid2 container direction={'row'} spacing={2} justifyContent="center">

            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName="text-textSecondary"
              options={[
                {
                  text: 'Details',
                  icon: 'tabler-eye',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }, {
                  text: 'Modifier',
                  icon: 'tabler-edit cursor-pointer text-yellow-600 hover:text-yellow-800',
                  menuItemProps: {
                    onClick: () => {
                      setClientSelect(row.original)
                      setIsModalOpen(true)
                    }
                  }
                },
                {
                  text: `${row.original.potentiel ? 'Non' : 'Oui'} Potentiel`,
                  icon: row.original.potentiel ? 'tabler-x' : 'tabler-check',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => UtiliMetod.confirmDialog({
                      title: `Êtes-vous sûr de vouloir ${row.original.potentiel ? 'retirer ce client de la liste des potentiels' : 'marquer ce client comme potentiel'} ?`,
                      confirmAction: () => ChangePotentielMutation.mutate(row.original.id)
                    })
                  }
                },
                {
                  text: 'Supprimer',
                  icon: 'tabler-trash cursor-pointer text-red-600 hover:text-red-800',
                  menuItemProps: {
                    onClick: () =>
                      UtiliMetod.SuppressionConfirmDialog({
                        data: `${row.original.nom}`,
                        confirmAction: () => DeleteMutation.mutate(row.original.id)
                      })
                  }
                }
              ]}

            />
          </Grid2>
        )
      })
    ],
    [ChangePotentielMutation, DeleteMutation]
  )

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
          onClick: () => setIsModalOpen(true)
        }}
      />

      <DefaultDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setClientSelect(undefined)
        }}
        title={clientSelect ? ` Mettre a jour ${clientSelect?.nom}` : 'Ajouter un Client'}
      >
        <AddEditClient
          data={clientSelect}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: querykey
            })
            setIsModalOpen(false)
            setClientSelect(undefined)
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setClientSelect(undefined)
          }}
        />
      </DefaultDialog>
    </>
  )
}

export default ClientIndex
