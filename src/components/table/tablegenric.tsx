'use client';

import { type UniqueIdentifier } from '@dnd-kit/core';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import ErrorView from '@/components/shared/errorviews';
import LoadingWithoutModal from '@/components/shared/loadingwithoutmodal';
import { TableGeneriqueProps } from '@/components/table/tablegenericprops';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataPagination } from '@/components/table/data-pagination';

const TableGeneric = <T extends { id: UniqueIdentifier }, >({
                                                              data: tableData,
                                                              columns,
                                                              totalPages,
                                                              totalElements,
                                                              isError,
                                                              isLoading,
                                                              page,
                                                              pageSize,
                                                              setPage,
                                                              setPageSize,
                                                              visibleColumns,
                                                              rightElement,
                                                            }: TableGeneriqueProps<T>,
) => {

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const table = useReactTable({
    data: tableData ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: {
        pageSize: pageSize ?? 10,
        pageIndex: page ?? 0,
      },
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });


  return (
    <div
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-end justify-between align-middle px-4 lg:px-6">
        <div className="hidden items-center gap-2 lg:flex">
          {
            pageSize && (
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize?.(Number(value));
                }}
              >
                <SelectTrigger size="sm" id="rows-per-page">
                  <SelectValue
                    placeholder={pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>)
          }

        </div>

        <div className="flex items-center gap-2">
          {
            visibleColumns && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconLayoutColumns />
                    <span className="hidden lg:inline">Columns</span>
                    <span className="lg:hidden">Columns</span>
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide(),
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
          {
            rightElement ? (rightElement) : null
          }

        </div>
      </div>
      <div
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 mt-4"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10 **:data-[slot=table-head]:last:text-center">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:last:w-sm">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <LoadingWithoutModal />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <ErrorView />
                  </TableCell>
                </TableRow>
              ) : tableData ? (

                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className=""
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))

              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </div>
        <div className="flex items-center justify-start px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {pageSize} sur{' '}
            {totalElements} lignes.
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {
              page && totalPages && totalElements && setPage && (
                <DataPagination currentPage={page} totalPages={totalPages} totalElements={totalElements}
                                onPageIndexChange={setPage} />
              )
            }

          </div>
        </div>
      </div>

    </div>
  );
};

export default TableGeneric;