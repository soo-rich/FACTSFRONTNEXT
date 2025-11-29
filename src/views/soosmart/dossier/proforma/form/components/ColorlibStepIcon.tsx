import type { StepIconProps } from '@mui/material/StepIcon'

import { BadgeInfo, BaggageClaim, CircleDot, Hash, Split } from 'lucide-react'

import ColorlibStepIconRoot from '@views/soosmart/dossier/proforma/form/components/ColorlibStepIconRoot'

const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className, icon } = props

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <Hash size={24} />,
    2: <Split size={24} />,
    3: <CircleDot size={24} />,
    4: <BaggageClaim size={24} />,
    5: <BadgeInfo size={24} />
  }


  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  )
}

export default ColorlibStepIcon
