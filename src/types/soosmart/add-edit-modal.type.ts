import {ChildrenType} from "@/types/soosmart/types";
import { ReactNode } from "react";
import {ArticleType} from "@/types/soosmart/article.type";

export type AddEditModalType = ChildrenType & {
  open: boolean
  setOpen: (open: boolean) => void,
  title?: ReactNode
  subtitle?: ReactNode
  OnSuccess?: () => void
}


export type AddEditFormType<T> = {
  data?: T;
  onSuccess?: () => void; // Callback appelé après succès
  onCancel?: () => void; // Callback pour annuler
}
