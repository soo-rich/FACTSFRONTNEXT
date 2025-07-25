'use client';
import {ArticleService} from "@/service/article/article.service";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import {toast} from "react-toastify";
import {createColumnHelper} from "@tanstack/react-table";
import {ArticleType} from "@/types/soosmart/article.type";
import UtiliMetod from "@/utils/utilsmethod";
import TableGeneric from "@components/table/TableGeneric";

const columnHelper = createColumnHelper<ArticleType>();

const ArticleIndex = () => {

  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');

  const {data, isLoading, isError} = useQuery({
    queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
    queryFn: async () => {
     return await  ArticleService.getArticles({page: pageIndex, pagesize: pageSize})
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ArticleService.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
      }).then(r => r);
      toast.success('Suppresion OK ');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de l\'article');
    },
  });


  const columns = useMemo(
    () => [
      columnHelper.accessor('libelle', {
        header: 'Title',
        cell: info => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor('prix_unitaire', {
        header: 'Prix Unitaire',
        cell: info => <span>{UtiliMetod.formatDevise(info.getValue())} FCFA</span>,
      }),
      columnHelper.display({
        header: 'Action',
        cell: ({row}) => (
          <></>
        ),
      }),
    ],
    [],
  );


  return (
    <>
      <TableGeneric tabledata={data?.content} columns={columns} isError={isError} isLoading={isLoading} visibleColumns={true}
                    page={pageIndex} pageSize={pageSize} SetPageSize={setPageSize} SetPage={setPageIndex}/>
    </>
  );
}

export default ArticleIndex;
