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
  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Affiche de ${rowCount === 0 ? 0 : pageIndex * pageSize}
        à ${Math.min((pageIndex + 1) * pageSize, rowCount)} sur ${rowCount} entrées`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(rowCount / pageSize)}
        page={pageIndex + 1}
        onChange={(_, page) => {
          if (currentPage) currentPage(page - 1)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TableManualPaginationComponent
