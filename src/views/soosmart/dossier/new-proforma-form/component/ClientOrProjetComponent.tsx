'use client'
import type {ChangeEvent} from "react";
import { useState} from "react";

import {FormControlLabel, Grid2, RadioGroup} from "@mui/material";
import Radio from "@mui/material/Radio";

const ClientOrProjetComponent = () => {

  const [value, setValue] = useState<string>('projet')
  const [clientorprojet, setClientOrProjet] = useState<boolean>(false)


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
    const v = (event.target as HTMLInputElement).value

    if (v === 'projet') {
      setClientOrProjet(false)
    } else {
      setClientOrProjet(true)
    }
  }


  return (<>
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
    </Grid2>

  </>)

}


export default ClientOrProjetComponent
