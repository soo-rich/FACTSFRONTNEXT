import type { ParamRequests } from '@/types/soosmart/pagination/paramrequestion.type'

/**
 * Convertit l'index de page du front vers le numéro de page attendu par l'API.
 *
 * Les composants de table raisonnent en **index base 0** (MUI Pagination,
 * TanStack Table), alors que l'API est paginée en **base 1** :
 * `skip = (page - 1) * pagesize` (voir `PaginationHelper` côté backend).
 *
 * Sans cette conversion, `page=0` et `page=1` produisent tous deux `skip=0` :
 * les boutons « 1 » et « 2 » affichent le même contenu, toutes les pages
 * suivantes sont décalées d'un cran et la dernière page est inatteignable.
 *
 * À appliquer dans les services, seul point de contact avec l'API : l'état des
 * vues reste ainsi en base 0, cohérent avec les composants de table.
 */
export const toApiPagination = <T extends ParamRequests>(params?: T): T | undefined => {
  if (!params) return params

  return { ...params, page: (params.page ?? 0) + 1 }
}
