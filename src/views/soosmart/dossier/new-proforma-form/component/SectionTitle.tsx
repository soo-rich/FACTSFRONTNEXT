import type { ReactNode } from 'react'

import { Typography } from "@mui/material"


const SectionTitle = (props:{title:string, sub:string, icon:ReactNode}) => {
  const {title, sub, icon}=props


return (
    <div className={'flex flex-row justify-start items-center gap-4 space-y-4'}>
      <div className={'flex justify-start place-items-center gap-4'}>
        <div className={'bg-primary rounded-md p-1 flex justify-center items-center'}>
          {icon}
        </div>
      </div>
      <div className={'flex flex-col justify-start items-start gap-1'}>
        <Typography>{title}</Typography>
        <Typography variant={'subtitle2'}>{sub}</Typography>
      </div>
    </div>
  )
}

export default SectionTitle
