export type TreeNodeEnumType = 'FACTURE' | 'BORDEREAU' | 'BON_DE_COMMANDE' | 'PROFORMA'

export type TreeNodeOriginType = {
  id: string
  type: TreeNodeEnumType
  numero?: string
  reference?: string
}

export type TreeNodeType = {
  id: string
  type: TreeNodeEnumType
  numero: string | null
  reference: string | null
  adopt: boolean | null
  createdFrom?: TreeNodeOriginType | null
  children: TreeNodeType[]
}
