import { ColumnDef, ColumnFiltersState, Header } from "@tanstack/react-table";


export type TableGeneriqueProps<T> = {
    isLoading: boolean;
    isError: boolean;
    data: T[] | undefined;
    columns: ColumnDef<T, any>[];
    totalPages?: number;
    totalElements?: number;
    page?: number;
    pageSize?: number;
    setPage?: (page: number) => void;
    setPageSize?: (pageSize: number) => void;
    pagination?: {
        visible?: boolean;
        simple?: boolean;
    }
    columnFilters?: ColumnFiltersState
    globalFilter?: any;
    setGlobalFilter?: (value: string) => void
    renderHeaderCell?: (header: Header<T, unknown>) => React.ReactNode
    headerSessionLeftt?: React.ReactNode
    rightElement?: React.ReactNode
    visibleColumns?: boolean

};