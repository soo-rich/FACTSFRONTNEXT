'use client';

import TableGeneric from '@/components/table/tablegenric';
import { ArticleService } from '@/service/article/article.service';
import { ArticleType } from '@/types/article.type';
import { default as UtiliMetod, default as utilMethod } from '@/utils/utilMethod';
import ArticleForm from '@/views/article/form-article';

import OpenDialogonClick from '@/components/dialog/OpenDialogOnClick';
import { InputWithIcon } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/table-core';
import { LucidePencil, Plus, Search, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';


const columnHelper = createColumnHelper<ArticleType>();

const ArticleList = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogUp, setOpenDialogUp] = useState(false);
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
    queryFn: () => ArticleService.getArticles({ page: pageIndex, pagesize: pageSize }),
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
        header: 'Content',
        cell: info => <span>{UtiliMetod.formatDevise(info.getValue())} FCFA</span>,
      }),
      columnHelper.display({
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex flex-row gap-2 justify-center">
            <OpenDialogonClick
              open={openDialogUp}
              setOpen={setOpenDialogUp}
              buttonprops={{
                buttonIconClassName: 'text-yellow-500',
                buttonIcon: LucidePencil,
              }}
              dialogprops={{
                title: `Mise a jour ${row.original.libelle}`,
                description: 'Ajouter un Article',
                children: (<ArticleForm data={row.original} onSucces={() => setOpenDialogUp(false)} />),
              }}
            />
            <Trash2Icon className={'text-red-500'} onClick={() => utilMethod.confirmDialog({
              icon: 'warning',
              subtitle: `Vous aller suppriimer ${row.original.libelle}`,
              title: `Suppresion`,
              confirmAction: () => {
                DeleteMutation.mutate(row.original.id);
              },
            })} />
          </div>
        ),
      }),
    ],
    [],
  );

  const filteredData = useMemo(() => {
    if (!data || !data.content) return [];
    return data.content.filter(article =>
      article.libelle.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [data, filter]);


  return (
    <>
      <TableGeneric
        isLoading={isLoading}
        isError={isError}
        data={filteredData}
        columns={columns}
        totalPages={data?.totalPages}
        totalElements={data?.totalElements}
        page={pageIndex}
        pageSize={pageSize} setPage={setPageIndex} setPageSize={setPageSize} visibleColumns={true}
        rightElement={
          <div className={'flex flex-col sm:flex-row gap-3 justify-between align-middle items-end'}>
            <InputWithIcon icon={Search} iconPosition={'left'} onChange={(e) => setFilter(e.target.value)} placeholder={"Recherch un article"} />
            <OpenDialogonClick
              open={openDialog}
              setOpen={setOpenDialog}
              buttonprops={{
                buttonIcon: Plus,
                buttonLabel: 'Article',
              }}
              dialogprops={{
                title: 'Ajouter Un Article',
                description: 'Ajouter un Article',
                children: (<ArticleForm onSucces={() => setOpenDialog(false)} />),
              }}
            />
          </div>

        }
      />
    </>
  );
};
export default ArticleList;