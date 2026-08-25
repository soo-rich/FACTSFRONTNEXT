export type ParamRequests = {
  /**
   * Index de page en **base 0** (convention des composants de table).
   * La conversion vers la base 1 attendue par l'API est faite par
   * `toApiPagination` (src/utils/pagination.ts), appelé dans les services.
   */
  page?: number
  pagesize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'ASC' |'DESC'
}
