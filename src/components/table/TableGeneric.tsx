'use client'

// Style Imports
import { type ReactNode, useEffect, useState } from 'react'

import classnames from 'classnames'

import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, Header, VisibilityState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { CardProps } from '@mui/material'
import { Card, CardHeader, TablePagination } from '@mui/material'

// Type Imports
import Button, { type ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import type { MenuProps } from '@mui/material/Menu'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import { ArrowDown, ArrowUp, PlusIcon, SearchX } from 'lucide-react'

import LoadingWithoutModal from '../LoadingWithoutModal'
import ErrorView from '../ErrorView'
import TableManualPaginationComponent from './TableManualPaginationComponent'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '../CustomInput/DebounceInput'
import tableStyles from '@components/table/styles/table.module.css'
import TablePaginationComponent from '@components/TablePaginationComponent'

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
  ComponentOther?: ReactNode
  isLoading?: boolean
  isError?: boolean
  visibleColumns?: boolean
  renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode
  displayTableHeaderSession?: boolean
  cardProps?: CardProps
  buttonadd?: ButtonProps
}

const Menu = styled(MuiMenu)<MenuProps>({
  '& .MuiMenu-paper': {
    border: '1px solid var(--mui-palette-divider)'
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

const TableGeneric = <T,>(props: TableProps<T>) => {
  const {
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
    ComponentOther: FilterComponent,
    isError,
    isLoading,
    pagination = true,
    renderHeaderCell,
    displayTableHeaderSession = true,
    cardProps,
    visibleColumns,
    buttonadd
  } = props

  const defaultButton: ButtonProps = {
    size: 'small',
    variant: 'contained',
    children: 'Nouveau',
    startIcon: <PlusIcon />,
    ...buttonadd
  }

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const table = useReactTable({
    data: table_data ?? [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      // En pagination serveur la recherche est déjà appliquée par l'API :
      // re-filtrer ici masquerait les lignes trouvées sur un champ non affiché
      // (email, téléphone…), jusqu'à afficher « Aucune donnée disponible »
      // alors que l'API a bien répondu.
      globalFilter: pagination ? undefined : globalFilter,
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility, // Important: ajouter cette ligne
    initialState: {
      pagination: {
        pageSize: pageSize ?? 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,

    // Dérivé du mode, pas de la donnée : avec `!!totalElements`, une liste
    // vide repassait la table en pagination cliente.
    manualPagination: pagination,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePageChange = (newPage: number) => {
    SetPage?.(newPage)
  }

  // Une nouvelle recherche repart de la première page : y rester afficherait un
  // tableau vide dès que le résultat tient sur moins de pages qu'auparavant.
  const handleGlobalFilterChange = (value?: string) => {
    setGlobalFilter?.(value ?? '')
    pagination ? SetPage?.(0) : table.setPageIndex(0)
  }

  // Le nombre de pages peut diminuer sous les pieds de l'utilisateur
  // (suppression du dernier élément d'une page, filtre plus restrictif). Sans
  // ce recadrage, la page courante reste au-delà de la dernière et le tableau
  // se fige sur un contenu vide.
  useEffect(() => {
    if (!pagination || totalElements === undefined) return

    const lastPage = Math.max(0, Math.ceil(totalElements / (pageSize || 10)) - 1)

    if ((page ?? 0) > lastPage) SetPage?.(lastPage)
  }, [pagination, totalElements, pageSize, page, SetPage])

  const handlePageSizeChange = (event: any) => {
    pagination ? SetPageSize?.(parseInt(event.target.value, 10)) : table.setPageSize(parseInt(event.target.value, 10))
    SetPage?.(0)
  }

  return (
    <>
      <Card {...cardProps}>
        {title && <CardHeader title={title ?? 'Table'} className='pbe-4' />}

        {displayTableHeaderSession && (
          <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
            {(!pagination || pageSize !== undefined) && (
              <CustomTextField
                select
                value={pagination ? (pageSize ?? 10) : table.getState().pagination.pageSize}
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
                      .filter(column => column.getCanHide())
                      .map(column => {
                        // Obtenir le titre de la colonne de manière plus robuste
                        const columnTitle =
                          typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id

                        return (
                          <MenuItem
                            key={column.id}
                            onClick={e => {
                              e.preventDefault()
                              column.toggleVisibility()
                            }}
                            className='flex items-center gap-2'
                          >
                            <Checkbox
                              checked={column.getIsVisible()}
                              onChange={e => {
                                e.stopPropagation()
                                column.toggleVisibility()
                              }}
                            />
                            <Typography>{columnTitle}</Typography>
                          </MenuItem>
                        )
                      })}
                  </Menu>
                </>
              )}
              {globalFilter !== undefined && (
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={handleGlobalFilterChange}
                  placeholder='Recherche'
                  className='max-sm:is-full'
                />
              )}

              {buttonadd ? <Button {...defaultButton} /> : null}
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
                            'flex justify-between items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ArrowUp />,
                            desc: <ArrowDown />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <LoadingWithoutModal padding='p-4' />
                  </td>
                </tr>
              </tbody>
            ) : isError ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <ErrorView />
                  </td>
                </tr>
              </tbody>
            ) : table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <div>
                      <SearchX className='mx-auto mb-2 text-gray-400' size={48} />
                      <Typography>Aucune donnée disponible</Typography>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : pagination ? (
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
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
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
        </div>
        {pagination ? (
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
            page={page ?? 0}
            onPageChange={(_, page) => {
              handlePageChange(page)
            }}
          />
        ) : (
          <TablePagination
            component={() => <TablePaginationComponent table={table as any} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        )}
      </Card>
    </>
  )
}

export default TableGeneric
