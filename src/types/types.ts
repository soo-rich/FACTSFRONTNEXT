import { LucideIcon } from 'lucide-react';
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
  } & ChildrenType
}