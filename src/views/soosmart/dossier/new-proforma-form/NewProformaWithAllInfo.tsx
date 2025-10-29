import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import TabContext from '@mui/lab/TabContext'

import Typography from '@mui/material/Typography'
import TabPanel from '@mui/lab/TabPanel'

import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import CustomTabList from '@core/components/mui/TabList'
import type { ProformaSave } from '@/types/soosmart/dossier/proforma.type'
import { schemaProforma } from '@/types/soosmart/dossier/proforma.type'
import RefConponent from '@views/soosmart/dossier/new-proforma-form/component/RefConponent'
import TabsButtonSwitcher from '@views/soosmart/dossier/new-proforma-form/component/TabsButtonSwitcher'
import ClientOrProjetComponent from '@views/soosmart/dossier/new-proforma-form/component/ClientOrProjetComponent'


const NewProformaWithAllInfo = () => {

  const tabList = [
    {
      value: 1,
      label: 'Référence',
      icon: <i className={'tabler-hash'}></i>,
      positosion: 'start',
      sub: 'Entrer la reference '
    }, {
      value: 2,
      label: 'Client/Projet',
      icon: <i className={'tabler-user'}></i>,
      positosion: 'start',
      sub: 'Pour quel client ou projet'
    }, {
      value: 3,
      label: 'Article',
      icon: <i className={'tabler-shopping-bag-plus'}></i>,
      positosion: 'start',
      sub: 'Selectionner les articles'
    }, {
      value: 4,
      label: 'Recapitulatif',
      icon: <i className={'tabler-hash'}></i>,
      positosion: 'start',
      sub: 'Verifier les informations'
    }
  ]

  const {
    control,
    handleSubmit,
    formState: { errors, validatingFields },
    reset
  } = useForm<ProformaSave>({
    resolver: valibotResolver(schemaProforma),
    defaultValues: {
      reference: '',
      client_id: '',
      projet_id: '',
      articleQuantiteslist: []
    }
  })

  const [value, setValue] = useState<number>(1)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 1:
        if (validatingFields.reference) {
          setValue(1)
        }

        break
      case 2:
        if (validatingFields.reference && validatingFields.client_id || validatingFields.projet_id) {
          setValue(2)
        }

        break
      case 3:
        if (validatingFields.reference && validatingFields.client_id || validatingFields.projet_id && !validatingFields.articleQuantiteslist?.map(i => i.article_id).includes(false)) {
          setValue(3)
        }

        break
      case 4:
        setValue(4)
        break
    }
  }

  const handleSubmitForm = (data: ProformaSave) => {
    console.log('Form Data Submitted: ', data)
  }

  const handleReset = () => {
    reset({
      reference: '',
      client_id: '',
      projet_id: '',
      articleQuantiteslist: []
    })
  }

  return <>
    <form noValidate onSubmit={handleSubmit(handleSubmitForm)} className={'w-full flex flex-col gap-4'}>
      <TabContext value={value}>
        <div className="flex flex-row gap-4">
          <CustomTabList
            className={'min-w-[250px] flex place-content-center flex-col gap-4 space-y-4'}
            orientation="vertical"
            aria-label="customized vertical tabs example"
          >
            <div className={'flex flex-col gap-4'}>
              {
                tabList.map((item, index) => (
                  <div key={index} className={'flex flex-row gap-4 place-items-start'}>
                    <div onClick={(event) => handleChange(event, item.value)}
                         className={'flex flex-col gap-1 justify-center items-center'}>
                      <div
                        className={`${Number(value) > item.value ? 'bg-green-600 ' : 'bg-blue-900'}  text-white rounded-md p-1 flex justify-center items-center  cursor-pointer`}>
                        {item.icon}
                      </div>
                      <div
                        className={`${Number(value) > item.value ? 'bg-green-600' : 'bg-blue-900'} rounded-md w-1 h-10 flex justify-center items-center`}>
                      </div>
                    </div>
                    <div onClick={(e) => handleChange(e, item.value)}
                         className={'flex flex-col justify-start items-start gap-1 cursor-pointer'}>
                      <Typography>{item.label}</Typography>
                      <Typography variant={'subtitle2'}>{item.sub}</Typography>
                    </div>

                  </div>
                ))
              }
            </div>
          </CustomTabList>
          <div className={'relative w-full flex flex-col gap-4'}>
            <TabPanel value={1}>

              <div className={'w-full flex flex-col gap-4 space-y-4'}>

                <RefConponent control={control} errors={errors} />

                <TabsButtonSwitcher index={value} change={setValue} verification={validatingFields.reference} />
              </div>

            </TabPanel>
            <TabPanel value={2}>
              <div className={'w-full flex flex-col justify-between gap-4'}>
                <ClientOrProjetComponent control={control} errors={errors} />

                <TabsButtonSwitcher index={value} change={setValue}
                                    verification={validatingFields.client_id || validatingFields.projet_id} />


              </div>
            </TabPanel>
            <TabPanel value={3}>
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie
                roll
                carrot cake gummi bears.
              </Typography>

              <TabsButtonSwitcher index={value} change={setValue}
                                  verification={!validatingFields.articleQuantiteslist?.map(i => i.article_id).includes(false)} />
            </TabPanel>
            <TabPanel value={4}>
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie
                roll
                carrot cake gummi bears.
              </Typography>

              <TabsButtonSwitcher index={value} change={setValue}
                                  verification={true} last={true} />
            </TabPanel>
          </div>

        </div>
      </TabContext>
    </form>


  </>
}

export default NewProformaWithAllInfo
