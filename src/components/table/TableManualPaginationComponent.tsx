// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

type Props = {
  pageSize: number
  pageIndex: number
  rowCount: number
  currentPage?: (index: number) => void
}

const TableManualPaginationComponent = ({ pageSize, pageIndex, rowCount, currentPage }: Props) => {
  // Une taille nulle rendrait le nombre de pages infini (division par zéro).
  const size = pageSize > 0 ? pageSize : 10
  const pageCount = Math.ceil(rowCount / size)

  const from = rowCount === 0 ? 0 : pageIndex * size + 1
  const to = Math.min((pageIndex + 1) * size, rowCount)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>{`Affiche de ${from} à ${to} sur ${rowCount} entrées`}</Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={pageCount}

        // Borné : sur une page devenue hors limites (suppression, filtre plus
        // restrictif), MUI avertirait « page out of range ».
        page={Math.min(pageIndex + 1, Math.max(pageCount, 1))}
        onChange={(_, page) => {
          currentPage?.(page - 1)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TableManualPaginationComponent
