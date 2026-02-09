import { Button, CircularProgress } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'

type Props = {
  loading?: boolean
} & ButtonProps

const LoadingButton = (props: Props) => {
  const { loading, disabled, endIcon, ...rest } = props

  return (
    <Button
      variant='contained'
      {...rest}
      disabled={disabled || loading}
      endIcon={loading ? <CircularProgress color='inherit' size={20} sx={{ marginRight: 1 }} /> : endIcon}
    />
  )
}

export default LoadingButton
