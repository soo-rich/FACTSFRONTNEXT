export type TreeNodeType = {
  id: string
  type: string
  numero: string | null
  reference: string
  adopt: boolean | null
  children: TreeNodeType[]
}
