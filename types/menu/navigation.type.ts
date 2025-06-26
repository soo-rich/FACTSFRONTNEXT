import React from 'react';

type IconComponent = React.ComponentType<any>;

type NavItem = {
  title: string;
  url: string;
  icon?: IconComponent;
};

type NavItemWithSub = NavItem & {
  isActive?: boolean;
  items?: Omit<NavItem, 'icon'>[];
};

export type TypeNave = {
  special?: {
    tooltip: string;
    className?: React.CSSProperties;
    icon?: IconComponent;
  };
} & { nav?: 'main' | 'secondary'; group?: boolean } & NavItemWithSub;

export type Menytable = {
  name: string;
  menu: TypeNave[];
};
