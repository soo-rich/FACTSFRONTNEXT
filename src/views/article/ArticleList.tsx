'use client';

import OpenDialogOnElementClick from "@/components/dialogs/OpenDialogOnElementClick";
import TableGenerique from "@/components/table/tablegeneric";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ArticleService } from "@/service/article/article.service";
import { ArticleType } from "@/types/article.type";
import UtiliMetod from "@/utils/utilsMethod";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/table-core";
import { PencilLine, Trash2Icon } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

const columnHelper = createColumnHelper<ArticleType>();
const button = (variant?: string, size?: string, children?: ReactNode,): ButtonProps => ({ variant, size, children })

const ArticleList = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState('');

    const { data, isLoading, isError } = useQuery({
        queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
        queryFn: () => ArticleService.getArticles({ page: pageIndex, pagesize: pageSize }),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes


    })

    const columns = useMemo(() => [

        columnHelper.accessor('libelle', {
            header: 'Title',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('prix_unitaire', {
            header: 'Content',
            cell: info => <span>{UtiliMetod.formatDevise(info.getValue())} FCFA</span>,
        }),
        columnHelper.display({
            header: 'Action',
            cell: ({ row }) => (<div className="flex flex-row gap-2 justify-center">
                <PencilLine />
                <Trash2Icon />
            </div>),
        }),

    ], []);

    const filteredData = useMemo(() => {
        if (!data || !data.content) return [];
        return data.content.filter(article =>
            article.libelle.toLowerCase().includes(filter.toLowerCase())
        );
    }, [data]);

    return (
        <div>
            <h1>Articles</h1>
            <TableGenerique
                isLoading={false}
                isError={false}
                data={data?.content}
                columns={columns}
                page={pageIndex}
                pageSize={pageSize}
                setPage={setPageIndex}
                setPageSize={setPageSize}
                count={data?.totalElements}
                globalFilter={filter}
                setGlobalFilter={setFilter}
                clickElement={<OpenDialogOnElementClick element={Button} dialog={Dialog} elementProps={button('ghost', 'default', 'add')} />}
            />
        </div>
    );
};
export default ArticleList;