import {ColumnDef} from "@tanstack/table-core";

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
};

const TableGenerique = <T,>({}: TableGeneriqueProps<T>) => {};

export default TableGenerique;