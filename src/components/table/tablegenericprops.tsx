import { ChildrenType } from "@/types/types";
import { ColumnDef, ColumnFiltersState, Header } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";


export type TableGeneriqueProps<T> = {
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
    buttonDialog?: {
        buttonprops?: {
            visible?: boolean,
            buttonIcon?: LucideIcon
            buttonLabel?: string,
            open?: boolean,
            setOpen?: (open: boolean) => void
        }
        dialogprops?: {
            title: string
            description?: string
        } & ChildrenType
    }
    visibleColumns?: boolean
};