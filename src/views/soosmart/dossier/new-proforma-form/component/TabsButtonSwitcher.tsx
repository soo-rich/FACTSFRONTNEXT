import {Grid2} from "@mui/material";
import Button from "@mui/material/Button";

type TabsButtonSwitcherProps = {
  index: number
  change: (value: number) => void
  verification?: () => boolean
}


const TabsButtonSwitcher = ({index, change, verification}: TabsButtonSwitcherProps) => {


  const handlePrevious = () => {
    if (index > 1) {
      change(index - 1)
    }
  }

  const handleNext = () => {

    if (!(verification) || verification()) {
      change(index + 1)
    }
  }

  return <>
    <Grid2
      container
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Button
        variant={'contained'}
        color={'warning'}
        onClick={handlePrevious}
        disabled={index === 1}
      >
        Précédent
      </Button> <Button
      className={'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'}
      onClick={handleNext}
    >
      Suivant
    </Button>
    </Grid2>
  </>

}


export default TabsButtonSwitcher
