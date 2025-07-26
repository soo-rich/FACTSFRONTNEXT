import {ChildrenType} from "@/types/soosmart/types";
import { ReactNode } from "react";
import {Breakpoint} from "@mui/material/styles";

export type AddEditModalType = ChildrenType & {
  open: boolean
  setOpen: (open: boolean) => void,
  title?: ReactNode
  subtitle?: ReactNode
  OnSuccess?: () => void
  dialogMaxWidth?: false | Breakpoint | undefined
}


export type AddEditFormType<T> = {
  data?: T;
  onSuccess?: () => void; // Callback appelé après succès
  onCancel?: () => void; // Callback pour annuler
}
