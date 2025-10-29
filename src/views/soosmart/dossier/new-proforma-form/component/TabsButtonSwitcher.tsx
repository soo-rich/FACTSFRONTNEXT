import { Grid2 } from '@mui/material'
import Button from '@mui/material/Button'

type TabsButtonSwitcherProps = {
  index: number
  change: (value: number) => void
  verification?: boolean
  last?: boolean
}


const TabsButtonSwitcher = ({ index, change, verification, last=false }: TabsButtonSwitcherProps) => {


  const handlePrevious = () => {
    if (index > 1) {
      change(index - 1)
    }
  }

  const handleNext = () => {
    console.log("verifier",verification)

    if (verification) {
      change(index + 1)
    }
  }

  return <div className={'w-full absolute bottom-0 left-0'}>
    <Grid2

      container
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}
    >
      <Button
        variant={'contained'}
        color={'inherit'}
        onClick={handlePrevious}
        disabled={Number(index) === 1}
      >
        Précédent
      </Button>
      {last
        ? (
          <Button
            type={'submit'}
            className={'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'}
          >
            Soumettre
          </Button>
        )
        : (
          <Button
            type={'button'}
            disabled={!verification}
            className={'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'}
            onClick={handleNext}
          >
            Suivant
          </Button>
        )
      }
    </Grid2>
  </div>

}


export default TabsButtonSwitcher
