import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import {useParams} from "next/navigation";
import {forwardRef, useMemo} from "react";
import {DocumentDTO, DocumentTypes} from "@/types/soosmart/dossier/DocumentDTO";
import Typography from "@mui/material/Typography";
import SoosmartLogo from "@components/layout/shared/SoosmartLogo";
import UtiliMetod from "@/utils/utilsmethod";
import themeConfig from "@configs/themeConfig";
// import CustomIconButton from "@core/components/mui/IconButton";

const DefaultDesignFact = forwardRef<HTMLDivElement, {docs: DocumentDTO, signe:string, role:string }>(({docs, signe, role}: { docs: DocumentDTO, signe:string, role:string }, ref) => {

  const {numero} = useParams()

  const documenttype = useMemo(() => {
    const nu = (numero as string).substring(0, 2).toUpperCase()
    if (!nu) return null
    switch (nu) {
      case 'FA':
        return DocumentTypes.FACTURE
      case 'FP':
        return DocumentTypes.PROFORMA
      case 'BL':
        return DocumentTypes.BORDERAU
      default:
        return null
    }
  }, [numero])

  return (
    <Card sx={{ position: 'relative', overflow: 'hidden' }} ref={ref} className={'!border-none !shadow-none'}>
      <div
        style={{
          position: 'absolute',
          top: '35%',
          bottom: '35%',
          right: '10%',
          left: '10%',
          transform: 'rotate(-0deg) scale(1.5)',
          opacity: 0.05,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <SoosmartLogo width="100%" height="100%" />
      </div>

      {/*<div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          transform: 'rotate(35deg) scale(1.2)',
          opacity: 0.03,
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <SoosmartLogo width="6rem" height="6rem" />
      </div>*/}
      <CardContent className='sm:!p-12'>

        <Grid container spacing={0} direction={'column'} gap={0}>
          <Grid size={12} gap={0} spacing={0} container direction={'row'} sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
            <Typography className={'text-[#0573c1] text-[0.50in] font-bold'}>S</Typography>
            <SoosmartLogo width={'0.43in'} height={'0.42in'}/>
            <Typography className={'text-[#0573c1] text-[0.50in] font-bold'}>SMART</Typography>
          </Grid>
          <Grid size={12}>
            <Typography className={'text-[#6ed152] text-[0.40in] font-bold'}>Group</Typography>
          </Grid>
        </Grid>
        {
          documenttype === DocumentTypes.BORDERAU ? (
            <Grid size={12} gap={0} spacing={0} container direction={'row'}
                  sx={{justifyContent: 'center', alignItems: 'center'}}>
              <Typography className={'font-bold text-center text-2xl'}>BORDEREAU DE LIVRAISON</Typography>
            </Grid>
          ) : null
        }
        <Grid container spacing={0} direction={'column'} gap={0} sx={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}> <Grid container spacing={0} direction={'column'} gap={0} sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginRight: '10rem',
        }}>
          {
            documenttype === DocumentTypes.BORDERAU ? (

              <Typography className={'font-bold text-center underline uppercase'}>Client :</Typography>

            ) : null
          }
          <Typography
            className={'text-md font-medium'}>{`${docs.client.nom}${docs.client.sigle ? docs.client.sigle : ''}`}</Typography>
          <Typography
            className={'text-md font-medium'}>{`${docs.client.nom}${docs.client.sigle ? docs.client.sigle : ''}`}</Typography>
          <Typography className={'text-md font-medium'}>{`${docs.client.lieu}`}</Typography>

        </Grid>
        </Grid>

        <Grid container spacing={0} direction={'column'} gap={0}>
          <Grid size={12} gap={0} spacing={0} container direction={'row'} sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
            {
              documenttype === DocumentTypes.PROFORMA || documenttype === DocumentTypes.FACTURE ? (
                <Grid size={12} gap={0} spacing={0} container direction={'row'}
                      sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  <Typography className={'font-bold text-start text-xl uppercase'}>FACTURE {documenttype===DocumentTypes.PROFORMA??''}</Typography>
                </Grid>
              ) : null
            }
          </Grid>
          <Grid size={12}>
            <table className="w-[70%] border border-gray-500 border-collapse text-sm mb-4">
              <thead>
              <tr className="bg-gray-300 text-center font-semibold">
                <th className="border border-gray-500 px-2 py-1 w-12">Numéro</th>
                <th className="border border-gray-500 px-2 py-1 w-12">Date</th>
                <th className="border border-gray-500 px-2 py-1">Références</th>
              </tr>
              </thead>
              <tbody>
              <tr className="text-center font-medium">
                <td className="border border-gray-500 px-2 py-1">{docs.numero}</td>
                <td className="border border-gray-500 px-2 py-1">{UtiliMetod.formatDate(docs.date, 'dd/MM/yyyy')}</td>
                <td className="border border-gray-500 text-red-600  px-2 py-1">{docs.reference}</td>
              </tr>
              </tbody>
            </table>

            {/* Tableau principal */}
            <table className="w-full border border-collapse border-gray-500 text-sm">
              <thead className="bg-gray-300 text-center font-semibold">
              <tr>
                <th className="border border-gray-500 px-2 py-1 w-12">Réf.</th>
                <th className="border border-gray-500 px-2 py-1">Désignation</th>
                {
                  documenttype === DocumentTypes.BORDERAU ? (<>
                      <th className="border border-gray-500 px-2 py-1 w-28">Qté Commandée</th>
                      <th className="border border-gray-500 px-2 py-1 w-28">Qté Livrée</th>
                      <th className="border border-gray-500 px-2 py-1 w-32">Observations</th>
                    </>
                  ) : (<>
                      <th className="border border-gray-500 px-2 py-1 w-28">PU</th>
                      <th className="border border-gray-500 px-2 py-1 w-28">QTE</th>
                      <th className="border border-gray-500 px-2 py-1 w-32">TOTAL</th>
                    </>

                  )
                }

              </tr>
              </thead>
              <tbody>

              {
                docs.articleQuantiteslist.map((item, index) => (
                  <tr key={index} className="align-top">
                    <td className="border border-gray-500 text-center px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-500 px-2 py-1 font-bold">
                      {
                        item.article
                      }
                    </td>
                    <td className="border border-gray-500 text-center px-2 py-1">{
                      UtiliMetod.formatDevise(item.prix_article)
                    }</td>
                    <td className="border border-gray-500 text-center px-2 py-1">{
                      item.quantite
                    }</td>
                    <td
                      className="border border-gray-500 px-2 py-1">{Number(item.prix_article) * Number(item.quantite)}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>

            {
              documenttype !== DocumentTypes.BORDERAU ? (
                <table className={'border-collapse w-full mt-6'}>
                  <tbody>
                  <tr className=" text-center font-semibold">
                    <td colSpan={2}></td>
                    <td className="border px-2 w-28">Total HT</td>
                    <td className="border px-2 w-28 text-center">-</td>
                    <td className="border px-2 w-40 text-end">{UtiliMetod.formatDevise(docs.total_ht)} FCFA</td>
                  </tr>
                  <tr className="text-center font-semibold">
                    <td colSpan={2}></td>
                    <td className="border px-2 w-28">TVA</td>
                    <td className="border px-2 w-28 text-center"></td>
                    <td className="border px-2 w-40 text-end">{UtiliMetod.formatDevise(docs.total_tva)} FCFA</td>
                  </tr>
                  <tr className="text-center font-semibold">
                    <td colSpan={2}></td>
                    <td className="border px-2 w-28">Total TTC</td>
                    <td className="border px-2 w-28 text-center">-</td>
                    <td className="border px-2 w-40 text-end ">{UtiliMetod.formatDevise(docs.total_ttc)} FCFA</td>
                  </tr>
                  </tbody>
                </table>
              ) : (
                <table className={'border border-collapse w-full mt-6'}>
                  <thead>
                  <tr>
                    <th className={'border border-black px-2 py-1 w-[50%]'}>Pour {docs.client.sigle}</th>
                    <th className={'border border-black px-2 py-1 w-[50%]'}>Pour {themeConfig.templateName}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className={'border border-black px-2 py-1 h-32'}></td>
                    <td className={'border border-black px-2 py-1 h-32'}></td>
                  </tr>
                  </tbody>
                </table>
              )
            }


          </Grid>
        </Grid>
        {
          documenttype !== DocumentTypes.BORDERAU ? (<>
              <Grid container spacing={0} gap={0} size={12} className={'mt-3'}>
                <Typography className={'text-[1.2rem]'}> Arrêté la présente facture à la somme de <span
                  className={'font-bold'}>{docs.total_letters}</span> francs CFA</Typography>
              </Grid>

              <Grid container spacing={0} gap={0} size={12} className={'mt-3'} direction={'column'}>
                <Typography className={'font-bold underline'}> Termes et conditions standards:</Typography>
                <Typography>Payement : 60% à la commande </Typography>
                <Typography className={'ml-20'}>40% à la livraison</Typography>
                <Typography>Délai de livraison : 2 semaines </Typography>
                <Typography> Validité de l'offre : 90 jours </Typography>
              </Grid>
            </>

          ) : null
        }
        <Grid container spacing={0} direction={'column'} gap={0} sx={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: '2rem',
          marginRight: '5rem',
        }}>
          <Typography className={'font-bold'} >{signe}</Typography>
          <Typography className={'font-bold'} >{role}</Typography>
        </Grid>


        <Grid container spacing={0} direction={'column'} gap={0} sx={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: '10rem',
        }}> <Grid container spacing={0} direction={'column'} gap={0} sx={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>

          <Typography className={'border-t-2 border-gray-950 text-primary'}>AGOE LEGBASSITO, QTE AHONKPOE, 50M DU MARCHE
            BELGIQUE,
            6.277888 – 1.168199</Typography>
          <Typography className={'text-primary'}><span className={'text-[#92d050]'}>T:</span> (+228) 93 94 44 44, <span
            className={'text-[#92d050] '}>E:</span> CONTACT@SOOSMART.GROUP, <span
            className={'text-[#92d050]'}>W:</span> WWW.SOOSMART.GROUP</Typography>
          <Typography className={'text-primary'}><span className={'text-[#92d050]'}>RC:</span> TG-LOM 2020 B 0394, <span
            className={'text-[#92d050]'}>NIF:</span> 1001652884</Typography>
        </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
})


export default DefaultDesignFact
