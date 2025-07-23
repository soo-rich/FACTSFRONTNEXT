// Style Imports
import type { ReactNode } from 'react'

import classnames from 'classnames'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn, Header } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { CardProps } from '@mui/material'
import { Button, Card, CardHeader, MenuItem, TablePagination } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'

// Type Imports
import DebouncedInput from '../CustomInput/DebounceInput'
import CustomTextField from '@/@core/components/mui/TextField'
import TableManualPaginationComponent from './TableManualPaginationComponent'
import ErrorView from '../ErrorView'
import LoadingWithoutModal from '../LoadingWithoutModal'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type TableProps<T> = {
  tabledata: T[] | undefined
  columns: ColumnDef<T, any>[]
  count?: number
  title?: string
  page?: number
  SetPage?: React.Dispatch<React.SetStateAction<number>>
  pageSize?: number
  SetPageSize?: React.Dispatch<React.SetStateAction<number>>
  globalFilter?: string
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>
  onExport?: () => void
  i18n?: {
    searchPlaceholder?: string
    addButton?: string
    exportButton?: string
    noData?: string
  }
  searchInput?: boolean
  pagination?: boolean
  FilterComponent?: ReactNode
  isLoading?: boolean
  isError?: boolean
  renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode
  displayTableHeaderSession?: boolean
  cardProps?: CardProps
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const TableGeneric = <T,>({
  tabledata: table_data,
  columns,
  title,
  page,
  count,
  pageSize,
  SetPage,
  SetPageSize,
  onExport,
  globalFilter,
  setGlobalFilter,
  i18n,
  FilterComponent,
  isError,
  isLoading,
  searchInput = false,
  pagination = true,
  renderHeaderCell,
  displayTableHeaderSession = true,
  cardProps
}: TableProps<T>) => {
  const handlePageChange = (newPage: number) => {
    SetPage?.(newPage)
  }

  const handlePageSizeChange = (event: any) => {
    SetPageSize?.(parseInt(event.target.value, 10))
  }

  const table = useReactTable({
    data: table_data ?? [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter,
      pagination: {
        pageIndex: page ?? 0,
        pageSize: pageSize ?? 10
      }
    },
    initialState: {
      pagination: {
        pageSize: pageSize ?? 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    manualPagination: !!count, // Active la pagination manuelle si count est fourni
    pageCount: count ? Math.ceil(count / (pageSize ?? 10)) : -1,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card {...cardProps}>
        {title && <CardHeader title={title ?? 'Table'} className='pbe-4' />}

        {displayTableHeaderSession && (
          <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
            {pageSize && (
              <CustomTextField
                select
                value={pageSize ?? 10}
                onChange={e => handlePageSizeChange(e)}
                className='max-sm:is-full sm:is-[70px]'
              >
                <MenuItem value='5'>5</MenuItem>
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='25'>25</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </CustomTextField>
            )}
            <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
              {searchInput && (
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter && setGlobalFilter(String(value))}
                  placeholder='Recherche'
                  className='max-sm:is-full'
                />
              )}
              {onExport && (
                <Button onClick={onExport} startIcon={<i className='tabler-upload' />}>
                  {i18n?.exportButton || 'Export'}
                </Button>
              )}
              {FilterComponent}
            </div>
          </div>
        )}
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : renderHeaderCell ? (
                        renderHeaderCell(header)
                      ) : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Aucune Données à afficher
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
          {isLoading && <LoadingWithoutModal padding='p-4' />}

          {isError && <ErrorView />}
        </div>
        {pagination && (
          <TablePagination
            component={() => (
              <TableManualPaginationComponent
                pageIndex={page ?? 0}
                pageSize={pageSize ?? 10}
                rowCount={count ?? 0}
                currentPage={handlePageChange}
              />
            )}
            count={count ?? 0}
            rowsPerPage={pageSize ?? 10}
            page={page ?? 1}
            onPageChange={(_, page) => {
              handlePageChange(page)
            }}
          />
        )}
      </Card>
    </>
  )
}

export default TableGeneric
