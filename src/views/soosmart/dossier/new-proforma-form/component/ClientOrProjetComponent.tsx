'use client'
import type {ChangeEvent} from "react";
import { useState} from "react";

import {FormControlLabel, Grid2, RadioGroup} from "@mui/material";
import Radio from "@mui/material/Radio";

import { Controller } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'

import type { AddGlobalProformaType } from '@views/soosmart/dossier/new-proforma-form/type/AddGlobalProformaType'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'


import { ClientService } from '@/service/client/client.service'
import { ProjetService } from '@/service/projet/projet.service'
import SectionTitle from '@views/soosmart/dossier/new-proforma-form/component/SectionTitle'

const ClientOrProjetComponent = (props: AddGlobalProformaType) => {

  const {control, errors} = props
  const [value, setValue] = useState<string>('projet')
  const [clientorprojet, setClientOrProjet] = useState<boolean>(false)
  const [clientName, setClientName] = useState<string>('')
  const [projetName, setProjetName] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
    const v = (event.target as HTMLInputElement).value

    if (v === 'projet') {
      setClientOrProjet(false)
    } else {
      setClientOrProjet(true)
    }
  }

  const { data: client } = useQuery({
    queryKey: ['clientlist', clientName],
    queryFn: async () => {
      return await ClientService.getClientsByNom(clientName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const { data: projet } = useQuery({
    queryKey: ['projetlist', projetName],
    queryFn: async () => {
      return await ProjetService.searchProjet(projetName)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })


  return (<div className={'flex flex-col gap-4 '}>
    <SectionTitle title={'Client / Projet'} sub={'pour quel client ou projet creer la proforma'} icon={ <i className={'tabler-user  text-3xl text-white m-1'}></i>}/>
    <Grid2
      container
      size={12}
      direction={'row'}
      spacing={3}
      sx={{
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
        <FormControlLabel value='projet' control={<Radio/>} label='Projet'/>
        <FormControlLabel value='client' control={<Radio/>} label='Client'/>
      </RadioGroup>


        <Controller
          render={({ field }) => {
            return (
              <CustomAutocomplete
                hidden={clientorprojet}
                disabled={clientorprojet}
                options={projet || []}
                fullWidth
                onChange={(event, newvalue) => {
                  if (newvalue) {
                    field.onChange(newvalue.id)
                  } else {
                    field.onChange('')
                  }
                }}
                getOptionKey={option => option.id}
                getOptionLabel={option => {
                  return option.projet_type
                }}
                renderInput={params => {
                  return (
                    <CustomTextField
                      {...params}
                      label={'Projet'}

                      onChange={event => {
                        const value = event.target.value

                        setProjetName(value)
                      }}
                      error={!!errors.projet_id}
                      {...(errors.projet_id && {
                        error: true,
                        helperText: errors?.projet_id?.message
                      })}
                    />
                  )
                }}
              />
            )
          }}
          name={'projet_id'}
          control={control}
        />

        <Controller
          render={({ field }) => {
            return (
              <CustomAutocomplete
                hidden={!clientorprojet}
                disabled={!clientorprojet}
                options={client || []}
                fullWidth
                onChange={(event, newvalue) => {
                  if (newvalue) {
                    field.onChange(newvalue.id)
                  } else {
                    field.onChange('')
                  }
                }}
                getOptionKey={option => option.id}
                getOptionLabel={option => {
                  return option.nom + ' - ' + option.sigle
                }}
                renderInput={params => {
                  return (
                    <CustomTextField
                      {...params}
                      label={'Client'}

                      onChange={event => {
                        const value = event.target.value

                        setClientName(value)
                      }}
                      error={!!errors.client_id}
                      {...(errors.client_id && {
                        error: true,
                        helperText: errors?.client_id?.message
                      })}
                    />
                  )
                }}
              />
            )
          }}
          name={'client_id'}
          control={control}
        />

    </Grid2>

  </div>)

}


export default ClientOrProjetComponent
