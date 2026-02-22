import type { BaseType } from '@/types/soosmart/api-default,type'
import type { ThemeColor } from '@core/types'

export enum InvoiceState {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  CANCELED = 'canceled'
}


export const  LabelInvoiceState: Record<InvoiceState, string> = {
  [InvoiceState.PENDING]: 'En attente',
  [InvoiceState.PAID]: 'Payé',
  [InvoiceState.PARTIALLY_PAID]: 'Partiellement payé',
  [InvoiceState.CANCELED]: 'Annulé'
}

export const ColorInvoiceState: Record<InvoiceState, ThemeColor> = {
  [InvoiceState.PENDING]: 'warning',
  [InvoiceState.PAID]: 'success',
  [InvoiceState.PARTIALLY_PAID]: 'info',
  [InvoiceState.CANCELED]: 'error'
}

export type FactureListType = {
  id: string
  createdat: string
  updatedat: string
  isdeleted: boolean
  numero: string
  uniqueIdDossier: string
  status: InvoiceState
} & BaseType
