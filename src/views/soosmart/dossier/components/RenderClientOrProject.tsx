import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import type { ProformaType } from '@/types/soosmart/dossier/proforma.type'

const RenderClientOrProject = ({ for_who }: { for_who: Pick<ProformaType, 'client' | 'projet'> }) => {
  const isclient = !!for_who.client
  const isprojet = !!for_who.projet

  return (
    <div className="flex flex-col gap-1">
      <Typography>
        {isclient
          ? `${for_who?.client?.nom} - ${for_who.client?.sigle}`
          : isprojet
            ? `${for_who.projet?.projet_type}`
            : 'N\A'}
      </Typography>
      <div>
        <Chip
          size="small"
          variant={'tonal'}
          color={isclient ? 'primary' : isprojet ? 'info' : 'secondary'}
          label={isclient ? 'Client' : isprojet ? 'Projet' : 'N/A'}
        />
      </div>
    </div>
  )
}

export default RenderClientOrProject

