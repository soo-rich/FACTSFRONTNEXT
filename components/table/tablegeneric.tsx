import {ColumnDef, Header} from "@tanstack/table-core";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
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
    VisibilityState
} from "@tanstack/react-table";
import * as React from "react";
import LoadingWithoutModal from "@/components/shared/loadingwithoutmodal";
import ErrorView from "@/components/shared/errorviews";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {IconChevronDown, IconLayoutColumns} from "@tabler/icons-react";
import {InputWithIcon} from "@/components/ui/input";
import {Search} from "lucide-react";
import {Pagination} from "@/components/ui/pagination";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
    pagination?: boolean
    columnFilters?: ColumnFiltersState
    globalFilter?: any;
    setGlobalFilter?: (value: string) => void
    renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode
    headerSessionLeftt?: React.ReactNode
    clickElement?: React.ReactNode
    visibleColumns?: boolean
};

const TableGenerique = <T,>({
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
    visibleColumns = false
}: TableGeneriqueProps<T>) => {


    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])

    const handlePageChange = (newPage: number) => {
        if (setPage) {
            setPage(newPage);
        }
    };

    const table = useReactTable({
        data: table_data ?? [],
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination: {
                pageIndex: page ?? 0,
                pageSize: pageSize ?? 10,
            }
        },
        initialState: {
            pagination: {
                pageIndex: page ?? 0,
                pageSize: pageSize ?? 10,
            }
        },

        enableRowSelection: true,
        // onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })


    return (
        <div className={'flex flex-col gap-6'}>

            <div className={'flex flex-row items-start align-middle justify-between  gap-4'}>
                {
                    pageSize && (
                        <Select>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {[5, 10, 20, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()} onClick={() => setPageSize?.(size)}>
                                            {size} items per page
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )
                }
                {
                    headerSessionLeftt ? headerSessionLeftt : null
                }
                <div className="flex flex-row justify-between align-middle sm:flex-1 items-center gap-2">
                    {globalFilter && (<InputWithIcon icon={Search} iconPosition="left" placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter?.(e.target.value)} />)}
                    {visibleColumns && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <IconLayoutColumns />
                                    <span className="hidden lg:inline">Customize Columns</span>
                                    <span className="lg:hidden">Columns</span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !== "undefined" &&
                                            column.getCanHide()
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
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {clickElement}
                </div>

            </div>

            <div className={'w-full'}>

                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : renderHeaderCell ? renderHeaderCell(header) : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {isLoading ? (<TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            ><LoadingWithoutModal /></TableCell></TableRow>) : isError ? (<TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                ><ErrorView /></TableCell></TableRow>) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.slice(0, table.getState().pagination.pageSize).map((row) => {
                                        return (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )
                                    }
                                    ))
                            : (
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
            {pagination && (<div className="flex justify-end">
                <Pagination total={0} page={page ?? 0} onChange={handlePageChange} />
            </div>)}
        </div>
    )
};

export default TableGenerique;