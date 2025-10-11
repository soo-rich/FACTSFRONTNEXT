import type {SyntheticEvent} from "react";
import {useState} from "react";

import TabContext from "@mui/lab/TabContext";

import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";


import {FormControlLabel, Grid2, RadioGroup} from "@mui/material";

import Radio from "@mui/material/Radio";

import CustomTabList from "@core/components/mui/TabList";
import type {ProformaSave} from "@/types/soosmart/dossier/proforma.type";
import RefConponent from "@views/soosmart/dossier/new-proforma-form/component/RefConponent";
import TabsButtonSwitcher from "@views/soosmart/dossier/new-proforma-form/component/TabsButtonSwitcher";
import ClientOrProjetComponent from "@views/soosmart/dossier/new-proforma-form/component/ClientOrProjetComponent";


const NewProformaWithAllInfo = () => {

  const [datatosend, setDatatoSend] = useState<ProformaSave>({
    reference: '',
    client_id: '',
    projet_id: '',
    articleQuantiteslist: [],
  })

  const [value, setValue] = useState<number>(1)

  const handleChangee = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const onchangeRef = (value: string) => {
    setDatatoSend({...datatosend, reference: value})
  }

  const verificationRef = () => {
    return datatosend.reference !== '' && datatosend.reference.length >= 3
  }


  return <>

    <TabContext value={value}>
      <div className='flex'>
        <CustomTabList
          pill='true'
          orientation='vertical'
          onChange={handleChangee}
          aria-label='customized vertical tabs example'
        >
          <Tab value={1} label='Référence' icon={<i className={'tabler-hash'}></i>} iconPosition={'end'}/>
          <Tab value={2} label='Client/Projet' icon={<i className={'tabler-users '}></i>} iconPosition={'end'}/>
          <Tab value={3} label='Article' icon={<i className={'tabler-shopping-bag-plus'}></i>} iconPosition={'end'}/>
        </CustomTabList>
        <TabPanel value={1} className={'w-full'}>

          <div className={'w-full flex flex-col gap-4'}>

            <RefConponent onchange={onchangeRef}/>

            <TabsButtonSwitcher index={value} change={setValue} verification={verificationRef}/>
          </div>

        </TabPanel>
        <TabPanel value={2} className={'w-full'}>
          <div className={'w-full flex flex-col justify-between gap-4'}>
            <ClientOrProjetComponent/>
            <TabsButtonSwitcher index={value} change={setValue} verification={verificationRef}/>
          </div>
        </TabPanel>
        <TabPanel value={3} className={'w-full'}>
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
            carrot cake gummi bears.
          </Typography>
        </TabPanel>
      </div>
    </TabContext>


  </>
}

export default NewProformaWithAllInfo
