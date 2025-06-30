'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  VisibilityState,
} from '@tanstack/table-core';
import React, { useState } from 'react';
import { flexRender, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import LoadingWithoutModal from '@/components/shared/loadingwithoutmodal';
import ErrorView from '@/components/shared/errorviews';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { number } from 'zod';

type TableGeneriqueProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T[] | undefined;
  columns: ColumnDef<T, any>[];
  count?: number;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  pagination?: boolean;
  columnFilters?: ColumnFiltersState;
  globalFilter?: any;
  setGlobalFilter?: (value: string) => void;
  renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode;
  headerSessionLeftt?: React.ReactNode;
  clickElement?: React.ReactNode;
  visibleColumns?: boolean;
};

const TableGeneric = <T,>({
  data: table_data,
  columns,
  page,
  setPage,
  pageSize,
  setPageSize,
  count,
  isError,
  isLoading,
  pagination = true,
  renderHeaderCell,
  globalFilter,
  setGlobalFilter,
  headerSessionLeftt,
  clickElement,
  visibleColumns = false,
}: TableGeneriqueProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handlePageChange = (newPage: string) => {
    let page = Number(newPage);
    if (setPage && page === typeof number) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    let size = Number(newPageSize);
    if (setPageSize && size === typeof number) {
      setPageSize(size);
    }
  };

  const table = useReactTable({
    data: table_data ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: {
        pageIndex: page ?? 0,
        pageSize: pageSize ?? 10,
      },
    },
    initialState: {
      pagination: {
        pageIndex: page ?? 0,
        pageSize: pageSize ?? 10,
      },
    },

    enableRowSelection: true,

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
    <div className={'flex flex-col gap-2'}>
      <div className={'flex flex-row justify-between align-middle items-start w-full gap-2'}>
        <div className={'container start-0'}>
          <div className="relative">
            <Select
              options={[
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
                { label: 20, value: 20 },
              ]}
              onChange={handlePageSizeChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        <div className={'container'}>
          <div className={'flex flex-row gap-2'}>
            {visibleColumns ? null : null}
            {clickElement ? clickElement : null}
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((column, index) => {
                      const isLast = index === headerGroup.headers.length - 1;
                      return (
                        <TableCell
                          key={column.id}
                          isHeader
                          className={`px-5 py-3 font-medium text-gray-500 ${isLast ? 'text-center' : 'text-start'} text-theme-xs dark:text-gray-400`}
                        >
                          {column.isPlaceholder
                            ? null
                            : renderHeaderCell
                              ? renderHeaderCell(column)
                              : flexRender(column.column.columnDef.header, column.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow colspan={columns.length} className={'text-center h-28'}>
                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                      <LoadingWithoutModal />
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow colspan={columns.length} className={'text-center h-28'}>
                    <TableCell className=" px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400  sm:px-6 ">
                      <ErrorView />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow colspan={columns.length} className={'text-center h-28'}>
                    <TableCell className=" px-4 py-3 text-gray-500 text-centet text-theme-sm dark:text-gray-400  sm:px-6 ">
                      {' '}
                      Rien a afficher
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <TableRow>
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={index}
                          className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableGeneric;
