import { ParamRequests } from '@/types/pagination/paramrequestion.type';
import { SaveArticleType, ArticleType } from '@/types/article.type';
import { CustomresponseType } from '@/types/customresponse.type';
import AxiosInstance from '@/service/axios-manager/axios-instance';

const url = 'article';

export class ArticleService {
  static ARTICLE_KEY = 'article';

  static getArticles = async (params?: ParamRequests) => {
    return (await AxiosInstance.get<CustomresponseType<ArticleType>>(`${url}`, { params: params }))
      .data;
  };

  static updateArticle = async (id: string, article: SaveArticleType) => {
    return (await AxiosInstance.put<ArticleType>(`${url}/${id}`, article)).data;
  };

  static addArticle = async (article: SaveArticleType) => {
    return (await AxiosInstance.post<ArticleType>(`${url}`, article)).data;
  };

  static deleteArticle = async (id: string) => {
    return (await AxiosInstance.delete(`${url}` + `/${id}`)).data;
  };
}
