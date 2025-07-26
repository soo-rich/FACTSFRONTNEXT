import ArticleIndex from "@views/soosmart/article";
import {ComponentLangParamsType} from "@/types/componentTypes";
import {getDictionary} from "@/utils/getDictionary";
import PathGenerate from "@components/pathbreadcrumbs/PathGenerate";

const ArticlePage = async ({params}: ComponentLangParamsType) => {
  const lang = (await params).lang
  const dictionary = await getDictionary(lang)

  return <><PathGenerate dictionary={dictionary}/> <ArticleIndex/></>
}

export default ArticlePage;
