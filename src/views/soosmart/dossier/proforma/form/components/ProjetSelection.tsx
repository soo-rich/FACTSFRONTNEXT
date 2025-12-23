'use client'

import { type SyntheticEvent, useEffect, useMemo, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, createFilterOptions, Grid2 } from '@mui/material'

import { ProjetService } from '@/service/projet/projet.service'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import ErrorView from '@components/ErrorView'
import LoadingWithoutModal from '@components/LoadingWithoutModal'
import DefaultDialog from '@/components/dialogs/unique-modal/DefaultDialog'
import AddEditProjet from '@/views/soosmart/projet/add-edit-projet'

type SelectType = {
  id: string
  value: string
}


const ProjetSelection = ({ change, value }: { change: (value: string) => void, value: string | null }) => {
  const queryClient = useQueryClient()


  const [isModalOpenProjet, setIsModalOpenProjet] = useState<boolean>(false)

  const querykeyprojet = useMemo(() => [ProjetService.PROJT_KEY + '+all'], [])

  const { data, isError, isLoading } = useQuery({
    queryKey: querykeyprojet,
    queryFn: async () => {
      return (await ProjetService.getAll())
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const projet = useMemo(() => data?.map(item => ({ id: item.id, value: item.projet_type })) || [], [data])


  const [projetSelect, setProjetSelect] = useState<SelectType | null>(null)

  const filterOptionsProjet = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: SelectType) => option.value
  })

  const handleSelectProjet = (event: SyntheticEvent, newValue: SelectType | null) => {
    setProjetSelect(projet?.find(item => item.id === newValue?.id) || null)
    change(newValue?.id || '')
  }

  const handleAddProjet = async (id: string) => {
    await queryClient.invalidateQueries({ queryKey: querykeyprojet })
    console.log('after refetch')
    setProjetSelect(projet?.find(item => item.id === id) || null)
    change(id)
  }

  useEffect(() => {
    setProjetSelect(projet?.find(item => item.id === value) || null)
  }, [projet, value])

  return isError ? <ErrorView /> : isLoading ? <LoadingWithoutModal /> : projet && (<>
    <Grid2 container direction={'row'} spacing={3}>
      <Grid2 className="flex-grow">
        <CustomAutocomplete
          options={projet || []}
          value={projetSelect}
          fullWidth
          filterOptions={filterOptionsProjet}
          onChange={handleSelectProjet}
          getOptionLabel={option => option.value || ''}

          renderInput={params => <CustomTextField {...params} label="Choix du Projet " />}
        />
      </Grid2>
      <Grid2 className="self-end">
        <Button variant={'contained'} color={'inherit'} endIcon={<i className="tabler-plus" />}
                onClick={() => {
                  setIsModalOpenProjet(true)
                }}>
          Ajouter un Projet
        </Button>
      </Grid2>
    </Grid2>

    <DefaultDialog
      open={isModalOpenProjet}
      setOpen={setIsModalOpenProjet}
      onClose={() => setIsModalOpenProjet(false)}
      title={'Ajouter un Projet'}
    >
      <AddEditProjet onSuccess={(data) => {
        setIsModalOpenProjet(false)
        const array = Array.isArray(data)

        if (!array && data) {
          handleAddProjet(data.id)
        }

        setIsModalOpenProjet(false)
      }} onCancel={() => {
        setIsModalOpenProjet(false)
      }} />

    </DefaultDialog></>)
}


export default ProjetSelection
