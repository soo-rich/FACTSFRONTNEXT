'use client';

import { ArticleService } from '@/service/article/article.service';
import { ArticleType } from '@/types/article.type';
import UtiliMetod from '@/utils/utilsMethod';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/table-core';
import { PencilLine, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import TableGeneric from '@/components/table/TableGeneric';

const columnHelper = createColumnHelper<ArticleType>();

const ArticleList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
    queryFn: () => ArticleService.getArticles({ page: pageIndex, pagesize: pageSize }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const columns = useMemo(
    () => [
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
        cell: ({ row }) => (
          <div className="flex flex-row gap-2 justify-center">
            <PencilLine />
            <Trash2Icon />
          </div>
        ),
      }),
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!data || !data.content) return [];
    return data.content.filter(article =>
      article.libelle.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data]);

  return (
    <div>
      <h1>Articles</h1>

      <TableGeneric isLoading={isLoading} isError={isError} data={filteredData} columns={columns} />
    </div>
  );
};
export default ArticleList;
