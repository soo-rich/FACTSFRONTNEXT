import { ParamRequests } from '@/types/pagination/paramrequestion.type';
import { ArticleType, SaveArticleType } from '@/types/article.type';
import { CustomresponseType } from '@/types/customresponse.type';
import instance from '@/service/axios-manager/instance';

const url = 'article';

export class ArticleService {
  static ARTICLE_KEY = 'article';

  static getArticles = async (params?: ParamRequests) => {
    return (
      await instance.get<CustomresponseType<ArticleType>>(`${url}`, {
        params: params,
      })
    ).data;
  };

  static updateArticle = async (id: string, article: SaveArticleType) => {
    return (await instance.put<ArticleType>(`${url}/${id}`, article)).data;
  };

  static addArticle = async (article: SaveArticleType) => {
    return (await instance.post<ArticleType>(`${url}`, article)).data;
  };

  static deleteArticle = async (id: string) => {
    return (await instance.delete(`${url}` + `/${id}`)).data;
  };
}
