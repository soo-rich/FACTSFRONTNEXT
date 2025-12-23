import type { SyntheticEvent } from "react";
import { useEffect, useMemo, useState } from "react"

import { Button, createFilterOptions, Grid2 } from "@mui/material"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import CustomAutocomplete from "@/@core/components/mui/Autocomplete"
import CustomTextField from "@/@core/components/mui/TextField"
import ErrorView from "@/components/ErrorView"
import LoadingWithoutModal from "@/components/LoadingWithoutModal"
import { ClientService } from "@/service/client/client.service"
import DefaultDialog from "@/components/dialogs/unique-modal/DefaultDialog";
import AddEditClient from "@/views/soosmart/client/add-edit-client";

type SelectType = {
  id: string
  value: string
}

const ClientSelection = ({ change, value }: { change: (value: string) => void, value: string | null }) => {
  const queryClient = useQueryClient()

  const [clientSelect, setClientSelect] = useState<SelectType | null>(null)
  const [isModalOpenClient, setIsModalOpenClient] = useState<boolean>(false)

  const querykeyclient = useMemo(() => [ClientService.CLIENT_KEY + '+all'], [])

  const { data, isError, isLoading } = useQuery({
    queryKey: querykeyclient,
    queryFn: async () => {
      return await ClientService.getClientsAll()
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const client = useMemo(() => data?.map(item => ({ id: item.id, value: item.nom || item.lieu })) || [], [data]);


  const filterOptionsClient = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: SelectType) => option.value
  })

  const handleSelectClient = (event: SyntheticEvent, newValue: SelectType | null) => {
    setClientSelect(newValue)
    change(newValue?.id || '')
  }


  const handleClientAdd = async (id: string) => {
    await queryClient.invalidateQueries({ queryKey: querykeyclient })
    console.log('after refetch')
    setClientSelect(client?.find(item => item.id === id) || null)
    change(id)
  }

  useEffect(() => {
    setClientSelect(client?.find(item => item.id === value) || null)
  }, [client, value])



  return isError ? <ErrorView /> : isLoading ? <LoadingWithoutModal /> : client && (<>

    <Grid2 container direction={'row'} spacing={3}>
      <Grid2 className='flex-grow'>
        <CustomAutocomplete

          options={client || []}
          fullWidth
          value={clientSelect}
          filterOptions={filterOptionsClient}
          onChange={handleSelectClient}
          getOptionLabel={option => option.value || ''}

          renderInput={params => <CustomTextField {...params} label="Choix du Client" />}
        />
      </Grid2>
      <Grid2 className='self-end'>
        <Button variant={'contained'} color={'inherit'} endIcon={<i className="tabler-plus" />}
          onClick={() => {
            setIsModalOpenClient(true)
          }}>
          Ajouter un Client
        </Button>
      </Grid2>
    </Grid2>

    <DefaultDialog
      open={isModalOpenClient}
      setOpen={setIsModalOpenClient}
      onClose={() => setIsModalOpenClient(false)}
      title={'Ajouter un Client'}
    >
      <AddEditClient onSuccess={(data) => {
        setIsModalOpenClient(false)
        const array = Array.isArray(data)

        if (!array && data) {
          handleClientAdd(data.id)
        }
      }} onCancel={()=>{setIsModalOpenClient(false)}}/>

    </DefaultDialog>
  </>)
}



export default ClientSelection
