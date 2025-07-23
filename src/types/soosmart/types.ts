import * as DialogPrimitive from '@radix-ui/react-dialog';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { ReactNode } from 'react';

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