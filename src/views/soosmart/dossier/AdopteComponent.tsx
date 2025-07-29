import {Switch, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2";
import {ChangeEvent} from "react";

const AdoptedSwitchComponent = ({checked, handleChange: handlechange}: {
  checked: boolean,
  handleChange: (check: boolean) => void
}) => {

  const handleChange = (check: boolean) => {
    handlechange(check)
  }
  return (
    <Grid container direction={'row'} alignItems='center' justifyContent='center' gap={2}>
      <Typography className={'font-bold'}> Tous</Typography><Switch checked={checked} onChange={
      (event: ChangeEvent<HTMLInputElement>) => {
        handleChange(event.target.checked)
      }}/> <Typography className={'font-bold'}>Non Adopter</Typography>
    </Grid>
  )
}


export default AdoptedSwitchComponent
