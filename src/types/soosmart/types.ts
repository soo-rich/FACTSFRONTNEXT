
import type { ReactNode } from 'react'

import type * as DialogPrimitive from '@radix-ui/react-dialog'
import type { LucideIcon } from 'lucide-react'

export type ChildrenType = {
  children: ReactNode;
};

export type buttonDialogProps = {
  buttonprops?: {
    buttonIconClassName?: string,
    buttonClassName?: string,
    buttonIcon?: LucideIcon
    buttonLabel?: string,
  }
  dialogprops?: {
    title: string
    description?: string
    dialogContentClassName?: React.ComponentProps<typeof DialogPrimitive.Content>
  } & ChildrenType
}
