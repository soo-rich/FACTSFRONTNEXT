export type TreeNodeEnumType = 'FACTURE' | 'BORDEREAU' | 'BON_DE_COMMANDE' | 'PROFORMA'

export type TreeNodeType = {
  id: string
  type: TreeNodeEnumType
  numero: string | null
  reference: string | null
  adopt: boolean | null
  children: TreeNodeType[]
}
