import instance from '@/service/axios-manager/instance'
import type { ArticleType, SaveArticleType } from '@/types/soosmart/article.type'
import type { CustomresponseType } from '@/types/soosmart/customresponse.type'
import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'

const url = 'article'

export class ArticleService {
  static ARTICLE_KEY = url

  static getArticles = async (params?: ParamRequests) => {
    return (
      await instance.get<CustomresponseType<ArticleType>>(`${url}`, {
        params: params
      })
    ).data
  }

  static searchArticles = async (search?: string) => {
    return (
      await instance.get<ArticleType[]>(`${url}/search`, {
        params: {
          search: search
        }
      })
    ).data
  }

  static updateArticle = async (id: string, article: SaveArticleType) => {
    return (await instance.put<ArticleType>(`${url}/${id}`, article)).data
  }

  static addArticle = async (article: SaveArticleType | SaveArticleType[]) => {
    //verifier si article est un tableau
    const isArray = Array.isArray(article)
    const list = isArray && article.length > 1



    if (list) {
      return await Promise.all(article.map(async (item) => {
        return (await instance.post<ArticleType>(`${url}`, item)).data
      }))
    } else {
      return (await instance.post<ArticleType>(`${url}`, article)).data
    }
  }

  static deleteArticle = async (id: string) => {
    return (await instance.delete(`${url}` + `/${id}`)).data
  }
}
