import { LucideIcon } from "lucide-react";

export type NavItem = {
  groupLabel?: string;
  items: ItemMenu[];
}

type ItemMenu = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SubItem[];
};

type SubItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
};