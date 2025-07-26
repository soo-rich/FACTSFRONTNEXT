'use client';
import {ArticleService} from "@/service/article/article.service";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import {toast} from "react-toastify";
import {createColumnHelper} from "@tanstack/react-table";
import {ArticleType} from "@/types/soosmart/article.type";
import UtiliMetod from "@/utils/utilsmethod";
import TableGeneric from "@components/table/TableGeneric";
import CustomIconButton from "@core/components/mui/IconButton";
import AddEditArticle from "@views/soosmart/article/add-edit-article";
import DefaultDialog from "@components/dialogs/unique-modal/DefaultDialog";

const columnHelper = createColumnHelper<ArticleType>();

const ArticleIndex = () => {

  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');
  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | undefined>(undefined);


  const {data, isLoading, isError} = useQuery({
    queryKey: [ArticleService.ARTICLE_KEY, pageIndex, pageSize],
    queryFn: async () => {
      return await ArticleService.getArticles({page: pageIndex, pagesize: pageSize})
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
        header: 'Titre',
        cell: info => <span>{info.getValue()}</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.accessor('prix_unitaire', {
        header: 'Prix Unitaire',
        cell: info => <span>{UtiliMetod.formatDevise(info.getValue())} FCFA</span>,
        enableHiding: true, // Permet de cacher cette colonne
      }),
      columnHelper.display({
        id: 'actions', // Important: donner un ID à la colonne display
        header: 'Actions',
        cell: ({row}) => (
          <div className="flex gap-2">

            <CustomIconButton
              onClick={() => {
                setSelectedArticle(row.original);
                setIsModalOpen(true);
              }}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <i className="tabler-alert-square-rounded-filled"/>
            </CustomIconButton>

            <CustomIconButton
              onClick={() => UtiliMetod.SuppressionConfirmDialog({
                data: row.original.libelle,
                confirmAction: () => DeleteMutation.mutate(row.original.id),
                cancelAction: () => toast.info('Suppression annulée')
              })}
              className="text-red-600 hover:text-red-800"
            >
              <i className="tabler-trash"/>
            </CustomIconButton>
          </div>
        ),
        enableHiding: true, // Permet de cacher cette colonne
      }),
    ],
    [DeleteMutation],
  );

  return (
    <>
      <TableGeneric
        tabledata={data?.content}
        columns={columns}
        isError={isError}
        isLoading={isLoading}
        visibleColumns={true}
        page={pageIndex}
        pageSize={pageSize}
        SetPageSize={setPageSize}
        SetPage={setPageIndex}
        globalFilter={filter}
        setGlobalFilter={setFilter}
        totalElements={data?.totalElements}
        buttonadd={{
          action: () => setIsModalOpen(true),
        }}
      />

      <DefaultDialog open={isModalOpen} setOpen={setIsModalOpen}
                     title={selectedArticle ? `Mettre a jour ${selectedArticle.libelle}` : 'Ajouter un article'}
                     children={<AddEditArticle data={selectedArticle}
                                               onSuccess={() => {
                                                 setSelectedArticle(undefined)
                                                 setIsModalOpen(false)
                                               }}
                                               onCancel={() => {
                                                 setSelectedArticle(undefined)
                                                 setIsModalOpen(false)
                                               }}/>}/>
    </>
  );
}

export default ArticleIndex;
