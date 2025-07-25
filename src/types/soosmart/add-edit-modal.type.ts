import {ChildrenType} from "@/types/soosmart/types";
import { ReactNode } from "react";

export type AddEditModalType = ChildrenType & {
  open: boolean
  setOpen: (open: boolean) => void,
  title?: ReactNode
  subtitle?: ReactNode
}
