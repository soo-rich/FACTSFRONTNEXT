'use client'
// Style Imports
import {ComponentType, type ReactNode, useState} from 'react'

import classnames from 'classnames'

import type {RankingInfo} from '@tanstack/match-sorter-utils'
import {rankItem} from '@tanstack/match-sorter-utils'
import type {ColumnDef, FilterFn, Header} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'

import type {CardProps} from '@mui/material'
import {Card, CardHeader, TablePagination} from '@mui/material'

import tableStyles from '@core/styles/table.module.css'

// Type Imports
import DebouncedInput from '../CustomInput/DebounceInput'
import CustomTextField from '@/@core/components/mui/TextField'
import TableManualPaginationComponent from './TableManualPaginationComponent'
import ErrorView from '../ErrorView'
import LoadingWithoutModal from '../LoadingWithoutModal'

import Button, {type ButtonProps} from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import type {MenuProps} from '@mui/material/Menu'
import MuiMenu from '@mui/material/Menu'
import type {MenuItemProps} from '@mui/material/MenuItem'
import MuiMenuItem from '@mui/material/MenuItem'
import OpenDialogOnElementClick from "@components/dialogs/OpenDialogOnElementClick";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

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
  totalElements?: number
  title?: string
  page?: number
  SetPage?: React.Dispatch<React.SetStateAction<number>>
  pageSize?: number
  SetPageSize?: React.Dispatch<React.SetStateAction<number>>
  globalFilter?: string
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>
  pagination?: boolean
  FilterComponent?: ReactNode
  isLoading?: boolean
  isError?: boolean
  visibleColumns?: boolean
  renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode
  displayTableHeaderSession?: boolean
  cardProps?: CardProps,
  buttonadd?: {
    element?: ComponentType<any>
    elementProps?: any,
    dialog: ComponentType<any>
  }
}

const Menu = styled(MuiMenu)<MenuProps>({
  '& .MuiMenu-paper': {
    border: '1px solid var(--mui-palette-divider)'
  }
})

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>({
  '&:focus': {
    backgroundColor: 'var(--mui-palette-primary-main)',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: 'var(--mui-palette-common-white)'
    }
  }
})

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

const TableGeneric = <T, >({
                             tabledata: table_data,
                             columns,
                             title,
                             page,
                             totalElements,
                             pageSize,
                             SetPage,
                             SetPageSize,
                             globalFilter,
                             setGlobalFilter,
                             FilterComponent,
                             isError,
                             isLoading,
                             pagination = true,
                             renderHeaderCell,
                             displayTableHeaderSession = true,
                             cardProps,
                             visibleColumns,
                             buttonadd
                           }: TableProps<T>) => {

  const buttonProps: ButtonProps = {
    startIcon: <i className='tabler-plus'/>,
    variant: 'contained',
    children: 'Enregistrer'
  }

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePageChange = (newPage: number) => {
    SetPage?.(newPage)
  }

  const handlePageSizeChange = (event: any) => {
    SetPageSize?.(parseInt(event.target.value, 10))
  }

  // Fonction pour gérer la visibilité des colonnes
  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: isVisible
    }));
  }

  const table = useReactTable({
    data: table_data ?? [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter,
      columnVisibility,
      pagination: {
        pageIndex: page ?? 0,
        pageSize: pageSize ?? 10
      }
    },
    onColumnVisibilityChange: setColumnVisibility, // Important: ajouter cette ligne
    initialState: {
      pagination: {
        pageSize: pageSize ?? 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    manualPagination: !!totalElements,
    pageCount: totalElements ? Math.ceil(totalElements / (pageSize ?? 10)) : -1,
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
        {title && <CardHeader title={title ?? 'Table'} className='pbe-4'/>}

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
              {FilterComponent}
              {visibleColumns && (
                <>
                  <Button variant='outlined' aria-haspopup='true' onClick={handleClick} aria-controls='customized-menu'>
                    Colonnes
                  </Button>
                  <Menu
                    keepMounted
                    elevation={0}
                    anchorEl={anchorEl}
                    id='customized-menu'
                    onClose={handleClose}
                    open={Boolean(anchorEl)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        // Obtenir le titre de la colonne de manière plus robuste
                        const columnTitle = typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id;

                        return (
                          <MenuItem
                            key={column.id}
                            onClick={(e) => {
                              e.preventDefault();
                              column.toggleVisibility();
                            }}
                            className='flex items-center gap-2'
                          >
                            <Checkbox
                              checked={column.getIsVisible()}
                              onChange={(e) => {
                                e.stopPropagation();
                                column.toggleVisibility();
                              }}
                            />
                            <Typography>{columnTitle}</Typography>
                          </MenuItem>
                        );
                      })}
                  </Menu>
                </>
              )}
              {globalFilter !== undefined && (
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter && setGlobalFilter(String(value))}
                  placeholder='Recherche'
                  className='max-sm:is-full'
                />
              )}
              {buttonadd && (
                <OpenDialogOnElementClick
                  element={buttonadd.element ? buttonadd.element : Button}
                  elementProps={buttonadd.elementProps ? buttonadd.elementProps : buttonProps}
                  dialog={buttonadd.dialog}
                />)}

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
                          asc: <i className='tabler-chevron-up text-xl'/>,
                          desc: <i className='tabler-chevron-down text-xl'/>
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
            </thead>
            {isLoading ? (<tbody>
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length} className='text-center'><LoadingWithoutModal
                padding='p-4'/></td>
            </tr>
            </tbody>) : isError ? (<tbody>
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                <ErrorView/>
              </td>
            </tr>
            </tbody>) : table.getFilteredRowModel().rows.length === 0 ? (
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
                  <tr key={row.id} className={classnames({selected: row.getIsSelected()})}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                )
              })}
              </tbody>
            )}
          </table>
        </div>
        {pagination && (
          <TablePagination
            component={() => (
              <TableManualPaginationComponent
                pageIndex={page ?? 0}
                pageSize={pageSize ?? 10}
                rowCount={totalElements ?? 0}
                currentPage={handlePageChange}
              />
            )}
            count={totalElements ?? 0}
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
